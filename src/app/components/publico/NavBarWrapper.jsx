"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  const pathname = usePathname();

  const rutasOcultas = ["/login", "/register", "/", "/dashboard"];

  if (rutasOcultas.includes(pathname)) {
    return null;
  }

  return <NavBar />;
}

// Este componente es para envolver el NavBar y ocultarlo en ciertas rutas como login y register