"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();

  const rutasOcultas = ["/login", "/register", "/", "/dashboard", "/admin", "/admin/usuarios", "/admin/canchas", "/admin/reservas", "/admin/pagos", "/admin/torneos", "/admin/promociones", "/admin/reportes", "/admin/fixture", "/admin/final", "/admin/estadisticas", "/admin/configuracion", "/admin/estadisticas/torneos", "/admin/estadisticas/reservas", "/admin/estadisticas/pagos", "/admin/estadisticas/promociones"];

  if (
    rutasOcultas.includes(pathname) ||
    pathname.startsWith("/dashboard")
  ) {
    return null;
  }

  return <NavBar />;
}

// Este componente es para envolver el NavBar y ocultarlo en ciertas rutas como login y register