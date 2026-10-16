"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// icons
import { LayoutDashboard, Users, CalendarDays, MapPinned, CreditCard, Trophy, Gift, BarChart3, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menu = [
        {
            nombre: "Dashboard",
            ruta: "/admin",
            icono: LayoutDashboard
        },
        {
            nombre: "Usuarios",
            ruta: "/admin/usuarios",
            icono: Users
        },
        {
            nombre: "Canchas",
            ruta: "/admin/canchas",
            icono: MapPinned
        },
        {
            nombre: "Reservas",
            ruta: "/admin/reservas",
            icono: CalendarDays
        },
        {
            nombre: "Pagos",
            ruta: "/admin/pagos",
            icono: CreditCard
        },
        {
            nombre: "Torneos",
            ruta: "/admin/torneos",
            icono: Trophy
        },
        {
            nombre: "Promociones",
            ruta: "/admin/promociones",
            icono: Gift
        },
        {
            nombre: "Reportes",
            ruta: "/admin/reportes",
            icono: BarChart3
        },
        {
            nombre: "Configuración",
            ruta: "/admin/configuracion",
            icono: Settings
        }
    ];

    const cerrarSesion = () => {
        localStorage.removeItem("usuarioLogueado");
        router.replace("/login");
    };

    return (
        <aside className="w-64 bg-gray-950 text-white flex flex-col h-screen sticky top-0 shrink-0 border-r border-gray-800">
            {/* Header del Sidebar */}
            <div className="p-8 border-b border-gray-800 shrink-0">
                <h1 className="text-3xl font-bold">
                    Fut
                    <span className="text-green-500">
                        Zone
                    </span>
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                    Panel Administrativo
                </p>
            </div>

            {/* Menú de navegación con scroll independiente */}
            <nav className="flex-1 mt-6 overflow-y-auto admin-sidebar-scroll">
                {menu.map((item) => {
                    const Icono = item.icono;

                    return (
                        <Link
                            key={item.nombre}
                            href={item.ruta}
                            className={`flex items-center gap-4 px-8 py-4 transition
                            ${pathname === item.ruta
                                    ? "bg-green-600 font-semibold"
                                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                                }`}
                        >
                            <Icono size={22} />
                            {item.nombre}
                        </Link>
                    );
                })}
            </nav>

            {/* Botón de Cerrar Sesión fijo al fondo */}
            <div className="p-4 border-t border-gray-800 shrink-0">
                <button
                    onClick={cerrarSesion}
                    className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-red-600/90 text-gray-300 hover:text-white transition font-semibold cursor-pointer"
                >
                    <LogOut size={22} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}