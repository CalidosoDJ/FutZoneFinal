
"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

// Notificar cambios de sesión y notificaciones
const EVENTO_ALMACENAMIENTO = "futzone:storage";

function suscribir(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO_ALMACENAMIENTO, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO_ALMACENAMIENTO, callback);
  };
}

// Lectura de datos almacenados
function obtenerUsuario() {
  return localStorage.getItem("usuarioLogueado");
}

function obtenerNotificaciones() {
  return localStorage.getItem("notificacionesJugador");
}

// Valor inicial para renderizado del servidor
function obtenerValorServidor() {
  return null;
}

export default function DashboardNavbar() {
  const router = useRouter();

  const datosUsuario = useSyncExternalStore(
    suscribir,
    obtenerUsuario,
    obtenerValorServidor
  );

  const datosNotificaciones = useSyncExternalStore(
    suscribir,
    obtenerNotificaciones,
    obtenerValorServidor
  );

  // Obtener usuario
  let usuario = null;

  try {
    usuario = datosUsuario
      ? JSON.parse(datosUsuario)
      : null;
  } catch (error) {
    console.error("Error al cargar usuario:", error);
  }

  // Contar notificaciones sin leer
  let sinLeer = 0;

  try {
    const lista = datosNotificaciones
      ? JSON.parse(datosNotificaciones)
      : [];

    if (Array.isArray(lista)) {
      sinLeer = lista.filter(
        (item) => !item.leida
      ).length;
    }
  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
  }

  // Verificar sesión activa
  useEffect(() => {
    if (datosUsuario === null) {
      router.replace("/login");
    }
  }, [datosUsuario, router]);

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("arbitroSesion");

    window.dispatchEvent(
      new Event(EVENTO_ALMACENAMIENTO)
    );

    router.replace("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 text-white px-4 md:px-10 py-4 shadow-lg">
      <div className="flex justify-between items-center gap-4">

        {/* LOGO */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <Image
            src="/icons/futzone logo.jpeg"
            alt="Logo FutZone"
            width={50}
            height={50}
            className="object-contain rounded-full"
          />

          <h1 className="text-2xl lg:text-3xl font-bold">
            Fut
            <span className="text-green-500">
              Zone
            </span>
          </h1>
        </Link>

        {/* MENÚ DE NAVEGACIÓN */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">

          <Link
            href="/dashboard"
            className="hover:text-green-500 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/mis-reservas"
            className="hover:text-green-500 transition"
          >
            Mis Reservas
          </Link>

          <Link
            href="/canchas"
            className="hover:text-green-500 transition"
          >
            Canchas
          </Link>

          <Link
            href="/mapa"
            className="hover:text-green-500 transition"
          >
            Mapa
          </Link>

          <Link
            href="/perfil"
            className="hover:text-green-500 transition"
          >
            Mi Perfil
          </Link>
        </div>

        {/* ACCIONES DEL USUARIO */}
        <div className="flex items-center gap-3 lg:gap-5">

          {/* NOTIFICACIONES */}
          <Link
            href="/notificaciones"
            aria-label={`Notificaciones, ${sinLeer} sin leer`}
            className="relative"
          >
            <Bell
              size={24}
              className="hover:text-green-500 transition"
            />

            {sinLeer > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {sinLeer}
              </span>
            )}
          </Link>

          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <User size={20} />
          </div>

          {/* INFORMACIÓN DEL USUARIO */}
          <div className="hidden md:block">
            <p className="font-semibold">
              {usuario?.nombre || "Usuario"}
            </p>

            <p className="text-xs text-gray-400 capitalize">
              {usuario?.rol || "Usuario"}
            </p>
          </div>

          {/* CERRAR SESIÓN */}
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 lg:px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">
              Salir
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
