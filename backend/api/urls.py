from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import (
    CanchaViewSet,
    SedeViewSet,
    UsuarioViewSet,
    LoginViewSet,
    ReservaViewSet
)



router = DefaultRouter()
router.register('reservas', ReservaViewSet)
router.register('canchas', CanchaViewSet)
router.register('sedes', SedeViewSet)
router.register('usuarios', UsuarioViewSet)
router.register('login', LoginViewSet, basename='login')


urlpatterns = [
    path('', include(router.urls)),
]