"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Sparkles,
  X,
  LogIn,
  UserPlus,
  ChevronRight,
  ShieldCheck,
  Trophy,
} from "lucide-react";

export default function Footer() {
  const anio = new Date().getFullYear();
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);

  // Redes Sociales Oficiales
  const redes = [
    {
      nombre: "Facebook",
      imagen: "/icons/facebook.png",
      href: "https://www.facebook.com/",
      color: "hover:bg-blue-600 hover:text-white border-gray-200",
    },
    {
      nombre: "Instagram",
      imagen: "/icons/instagram.png",
      href: "https://www.instagram.com/",
      color: "hover:bg-pink-600 hover:text-white border-gray-200",
    },
    {
      nombre: "WhatsApp",
      icono: MessageCircle,
      href: "https://wa.me/",
      color: "hover:bg-green-600 hover:text-white border-gray-200",
    },
  ];

  return (
    <>
      <footer className="relative border-t border-gray-200 bg-gray-950 font-sans text-gray-800 shadow-xs">
        {/* Línea verde decorativa superior */}
        <div className="absolute left-1/2 top-0 h-[2px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* 1. MARCA Y PRESENTACIÓN */}
            <div className="flex items-center gap-4">
              <Link href="/" className="group flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-1 transition group-hover:border-green-500 shadow-2xs">
                  <Image
                    src="/icons/futzone logo.jpeg"
                    alt="Logo FutZone"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-xl object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    FUT<span className="text-green-600">ZONE</span>
                  </h2>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400">
                    Tu pasión, tu cancha
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. BOTÓN INTERACTIVO "CONOCE MÁS" */}
            <div>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-green-600/20 transition hover:from-green-700 hover:to-emerald-600 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <Sparkles size={16} className="animate-pulse text-green-200" />
                <span>Conoce más sobre FutZone</span>
                <ChevronRight size={15} className="transition group-hover:translate-x-1" />
              </button>
            </div>

            {/* 3. REDES SOCIALES */}
            <div className="flex items-center gap-3">
              <span className="text-2x1 font-bold text-white uppercase tracking-wider hidden sm:inline-block">
                Síguenos:
              </span>
              <div className="flex gap-2">
                {redes.map((red) => {
                  const Icono = red.icono;

                  return (
                    <a
                      key={red.nombre}
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={red.nombre}
                      className={`flex h-15 w-15 items-center justify-center rounded-2xl border bg-gray-50 text-gray-600 shadow-2xs transition-all ${red.color}`}
                    >
                      {red.imagen ? (
                        <Image
                          src={red.imagen}
                          alt={red.nombre}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : (
                        <Icono size={20} />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="mt-8 border-gray-100 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
            <p className="text-center sm:text-left">
              © {anio} <span className="font-bold text-gray-800">FutZone</span>. Todos los derechos reservados.
            </p>
            <div className="flex items-center justify-center gap-1.5 font-medium">
              Popayán, Colombia <span className="text-green-600">⚽</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">

            {/* Botón Cerrar */}
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Cabecera del Modal */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Vive la experiencia <span className="text-green-600">FutZone</span>
                </h3>
                <p className="text-xs font-semibold text-gray-400">
                  Reserva, juega y compite
                </p>
              </div>
            </div>

            {/* Mensaje descriptivo */}
            <div className="mt-5 space-y-3 text-xs leading-relaxed text-gray-600">
              <p>
                En <strong>FutZone</strong> transformamos la forma de reservar tus sintéticas en Popayán. Encuentra las mejores canchas disponibles, consulta horarios en tiempo real y organiza tus torneos o encuentros en segundos.
              </p>

              <div className="rounded-2xl border border-green-200 bg-green-50/70 p-3.5 flex items-center gap-3 text-green-800">
                <ShieldCheck size={22} className="shrink-0 text-green-600" />
                <span className="font-semibold text-[11px]">
                  Para gestionar reservas o crear tu cancha en el sistema debes contar con una cuenta activa.
                </span>
              </div>
            </div>

            {/* Acciones de Login / Registro */}
            <div className="mt-6 space-y-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setModalAbierto(false);
                  router.push("/login");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-xs font-bold text-white shadow-md shadow-green-600/20 hover:bg-green-700 transition cursor-pointer"
              >
                <LogIn size={16} />
                Iniciar Sesión
              </button>

              <button
                onClick={() => {
                  setModalAbierto(false);
                  router.push("/register");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-gray-50 py-3 text-xs font-bold text-gray-700 hover:bg-white hover:border-gray-400 transition cursor-pointer"
              >
                <UserPlus size={16} />
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}