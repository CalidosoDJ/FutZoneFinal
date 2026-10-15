# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class ArbitroPartidoEventos(models.Model):
    id_evento = models.AutoField(primary_key=True)
    id_resumen = models.ForeignKey('ArbitroPartidoResumen', models.DO_NOTHING, db_column='id_resumen')
    minuto = models.IntegerField()
    tipo_evento = models.CharField(max_length=16)
    equipo = models.CharField(max_length=9)
    jugador_nombre = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arbitro_partido_eventos'


class ArbitroPartidoResumen(models.Model):
    id_resumen = models.AutoField(primary_key=True)
    id_asignacion = models.OneToOneField('ArbitroPartidos', models.DO_NOTHING, db_column='id_asignacion')
    goles_local = models.IntegerField(blank=True, null=True)
    goles_visitante = models.IntegerField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    calificacion_partido = models.IntegerField(blank=True, null=True)
    fecha_registro = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arbitro_partido_resumen'


class ArbitroPartidos(models.Model):
    id_asignacion = models.AutoField(primary_key=True)
    id_usuario_arbitro = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario_arbitro')
    num_partido = models.CharField(max_length=20)
    equipo_local = models.CharField(max_length=100)
    equipo_visitante = models.CharField(max_length=100)
    sede = models.CharField(max_length=150)
    fecha_partido = models.DateField()
    hora_partido = models.TimeField()
    categoria = models.CharField(max_length=50, blank=True, null=True)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arbitro_partidos'


class Canchas(models.Model):
    id_cancha = models.AutoField(primary_key=True)
    id_sede = models.ForeignKey('Sede', models.DO_NOTHING, db_column='id_sede')
    id_tipo = models.ForeignKey('TiposCancha', models.DO_NOTHING, db_column='id_tipo')
    nombre = models.CharField(max_length=100)
    precio_hora = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=13, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'canchas'


class ChatbotConocimiento(models.Model):
    id_conocimiento = models.AutoField(primary_key=True)
    categoria = models.CharField(max_length=50)
    intencion = models.CharField(max_length=100)
    palabras_clave = models.TextField()
    respuesta = models.TextField()
    activo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chatbot_conocimiento'


class ChatbotConversaciones(models.Model):
    id_conversacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario', blank=True, null=True)
    estado = models.CharField(max_length=7, blank=True, null=True)
    fecha_inicio = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chatbot_conversaciones'


class ChatbotMensajes(models.Model):
    id_mensaje = models.AutoField(primary_key=True)
    id_conversacion = models.ForeignKey(ChatbotConversaciones, models.DO_NOTHING, db_column='id_conversacion')
    remitente = models.CharField(max_length=7)
    mensaje = models.TextField()
    leido = models.IntegerField(blank=True, null=True)
    fecha_envio = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chatbot_mensajes'


class Notificaciones(models.Model):
    id_notificacion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario')
    titulo = models.CharField(max_length=150)
    mensaje = models.TextField()
    tipo = models.CharField(max_length=12, blank=True, null=True)
    id_referencia = models.IntegerField(blank=True, null=True)
    leido = models.IntegerField(blank=True, null=True)
    fecha_envio = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notificaciones'


class Pagos(models.Model):
    id_pago = models.AutoField(primary_key=True)
    id_reserva = models.ForeignKey('Reservas', models.DO_NOTHING, db_column='id_reserva')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=13)
    comprobante_url = models.CharField(max_length=255, blank=True, null=True)
    estado = models.CharField(max_length=9, blank=True, null=True)
    fecha_pago = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagos'


class PerfilArbitro(models.Model):
    id_perfil = models.AutoField(primary_key=True)
    id_usuario = models.OneToOneField('Usuarios', models.DO_NOTHING, db_column='id_usuario')
    categoria = models.CharField(max_length=50, blank=True, null=True)
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    partidos_dirigidos = models.IntegerField(blank=True, null=True)
    disponible = models.IntegerField(blank=True, null=True)
    fecha_ingreso = models.DateField()

    class Meta:
        managed = False
        db_table = 'perfil_arbitro'


class Publicaciones(models.Model):
    id_publicacion = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=9)
    imagen_url = models.CharField(max_length=255, blank=True, null=True)
    fecha_publicacion = models.DateField()
    estado = models.CharField(max_length=9)
    fecha_creacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'publicaciones'


class Reservas(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usuario')
    id_cancha = models.ForeignKey(Canchas, models.DO_NOTHING, db_column='id_cancha')
    fecha_reserva = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=10, blank=True, null=True)
    fecha_creacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reservas'


class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'roles'


class Sede(models.Model):
    id_sede = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    ciudad = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.CharField(max_length=100, blank=True, null=True)
    horario_apertura = models.TimeField()
    horario_cierre = models.TimeField()
    latitud = models.DecimalField(max_digits=10, decimal_places=8)
    longitud = models.DecimalField(max_digits=11, decimal_places=8)
    permitir_cancelaciones = models.IntegerField(blank=True, null=True)
    horas_limite_cancelacion = models.IntegerField(blank=True, null=True)
    notif_nuevas_reservas = models.IntegerField(blank=True, null=True)
    notif_cancelaciones = models.IntegerField(blank=True, null=True)
    notif_pagos = models.IntegerField(blank=True, null=True)
    notif_nuevos_torneos = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sede'


class TiposCancha(models.Model):
    id_tipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'tipos_cancha'


class TorneoEquipos(models.Model):
    id_equipo = models.AutoField(primary_key=True)
    id_torneo = models.ForeignKey('Torneos', models.DO_NOTHING, db_column='id_torneo')
    id_capitan = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_capitan')
    nombre_equipo = models.CharField(max_length=100)
    estado_pago = models.CharField(max_length=10, blank=True, null=True)
    fecha_inscripcion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'torneo_equipos'


class TorneoPartidos(models.Model):
    id_partido = models.AutoField(primary_key=True)
    id_torneo = models.ForeignKey('Torneos', models.DO_NOTHING, db_column='id_torneo')
    id_equipo_local = models.ForeignKey(TorneoEquipos, models.DO_NOTHING, db_column='id_equipo_local')
    id_equipo_visitante = models.ForeignKey(TorneoEquipos, models.DO_NOTHING, db_column='id_equipo_visitante', related_name='torneopartidos_id_equipo_visitante_set')
    id_cancha = models.ForeignKey(Canchas, models.DO_NOTHING, db_column='id_cancha', blank=True, null=True)
    fecha_partido = models.DateField()
    hora_partido = models.TimeField()
    goles_local = models.IntegerField(blank=True, null=True)
    goles_visitante = models.IntegerField(blank=True, null=True)
    fase = models.CharField(max_length=50, blank=True, null=True)
    estado = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'torneo_partidos'


class Torneos(models.Model):
    id_torneo = models.AutoField(primary_key=True)
    id_tipo = models.ForeignKey(TiposCancha, models.DO_NOTHING, db_column='id_tipo')
    nombre = models.CharField(max_length=150)
    precio_inscripcion = models.DecimalField(max_digits=10, decimal_places=2)
    equipos_maximos = models.IntegerField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)
    estado = models.CharField(max_length=13, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'torneos'


class Usuarios(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    id_rol = models.ForeignKey(Roles, models.DO_NOTHING, db_column='id_rol')
    nombre_completo = models.CharField(max_length=150)
    username = models.CharField(unique=True, max_length=50, blank=True, null=True)
    email = models.CharField(unique=True, max_length=100)
    password_hash = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    foto_url = models.CharField(max_length=255, blank=True, null=True)
    estado = models.CharField(max_length=9, blank=True, null=True)
    fecha_registro = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'

