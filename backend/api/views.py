
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
import secrets
import hashlib

from datetime import timedelta
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.response import Response

from django.core.files.storage import default_storage
from .serializers import PublicacionSerializer

from .models import (
    Canchas,
    Sede,
    Usuarios,
    Reservas,
    Pagos,
    Notificaciones,
    Publicaciones,
    SesionesUsuario
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
                f"para la cancha {cancha.nombre}. "
                f"Estado: {pago.estado}."
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
        pago.fecha_pago = timezone.now()
        pago.save(update_fields=["estado", "fecha_pago"])

        crear_notificacion(
            usuario=pago.id_reserva.id_usuario,
            titulo="¡Pago confirmado!",
            mensaje=(
                f"Tu pago para la cancha "
                f"{pago.id_reserva.id_cancha.nombre} fue aprobado."
            ),
            tipo="reserva",
            referencia=pago.id_reserva.id_reserva,
        )

        return Response({
            "mensaje": "Pago confirmado correctamente.",
            "pago": PagoSerializer(pago).data,
        })

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
                "No fue posible aprobar el pago de tu reserva. "
                "Comunícate con el administrador."
            ),
            tipo="reserva",
            referencia=pago.id_reserva.id_reserva,
        )

        return Response({
            "mensaje": "Pago rechazado correctamente.",
            "pago": PagoSerializer(pago).data,
        })



from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Reservas, Notificaciones
from .serializers import ReservaSerializer

def crear_notificacion(usuario, titulo, mensaje, tipo, referencia):
    """Función de apoyo para crear notificaciones limpias en la BD"""
    Notificaciones.objects.create(
        id_usuario=usuario,
        titulo=titulo,
        mensaje=mensaje,
        tipo=tipo,
        id_referencia=referencia,
        leido=0
    )

class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    permission_classes = [AllowAny]

    queryset = Reservas.objects.select_related(
        "id_usuario",
        "id_cancha"
    ).all().order_by("-fecha_reserva", "-hora_inicio")

    def get_queryset(self):
        reservas = super().get_queryset()
        id_usuario = self.request.query_params.get("id_usuario")

        if id_usuario and str(id_usuario).isdigit():
            reservas = reservas.filter(id_usuario_id=int(id_usuario))

        return reservas

    def perform_create(self, serializer):
        # Guardamos la reserva y obtenemos la instancia real del modelo
        reserva = serializer.save()

        # Obtenemos el nombre de la cancha de forma segura gracias a select_related
        nombre_cancha = getattr(reserva.id_cancha, 'nombre_cancha', None) or getattr(reserva.id_cancha, 'nombre', 'Cancha FutZone')

        # Creamos la notificación automática en la base de datos
        crear_notificacion(
            usuario=reserva.id_usuario,
            titulo="⚽ ¡Nueva Reserva Creada!",
            mensaje=(
                f"Tu reserva en {nombre_cancha} ha sido registrada "
                f"para el {reserva.fecha_reserva} de {str(reserva.hora_inicio)[:5]} a {str(reserva.hora_fin)[:5]}. "
                f"Estado: {reserva.estado}."
            ),
            tipo="reserva",
            referencia=reserva.id_reserva
        )
def perform_update(self, serializer):
    estado_anterior = serializer.instance.estado

    reserva = serializer.save()

    if estado_anterior != reserva.estado:
        try:
            crear_notificacion(
                usuario=reserva.id_usuario,
                titulo="Actualización de reserva",
                mensaje=(
                    f"El estado de tu reserva para "
                    f"{reserva.id_cancha.nombre} cambió de "
                    f"{estado_anterior} a {reserva.estado}."
                ),
                tipo="reserva",
                referencia=reserva.id_reserva,
            )

        except Exception as error:
            print(
                "ERROR AL CREAR NOTIFICACIÓN:",
                str(error)
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


class LoginViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            usuario = serializer.validated_data["usuario"]

            # Generar token único para esta pestaña
            token = secrets.token_urlsafe(32)

            # Guardar únicamente el hash del token
            token_hash = hashlib.sha256(
                token.encode("utf-8")
            ).hexdigest()

            # Crear sesión independiente
            SesionesUsuario.objects.create(
                id_usuario=usuario,
                token_hash=token_hash,
                fecha_expiracion=timezone.now() + timedelta(days=7),
                activa=True
            )

            return Response({
                "mensaje": "Inicio de sesión exitoso",
                "token": token,
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "nombre_completo": usuario.nombre_completo,
                    "username": usuario.username,
                    "email": usuario.email,
                    "telefono": usuario.telefono,
                    "id_rol": usuario.id_rol_id,
                    "estado": usuario.estado,
                }
            }, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Notificaciones
from .serializers import NotificacionesSerializer

class NotificacionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificacionesSerializer
    permission_classes = [AllowAny]
    queryset = Notificaciones.objects.all().order_by("-fecha_envio")

    def get_queryset(self):
        queryset = Notificaciones.objects.all().order_by("-fecha_envio")
        id_usuario = self.request.query_params.get("id_usuario")

        if id_usuario and str(id_usuario).isdigit():
            queryset = queryset.filter(id_usuario_id=int(id_usuario))
        else:
            # Si no viene el usuario, devolvemos vacío para evitar errores
            return Notificaciones.objects.none()

        leido = self.request.query_params.get("leido")
        if leido in ("0", "1"):
            queryset = queryset.filter(leido=int(leido))

        return queryset

    @action(detail=True, methods=["patch"])
    def leida(self, request, pk=None):
        try:
            notificacion = self.get_object()
            notificacion.leido = 1
            notificacion.save(update_fields=["leido"])
            return Response({"mensaje": "Notificación marcada como leída."}, status=status.HTTP_200_OK)
        except Notificaciones.DoesNotExist:
            return Response({"error": "No encontrada"}, status=status.HTTP_404_NOT_FOUND)

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
        }, status=status.HTTP_200_OK)
    
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


import hashlib

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import SesionesUsuario


def obtener_sesion(request):
    autorizacion = request.headers.get("Authorization", "")

    if not autorizacion.startswith("Bearer "):
        return None

    token = autorizacion[len("Bearer "):].strip()

    if not token:
        return None

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    try:
        sesion = SesionesUsuario.objects.select_related(
            "id_usuario"
        ).get(
            token_hash=token_hash,
            activa=True,
            fecha_expiracion__gt=timezone.now()
        )

        if sesion.id_usuario.estado != "activo":
            return None

        return sesion

    except SesionesUsuario.DoesNotExist:
        return None


