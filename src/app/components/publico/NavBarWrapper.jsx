"use client";

import { usePathname } from "next/navigation";
import DashboardNavbar from "../usuario/DashboardNavBar";


export default function NavBarWrapper() {
    const pathname = usePathname();

    const rutasOcultas = ["/login", "/register", "/", "/dashboard", "/admin", "/admin/usuarios", "/admin/canchas", "/admin/reservas", "/admin/pagos", "/admin/torneos", "/admin/promociones", "/admin/reportes", "/admin/fixture", "/admin/final", "/admin/estadisticas", "/admin/configuracion", "/admin/estadisticas/torneos", "/admin/estadisticas/reservas", "/admin/estadisticas/pagos", "/admin/estadisticas/promociones"];

    if (
        rutasOcultas.includes(pathname) ||
        pathname.startsWith("/dashboard")
    ) {
        return null;
    }

    return <DashboardNavbar />;
}