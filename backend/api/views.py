
from django.utils import timezone

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Canchas, Sede, Usuarios, Reservas, Pagos

from .serializers import (
    CanchaSerializer,
    SedeSerializer,
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    LoginSerializer,
    ReservaSerializer,
    PagoSerializer,
)


class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer

    # Temporalmente permite probar la API.
    # Después debemos restringir los permisos.
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

        serializer.save(
            estado=estado_inicial,
            fecha_pago=timezone.now()
        )

    @action(detail=True, methods=["patch"])
    def aprobar(self, request, pk=None):
        pago = self.get_object()

        if pago.estado != "Pendiente":
            return Response(
                {"error": "Solo se pueden aprobar pagos pendientes."},
                status=status.HTTP_400_BAD_REQUEST
            )

        pago.estado = "Pagado"
        pago.save(update_fields=["estado"])

        return Response(
            {
                "mensaje": "Pago confirmado correctamente.",
                "pago": PagoSerializer(pago).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["patch"])
    def rechazar(self, request, pk=None):
        pago = self.get_object()

        if pago.estado != "Pendiente":
            return Response(
                {"error": "Solo se pueden rechazar pagos pendientes."},
                status=status.HTTP_400_BAD_REQUEST
            )

        pago.estado = "Rechazado"
        pago.save(update_fields=["estado"])

        return Response(
            {
                "mensaje": "Pago rechazado correctamente.",
                "pago": PagoSerializer(pago).data
            },
            status=status.HTTP_200_OK
        )


class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer

    queryset = Reservas.objects.select_related(
        "id_usuario",
        "id_cancha"
    ).all().order_by("-fecha_reserva", "-hora_inicio")

    def get_queryset(self):
        reservas = super().get_queryset()

        # Permite filtrar por usuario:
        # /api/reservas/?id_usuario=2
        id_usuario = self.request.query_params.get("id_usuario")

        if id_usuario:
            reservas = reservas.filter(id_usuario_id=id_usuario)

        return reservas


class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Canchas.objects.all()
    serializer_class = CanchaSerializer


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
