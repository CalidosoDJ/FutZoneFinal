from django.utils import timezone
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