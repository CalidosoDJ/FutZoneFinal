
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PagoViewSet,
    ReservaViewSet,
    CanchaViewSet,
    SedeViewSet,
    UsuarioViewSet,
    LoginViewSet,
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

# Finalmente, declaramos las URL
urlpatterns = [
    path("", include(router.urls)),
]
