from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Canchas, Sede, Usuarios, Reservas

from .serializers import (
    CanchaSerializer,
    SedeSerializer,
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    LoginSerializer,
    ReservaSerializer
)


class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer

    queryset = Reservas.objects.select_related(
        'id_usuario',
        'id_cancha'
    ).all().order_by('-fecha_reserva', '-hora_inicio')

    def get_queryset(self):
        reservas = super().get_queryset()

        # Permite consultar las reservas de un jugador:
        # /api/reservas/?id_usuario=2
        id_usuario = self.request.query_params.get('id_usuario')

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

    @action(detail=False, methods=['post'])
    def registro(self, request):

        serializer = RegistroUsuarioSerializer(data=request.data)

        if serializer.is_valid():

            usuario = serializer.save()

            return Response(
                {
                    'mensaje': 'Usuario registrado correctamente',
                    'id_usuario': usuario.id_usuario,
                    'nombre_completo': usuario.nombre_completo,
                    'username': usuario.username,
                    'email': usuario.email,
                },
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

            usuario = serializer.validated_data['usuario']

            return Response(
                {
                    'mensaje': 'Inicio de sesión exitoso',
                    'usuario': {
                        'id_usuario': usuario.id_usuario,
                        'nombre_completo': usuario.nombre_completo,
                        'username': usuario.username,
                        'email': usuario.email,
                        'telefono': usuario.telefono,
                        'id_rol': usuario.id_rol_id,
                        'estado': usuario.estado,
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )