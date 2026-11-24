"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BotonFlotanteComunidad() {
  const pathname = usePathname();

  // Solo lo ocultamos si ya estás dentro de la comunidad o en login/registro/admin
  const rutasOcultas = [
    "/comunidad",
    "/jugador/comunidad",
    "/login",
    "/registro",
    "/reset-password",
    "/admin",
    "/arbitro",
  ];

  if (rutasOcultas.some((ruta) => pathname.startsWith(ruta))) {
    return null;
  }

  return (
    <Link
      href="/comunidad"
      className="fixed bottom-6 left-6 z-[9999] group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(16,185,129,0.5)] transition-all duration-300 hover:scale-105 border border-emerald-400/40"
    >
      {/* Punto verde animado */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
      </span>

      <div className="flex flex-col text-left pr-1">
        <span className="text-xs font-extrabold tracking-wide uppercase leading-none flex items-center gap-1.5">
          ⚽ Comunidad
        </span>
        <span className="text-[10px] text-emerald-100 font-medium mt-0.5">
          Retos y Parches
        </span>
      </div>
    </Link>
  );
}