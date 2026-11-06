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
  const { arbitro } = useArbitro();

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
    },
    {
      nombre: "Mi Perfil",
      ruta: "/arbitro/perfil",
      icono: <FaUserTie />,
    },
  ];

  // 🌟 FUNCIÓN PARA CERRAR SESIÓN
  const cerrarSesion = () => {
    // 1. Limpia las credenciales almacenadas
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");
    localStorage.removeItem("chat-futzone"); // Opcional, si deseas limpiar el estado

    // 2. Redirige a la pantalla de inicio de sesión
    router.push("/login");
  };

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-slate-900 text-white flex flex-col justify-between shadow-xl overflow-y-auto z-40">
      <div>
        <div className="p-8 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-green-500">⚽ FutZone</h1>
          <p className="text-sm text-gray-400 mt-2">Panel del Árbitro</p>
        </div>

        <div className="p-6 flex items-center gap-4">
          <img
            src={arbitro?.foto || "/images/default-avatar.png"}
            alt={arbitro?.nombre || "Árbitro"}
            className="w-14 h-14 rounded-full border-2 border-green-500 object-cover bg-slate-800"
          />

          <div>
            <h2 className="font-semibold">{arbitro?.nombre || "Árbitro"}</h2>
            <p className="text-sm text-gray-400">{arbitro?.categoria || "General"}</p>
            <span className="text-green-400 text-xs">🟢 Disponible</span>
          </div>
        </div>

        <nav className="mt-4">
          {menu.map((item) => (
            <Link
              key={item.ruta}
              href={item.ruta}
              className={`flex items-center gap-4 px-8 py-4 transition ${pathname === item.ruta
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-slate-800 text-gray-300 hover:text-white"
                }`}
            >
              <span className="text-xl">{item.icono}</span>
              {item.nombre}
            </Link>
          ))}
        </nav>
      </div>

      {/* 🌟 BOTÓN CON EVENTO ONCLICK Y ESTILOS MEJORADOS */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={cerrarSesion}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 font-semibold py-3 rounded-xl transition cursor-pointer shadow-lg shadow-red-600/20"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}