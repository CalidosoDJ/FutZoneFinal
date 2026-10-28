"use client";

import { Bell, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DashboardNavbar() {
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [sinLeer, setSinLeer] = useState(0);

  // Cargar el usuario que inició sesión.
  useEffect(() => {
    try {
      const datos = localStorage.getItem("usuarioLogueado");

      if (datos) {
        setUsuario(JSON.parse(datos));
      }
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
    }
  }, []);

  // Cargar la cantidad de notificaciones sin leer.
  useEffect(() => {
    try {
      const datos = localStorage.getItem("notificacionesJugador");

      if (datos) {
        const lista = JSON.parse(datos);

        if (Array.isArray(lista)) {
          setSinLeer(lista.filter((item) => !item.leida).length);
        }
      }
    } catch (error) {
      console.error("Error al cargar las notificaciones:", error);
    }
  }, []);

  // Cerrar sesión.
  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 text-white px-10 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Image
            src="/icons/futzone logo.jpeg"
            alt="Logo FutZone"
            width={50}
            height={50}
            className="object-contain rounded-full"
          />

          <h1 className="text-3xl font-bold">
            Fut<span className="text-green-500">Zone</span>
          </h1>
        </div>

        {/* Menú de navegación */}
        <div className="hidden md:flex gap-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-green-500 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/mis-reservas")}
            className="hover:text-green-500 transition"
          >
            Mis Reservas
          </button>

          <button
            onClick={() => router.push("/canchas")}
            className="hover:text-green-500 transition"
          >
            Canchas
          </button>

          <button
            onClick={() => router.push("/mapa")}
            className="hover:text-green-500 transition"
          >
            Mapa
          </button>

          <button
            onClick={() => router.push("/perfil")}
            className="hover:text-green-500 transition"
          >
            Mi Perfil
          </button>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center gap-5">
          {/* Notificaciones */}
          <Link
            href="/notificaciones"
            aria-label={`Notificaciones, ${sinLeer} sin leer`}
            className="relative cursor-pointer"
          >
            <Bell
              size={24}
              className="hover:text-green-500 transition"
            />

            {sinLeer > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {sinLeer}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <User size={20} />
          </div>

          {/* Nombre del usuario */}
          <div className="hidden md:block">
            <p className="font-semibold">
              {usuario?.nombre || "Usuario"}
            </p>

            <p className="text-xs text-gray-400">Usuario</p>
          </div>

          {/* Cerrar sesión */}
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}