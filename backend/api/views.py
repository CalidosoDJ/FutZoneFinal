
from django.utils import timezone
from openai import OpenAI, OpenAIError
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)
from django.core.files.storage import default_storage
from .serializers import PublicacionSerializer

from .models import (
    Canchas,
    Sede,
    Usuarios,
    Reservas,
    Pagos,
    Notificaciones,
    Publicaciones
)

from .serializers import (
    CanchaSerializer,
    SedeSerializer,
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    LoginSerializer,
    ReservaSerializer,
    PagoSerializer,
    NotificacionSerializer,
)

def crear_notificacion(usuario, titulo, mensaje, tipo="sistema", referencia=None):
    return Notificaciones.objects.create(
        id_usuario=usuario,
        titulo=titulo,
        mensaje=mensaje,
        tipo=tipo,
        id_referencia=referencia,
        leido=0,
        fecha_envio=timezone.now(),
    )

class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer
    permission_classes = [AllowAny]

    queryset = Pagos.objects.select_related(
        "id_reserva",
        "id_reserva__id_usuario",
        "id_reserva__id_cancha",
    ).all().order_by("-id_pago")

    def perform_create(self, serializer):
        metodo = serializer.validated_data["metodo_pago"]
        estado_inicial = (
            "Pendiente" if metodo == "Nequi" else "Pagado"
        )

        pago = serializer.save(
            estado=estado_inicial,
            fecha_pago=timezone.now(),
        )

        usuario = pago.id_reserva.id_usuario
        cancha = pago.id_reserva.id_cancha

        crear_notificacion(
            usuario=usuario,
            titulo="Pago registrado",
            mensaje=(
                f"Registramos tu pago de ${pago.monto} "
                f"para la reserva de {cancha.nombre}. "
                f"Estado del pago: {pago.estado}."
            ),
            tipo="reserva",
            referencia=pago.id_reserva.id_reserva,
        )

    @action(detail=True, methods=["patch"])
    def aprobar(self, request, pk=None):
        pago = self.get_object()

        if pago.estado != "Pendiente":
            return Response(
                {"error": "Solo se pueden aprobar pagos pendientes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pago.estado = "Pagado"
        pago.save(update_fields=["estado"])

        crear_notificacion(
            usuario=pago.id_reserva.id_usuario,
            titulo="¡Pago confirmado!",
            mensaje=(
                f"Tu pago para la cancha "
                f"{pago.id_reserva.id_cancha.nombre} fue aprobado. "
                "Tu pago ha sido confirmado."
            ),
            tipo="reserva",
            referencia=pago.id_reserva.id_reserva,
        )

        return Response({
            "mensaje": "Pago confirmado correctamente.",
            "pago": PagoSerializer(pago).data,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"])
    def rechazar(self, request, pk=None):
        pago = self.get_object()

        if pago.estado != "Pendiente":
            return Response(
                {"error": "Solo se pueden rechazar pagos pendientes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pago.estado = "Rechazado"
        pago.save(update_fields=["estado"])

        crear_notificacion(
            usuario=pago.id_reserva.id_usuario,
            titulo="Pago rechazado",
            mensaje=(
                f"No fue posible aprobar el pago de tu reserva "
                f"para {pago.id_reserva.id_cancha.nombre}. "
                "Revisa el pago o comunícate con el administrador."
            ),
            tipo="reserva",
            referencia=pago.id_reserva.id_reserva,
        )

        return Response({
            "mensaje": "Pago rechazado correctamente.",
            "pago": PagoSerializer(pago).data,
        }, status=status.HTTP_200_OK)

class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer

    queryset = Reservas.objects.select_related(
        "id_usuario",
        "id_cancha"
    ).all().order_by("-fecha_reserva", "-hora_inicio")

    def get_queryset(self):
        reservas = super().get_queryset()
        id_usuario = self.request.query_params.get("id_usuario")

        if id_usuario:
            reservas = reservas.filter(id_usuario_id=id_usuario)

        return reservas

    def perform_create(self, serializer):
        reserva = serializer.save()

        crear_notificacion(
            usuario=reserva.id_usuario,
            titulo="Reserva registrada",
            mensaje=(
                f"Tu reserva para la cancha "
                f"{reserva.id_cancha.nombre} ha sido registrada "
                f"para el {reserva.fecha_reserva}, "
                f"de {reserva.hora_inicio} a {reserva.hora_fin}. "
                f"Estado actual: {reserva.estado}."
            ),
            tipo="reserva",
            referencia=reserva.id_reserva,
        )


class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Canchas.objects.all()
    serializer_class = CanchaSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        archivo = self.request.FILES.get("imagen")

        if archivo:
            ruta = default_storage.save(
                f"canchas/{archivo.name}",
                archivo
            )
            serializer.save(imagen_url=ruta)
        else:
            serializer.save()

    def perform_update(self, serializer):
        archivo = self.request.FILES.get("imagen")

        if archivo:
            ruta = default_storage.save(
                f"canchas/{archivo.name}",
                archivo
            )
            serializer.save(imagen_url=ruta)
        else:
            serializer.save()


class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        id_usuario = self.request.query_params.get("id_usuario")
        email = self.request.query_params.get("email")

        if id_usuario:
            queryset = queryset.filter(id_usuario=id_usuario)

        if email:
            queryset = queryset.filter(email=email)

        return queryset

    @action(detail=False, methods=["post"])
    def registro(self, request):
        datos = request.data.copy()
        datos["id_rol"] = 2

        serializer = RegistroUsuarioSerializer(data=datos)

        if serializer.is_valid():
            usuario = serializer.save()

            return Response(
                UsuarioSerializer(usuario).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        # 🟢 NUEVA ACCIÓN: RESTABLECER CONTRASEÑA EN DJANGO
    @action(detail=False, methods=['post'], url_path='reset-password')
    def reset_password(self, request):
        token = request.data.get('token', '').strip()
        new_password = request.data.get('newPassword') or request.data.get('new_password')

        if not token or not new_password:
            return Response(
                {'message': 'El token y la nueva contraseña son obligatorios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. Buscar usuario por el token y comprobar que no haya expirado
            usuario = Usuarios.objects.get(
                reset_token=token)
            
            # Imprime en la consola de Django para verificar la hora
            print("Token encontrado para el usuario:", usuario.email)
            print("Hora de expiración en BD:", usuario.reset_token_expires)
            print("Hora actual de Django:", timezone.now())     
            
            from django.contrib.auth.hashers import make_password
            usuario.password_hash = make_password(new_password)
            usuario.reset_token = None
            usuario.reset_token_expires = None
            usuario.save()
            
            return Response(
                {'message': 'Contraseña restablecida con éxito.'},
                status=status.HTTP_200_OK
            )

        except Usuarios.DoesNotExist:
            return Response(
                {'message': 'El enlace es inválido o ha expirado.'},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            usuario = serializer.validated_data["usuario"]

            return Response(
                {
                    "mensaje": "Inicio de sesión exitoso",
                    "usuario": {
                        "id_usuario": usuario.id_usuario,
                        "nombre_completo": usuario.nombre_completo,
                        "username": usuario.username,
                        "email": usuario.email,
                        "telefono": usuario.telefono,
                        "id_rol": usuario.id_rol_id,
                        "estado": usuario.estado,
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class NotificacionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [AllowAny]

    queryset = Notificaciones.objects.all().order_by("-fecha_envio")

    def get_queryset(self):
        queryset = Notificaciones.objects.all().order_by("-fecha_envio")

        id_usuario = self.request.query_params.get("id_usuario")

        if id_usuario and id_usuario.isdigit():
            queryset = queryset.filter(
                id_usuario_id=int(id_usuario)
            )
        else:
            # No devolver notificaciones si falta un usuario válido.
            return Notificaciones.objects.none()

        leido = self.request.query_params.get("leido")

        if leido in ("0", "1"):
            queryset = queryset.filter(leido=int(leido))

        return queryset

    @action(detail=True, methods=["patch"])
    def leida(self, request, pk=None):
        notificacion = self.get_object()
        notificacion.leido = 1
        notificacion.save(update_fields=["leido"])

        return Response({
            "mensaje": "Notificación marcada como leída."
        })

    @action(detail=False, methods=["post"])
    def marcar_todas_leidas(self, request):
        id_usuario = request.data.get("id_usuario")

        if not str(id_usuario or "").isdigit():
            return Response(
                {"error": "Debes proporcionar un id_usuario válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        actualizadas = Notificaciones.objects.filter(
            id_usuario_id=int(id_usuario),
            leido=0,
        ).update(leido=1)

        return Response({
            "mensaje": "Notificaciones marcadas como leídas.",
            "actualizadas": actualizadas,
        })


class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicaciones.objects.all().order_by("-fecha_publicacion")
    serializer_class = PublicacionSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Publicaciones.objects.all().order_by("-fecha_publicacion")

        # El administrador puede consultar todas las publicaciones.
        # El jugador solo verá las que estén publicadas.
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            if self.request.query_params.get("publicadas") == "true":
                queryset = queryset.filter(estado="Publicado")

        return queryset

    def perform_create(self, serializer):
        archivo = self.request.FILES.get("imagen")

        if archivo:
            ruta = default_storage.save(
                f"publicaciones/{archivo.name}", archivo
            )
            serializer.save(imagen_url=ruta)
        else:
            serializer.save()

    def perform_update(self, serializer):
        archivo = self.request.FILES.get("imagen")

        if archivo:
            ruta = default_storage.save(
                f"publicaciones/{archivo.name}", archivo
            )
            serializer.save(imagen_url=ruta)
        else:
            serializer.save()

@api_view(["POST"])
@permission_classes([AllowAny])
def asistente(request):
    mensaje = request.data.get("mensaje", "").strip()

    if not mensaje:
        return Response(
            {"error": "Debes escribir un mensaje."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(mensaje) > 2000:
        return Response(
            {"error": "El mensaje es demasiado largo."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not settings.OPENAI_API_KEY:
        return Response(
            {"error": "El asistente no está configurado."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    try:
        cliente = OpenAI(api_key=settings.OPENAI_API_KEY)

        respuesta = cliente.responses.create(
            model="gpt-5.5",
            instructions="""
            Eres el asistente virtual oficial de FutZone,
            una plataforma para reservar canchas sintéticas
            de fútbol en Popayán, Colombia.

            Responde en español, de forma amable, clara y breve.
            Ayuda con preguntas sobre reservas, pagos, canchas,
            sedes y funcionamiento de FutZone.

            No inventes precios, horarios, disponibilidad ni
            información que no conozcas.
            No afirmes que has creado, cancelado o modificado
            una reserva o un pago.
            Si no conoces un dato, indícalo claramente y
            recomienda contactar con el administrador.
            """,
            input=mensaje
        )

        return Response({
            "respuesta": respuesta.output_text
        })

    except OpenAIError as e:
      print("ERROR OPENAI:", type(e).__name__)
      print("DETALLE:", str(e))
      print("CODIGO:", getattr(e, "code", None))
      print("ESTADO:", getattr(e, "status_code", None))

    return Response(
        {"error": "Error de conexión con OpenAI."},
        status=status.HTTP_502_BAD_GATEWAY
    )