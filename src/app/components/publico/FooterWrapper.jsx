"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const rutasOcultas = [
    "/login",
    "/registro",
    "/admin",
  ];

  const ocultarFooter = rutasOcultas.some(
    (ruta) =>
      pathname === ruta ||
      pathname.startsWith(`${ruta}/`)
  );

  if (ocultarFooter) return null;

  return <Footer />;
}