@api_view(["GET"])
def verificar_sesion(request):
    sesion = obtener_sesion(request)

    if not sesion:
        return Response(
            {"mensaje": "Sesión inválida o expirada"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    usuario = sesion.id_usuario

    return Response({
        "autenticado": True,
        "usuario": {
            "id_usuario": usuario.id_usuario,
            "nombre_completo": usuario.nombre_completo,
            "username": usuario.username,
            "email": usuario.email,
            "telefono": usuario.telefono,
            "id_rol": usuario.id_rol_id,
            "estado": usuario.estado
        }
    })


@api_view(["POST"])
def cerrar_sesion(request):
    sesion = obtener_sesion(request)

    if not sesion:
        return Response(
            {"mensaje": "La sesión ya no está activa"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    sesion.activa = False
    sesion.save(update_fields=["activa"])

    return Response({
        "mensaje": "Sesión cerrada correctamente"
    })
from .models import CommunityMessage
from .serializers import CommunityMessageSerializer


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def comunidad_mensajes(request):
    sesion = obtener_sesion(request)

    if not sesion:
        return Response(
            {"error": "No autenticado o sesión expirada."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    usuario = sesion.id_usuario

    # Validación robusta de rol de jugador (por ID 2 o por nombre de rol)
    es_jugador = False
    if usuario.id_rol_id == 2:
        es_jugador = True
    elif usuario.id_rol:
        try:
            rol_nombre = str(usuario.id_rol.nombre).strip().lower()
            if "jugador" in rol_nombre:
                es_jugador = True
        except Exception:
            pass

    if not es_jugador:
        return Response(
            {"error": "Acceso denegado. Esta comunidad es exclusiva para jugadores."},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == "GET":
        mensajes = CommunityMessage.objects.select_related("id_usuario").order_by("-created_at")[:60]
        mensajes_ordenados = list(reversed(mensajes))
        serializer = CommunityMessageSerializer(mensajes_ordenados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = CommunityMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(id_usuario=usuario)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# En views.py de Django
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import MensajePrivado, Usuarios
from .serializers import MensajePrivadoSerializer # (O creas un serializador sencillo para este modelo)

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def chat_privado(request, usuario_id):
    sesion = obtener_sesion(request)
    if not sesion:
        return Response({"error": "No autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
    
    usuario_actual = sesion.id_usuario

    if request.method == "GET":
        # Obtener mensajes intercambiados entre el usuario actual y el otro usuario (usuario_id)
        mensajes = MensajePrivado.objects.filter(
            id_remitente__in=[usuario_actual.id_usuario, usuario_id],
            id_destinatario__in=[usuario_actual.id_usuario, usuario_id]
        ).order_by("fecha_envio")
        
        serializer = MensajePrivadoSerializer(mensajes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        contenido = request.data.get("contenido", "").strip()
        if not contenido:
            return Response({"error": "El contenido no puede estar vacío."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            destinatario = Usuarios.objects.get(pk=usuario_id)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario destinatario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        nuevo_mensaje = MensajePrivado.objects.create(
            id_remitente=usuario_actual,
            id_destinatario=destinatario,
            contenido=contenido
        )
        
        serializer = MensajePrivadoSerializer(nuevo_mensaje)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import MensajePrivado, Usuarios
from .serializers import MensajePrivadoSerializer

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def chat_privado(request, usuario_id):
    # Usamos tu misma función de autenticación por token que ya usa el resto de tu app
    sesion = obtener_sesion(request) # O la función que uses en tus vistas para validar el token Bearer
    
    # Si por alguna razón tu helper se llama diferente, validamos el token directamente del header:
    if not sesion:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            # Buscamos la sesión activa con este token (ajusta según tu modelo de SesionesUsuario)
            from .models import SesionesUsuario
            try:
                sesion_obj = SesionesUsuario.objects.get(token=token, activo=True)
                usuario_actual = sesion_obj.id_usuario
            except SesionesUsuario.DoesNotExist:
                return Response({"error": "Token no válido o expirado."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"error": "No autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        usuario_actual = sesion.id_usuario

    try:
        # Buscamos al otro usuario destinatario
        try:
            otro_usuario = Usuarios.objects.get(pk=usuario_id)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == "GET":
            # Filtramos los mensajes entre el usuario actual y el otro usuario
            mensajes = MensajePrivado.objects.filter(
                id_remitente__in=[usuario_actual, otro_usuario],
                id_destinatario__in=[usuario_actual, otro_usuario]
            ).order_by("fecha_envio")
            
            serializer = MensajePrivadoSerializer(mensajes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "POST":
            contenido = request.data.get("contenido", "").strip()
            if not contenido:
                return Response({"error": "El contenido no puede estar vacío."}, status=status.HTTP_400_BAD_REQUEST)

            nuevo_mensaje = MensajePrivado.objects.create(
                id_remitente=usuario_actual,
                id_destinatario=otro_usuario,
                contenido=contenido
            )
            
            serializer = MensajePrivadoSerializer(nuevo_mensaje)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Error en chat_privado:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
@permission_classes([AllowAny])
def listar_mis_chats(request):
    sesion = obtener_sesion(request)
    if not sesion:
        return Response({"error": "No autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
    
    usuario_actual = sesion.id_usuario

    # Buscamos todos los mensajes donde el usuario actual sea remitente o destinatario
    mensajes = MensajePrivado.objects.filter(
        id_remitente=usuario_actual
    ) | MensajePrivado.objects.filter(
        id_destinatario=usuario_actual
    )
    
    # Extraemos los IDs únicos de los otros usuarios con los que ha chateado
    ids_contactos = set()
    for m in mensajes:
        if m.id_remitente != usuario_actual:
            ids_contactos.add(m.id_remitente)
        if m.id_destinatario != usuario_actual:
            ids_contactos.add(m.id_destinatario)

    # Serializamos la lista de usuarios con los que tiene chat
    from .serializers import UsuarioSerializer
    serializer = UsuarioSerializer(ids_contactos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)