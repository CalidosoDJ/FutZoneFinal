"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useArbitro } from "@/app/context/ArbitroContext";

import {
  FaHome,
  FaFutbol,
  FaClipboardList,
  FaBell,
  FaUserTie,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SidebarArbitro() {
  const pathname = usePathname();
  const router = useRouter();
  const { arbitro, notificaciones } = useArbitro();

  // Calcular notificaciones pendientes por leer
  const sinLeerCount = notificaciones?.filter((n) => !n.leida).length || 0;

  const handleCerrarSesion = () => {
    // Redirigir al login o landing
    router.push("/");
  };

  const menu = [
    {
      nombre: "Dashboard",
      ruta: "/arbitro/dashboard",
      icono: <FaHome />,
    },
    {
      nombre: "Mis Partidos",
      ruta: "/arbitro/partidos-asignados",
      icono: <FaFutbol />,
    },
    {
      nombre: "Resumen Partido",
      ruta: "/arbitro/resumen-partido",
      icono: <FaClipboardList />,
    },
    {
      nombre: "Notificaciones",
      ruta: "/arbitro/notificaciones",
      icono: <FaBell />,
      badge: sinLeerCount,
    },
    {
      nombre: "Mi Perfil",
      ruta: "/arbitro/perfil",
      icono: <FaUserTie />,
    },
  ];

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-slate-900 text-white flex flex-col justify-between shadow-xl overflow-y-auto z-50">
      <div>
        {/* Logo FutZone */}
        <div className="p-8 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-green-500">⚽ FutZone</h1>
          <p className="text-sm text-gray-400 mt-2">Panel del Árbitro</p>
        </div>

        {/* Info Perfil */}
        <div className="p-6 flex items-center gap-4">
          <img
            src={arbitro?.foto || "https://i.pravatar.cc/300?img=15"}
            alt={arbitro?.nombre || "Árbitro"}
            className="w-14 h-14 rounded-full border-2 border-green-500 object-cover"
          />

          <div>
            <h2 className="font-semibold text-white">{arbitro?.nombre}</h2>
            <p className="text-sm text-gray-400">{arbitro?.categoria}</p>

            {/* Estado dinámico desde el Contexto */}
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 mt-1 ${
                arbitro?.disponible ? "text-green-400" : "text-gray-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  arbitro?.disponible ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {arbitro?.disponible ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="mt-2">
          {menu.map((item) => {
            const isActive = pathname === item.ruta;
            return (
              <Link
                key={item.ruta}
                href={item.ruta}
                className={`flex items-center justify-between px-8 py-4 transition font-medium ${
                  isActive
                    ? "bg-green-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icono}</span>
                  <span>{item.nombre}</span>
                </div>

                {/* Contador de notificaciones no leídas */}
                {Boolean(item.badge) && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón Cerrar Sesión */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={handleCerrarSesion}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}