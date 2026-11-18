
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import google_auth
from .views import ChatbotAPIView

from .views import (
    PagoViewSet,
    ReservaViewSet,
    CanchaViewSet,
    SedeViewSet,
    UsuarioViewSet,
    LoginViewSet,
    NotificacionViewSet,
    PublicacionViewSet,
    asistente
)

# Primero creamos el router
router = DefaultRouter()

# Después registramos las rutas
router.register("pagos", PagoViewSet, basename="pagos")
router.register("reservas", ReservaViewSet, basename="reservas")
router.register("canchas", CanchaViewSet, basename="canchas")
router.register("sedes", SedeViewSet, basename="sedes")
router.register("usuarios", UsuarioViewSet, basename="usuarios")
router.register("login", LoginViewSet, basename="login")
router.register( "notificaciones",  NotificacionViewSet, basename="notificaciones",)
router.register(r"publicaciones",PublicacionViewSet,basename="publicaciones")

# Finalmente, declaramos las URL
urlpatterns = [
    path("asistente/", asistente, name="asistente"),
    path("auth/google/", google_auth, name="google_auth"),
    path("chatbot/", ChatbotAPIView.as_view(), name="futzone-chatbot"),
    path("", include(router.urls)),
]