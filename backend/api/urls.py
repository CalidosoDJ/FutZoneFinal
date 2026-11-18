from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CanchaViewSet,
    SedeViewSet,
    UsuarioViewSet,
    LoginViewSet,
    ReservaViewSet,
    PagoViewSet,
    NotificacionViewSet,
    PublicacionViewSet,
    asistente,
    verificar_sesion,
    cerrar_sesion,
    comunidad_mensajes,
    chat_privado,
)

# Enrutador principal de Django REST Framework
router = DefaultRouter()
router.register(r"canchas", CanchaViewSet, basename="canchas")
router.register(r"sedes", SedeViewSet, basename="sedes")
router.register(r"usuarios", UsuarioViewSet, basename="usuarios")
router.register(r"login", LoginViewSet, basename="login")
router.register(r"reservas", ReservaViewSet, basename="reservas")
router.register(r"pagos", PagoViewSet, basename="pagos")
router.register(r"notificaciones", NotificacionViewSet, basename="notificaciones")
router.register(r"publicaciones", PublicacionViewSet, basename="publicaciones")

urlpatterns = [
    # Rutas generadas por los ViewSets (incluye /api/notificaciones/, /api/notificaciones/<pk>/leida/, etc.)
    path("", include(router.urls)),

    # Rutas personalizadas del sistema FutZone
    path("asistente/", asistente, name="asistente"),
    path("verificar-sesion/", verificar_sesion, name="verificar_sesion"),
    path("cerrar-sesion/", cerrar_sesion, name="cerrar_sesion"),
    path("comunidad/", comunidad_mensajes, name="comunidad_mensajes"),
    path("chat/<int:usuario_id>/", chat_privado, name="chat_privado"),
]