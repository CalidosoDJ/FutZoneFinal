
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from decimal import Decimal

from rest_framework import serializers

from .models import Canchas, Sede, Usuarios, Reservas


class CanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canchas
        fields = '__all__'


class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuarios
        fields = [
            'nombre_completo',
            'username',
            'email',
            'password',
            'telefono',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')

        usuario = Usuarios.objects.create(
            id_rol_id=2,
            password_hash=make_password(password),
            estado='activo',
            **validated_data
        )

        return usuario


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email']
        password = data['password']

        try:
            usuario = Usuarios.objects.get(email=email)
        except Usuarios.DoesNotExist:
            raise serializers.ValidationError(
                'El correo o la contraseña son incorrectos.'
            )

        if not check_password(password, usuario.password_hash):
            raise serializers.ValidationError(
                'El correo o la contraseña son incorrectos.'
            )

        if usuario.estado != 'activo':
            raise serializers.ValidationError(
                'El usuario se encuentra inactivo.'
            )

        data['usuario'] = usuario
        return data


class ReservaSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.CharField(
        source='id_usuario.nombre_completo',
        read_only=True
    )
    nombre_cancha = serializers.CharField(
        source='id_cancha.nombre',
        read_only=True
    )

    class Meta:
        model = Reservas
        fields = [
            'id_reserva',
            'id_usuario',
            'nombre_usuario',
            'id_cancha',
            'nombre_cancha',
            'fecha_reserva',
            'hora_inicio',
            'hora_fin',
            'total',
            'estado',
            'fecha_creacion',
        ]
        read_only_fields = [
            'id_reserva',
            'nombre_usuario',
            'nombre_cancha',
            'total',
            'estado',
            'fecha_creacion',
        ]

    def validate(self, data):
        cancha = data.get(
            'id_cancha',
            getattr(self.instance, 'id_cancha', None)
        )
        fecha = data.get(
            'fecha_reserva',
            getattr(self.instance, 'fecha_reserva', None)
        )
        inicio = data.get(
            'hora_inicio',
            getattr(self.instance, 'hora_inicio', None)
        )
        fin = data.get(
            'hora_fin',
            getattr(self.instance, 'hora_fin', None)
        )

        if inicio and fin and inicio >= fin:
            raise serializers.ValidationError(
                'La hora de inicio debe ser anterior a la hora de finalización.'
            )

        if fecha and fecha < timezone.localdate():
            raise serializers.ValidationError(
                'No puedes reservar una fecha que ya pasó.'
            )

        if cancha and fecha and inicio and fin:
            reservas_existentes = Reservas.objects.filter(
                id_cancha=cancha,
                fecha_reserva=fecha,
                hora_inicio__lt=fin,
                hora_fin__gt=inicio,
            ).exclude(
                estado__in=['cancelada', 'cancelado', 'anulada']
            )

            if self.instance:
                reservas_existentes = reservas_existentes.exclude(
                    id_reserva=self.instance.id_reserva
                )

            if reservas_existentes.exists():
                raise serializers.ValidationError(
                    'La cancha ya tiene una reserva en ese horario.'
                )

        return data

    def create(self, validated_data):
        cancha = validated_data['id_cancha']
        inicio = validated_data['hora_inicio']
        fin = validated_data['hora_fin']

        inicio_minutos = inicio.hour * 60 + inicio.minute
        fin_minutos = fin.hour * 60 + fin.minute
        duracion_horas = Decimal(
            fin_minutos - inicio_minutos
        ) / Decimal('60')

        total = cancha.precio_hora * duracion_horas

        return Reservas.objects.create(
            **validated_data,
            total=total,
            estado='pendiente',
            fecha_creacion=timezone.now()
        )
