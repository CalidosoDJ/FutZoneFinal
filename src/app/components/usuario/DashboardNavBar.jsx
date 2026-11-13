"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  User,
  LogOut,
  CheckCheck,
  Trash2,
  CalendarCheck,
  Menu,
  X,
  Shield,
  CircleDot,
  ChevronRight,
} from "lucide-react";

const EVENTO_ALMACENAMIENTO = "futzone:storage";

function suscribir(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO_ALMACENAMIENTO, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO_ALMACENAMIENTO, callback);
  };
}

function obtenerSesion() {
  return localStorage.getItem("usuarioLogueado");
}

function obtenerSesionServidor() {
  return null;
}

function obtenerNotificaciones() {
  return localStorage.getItem("notificacionesJugador");
}

function obtenerFotoPerfil() {
  const sesion = localStorage.getItem("usuarioLogueado");

  if (!sesion) return null;

  try {
    const usuario = JSON.parse(sesion);
    const id = usuario?.id_usuario ?? usuario?.id;

    if (id == null) return null;

    return localStorage.getItem(`fotoPerfil_${id}`);
  } catch {
    return null;
  }
}

function actualizarAlmacenamiento() {
  window.dispatchEvent(new Event(EVENTO_ALMACENAMIENTO));
}

function guardarNotificaciones(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
  actualizarAlmacenamiento();
}

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const datosUsuario = useSyncExternalStore(
    suscribir,
    obtenerSesion,
    obtenerSesionServidor,
  );

  const datosNotificacionesGenerales = useSyncExternalStore(
    suscribir,
    obtenerNotificaciones,
    obtenerSesionServidor,
  );

  const fotoPerfil = useSyncExternalStore(
    suscribir,
    obtenerFotoPerfil,
    obtenerSesionServidor,
  );

  let usuario = null;

  try {
    usuario = datosUsuario ? JSON.parse(datosUsuario) : null;
  } catch (error) {
    console.error("Error leyendo la sesión:", error);
  }

  const idUsuario = usuario?.id_usuario ?? usuario?.id;

  // Notificaciones asociadas al usuario autenticado.
  const claveNotificaciones =
    idUsuario != null
      ? `notificacionesJugador_${idUsuario}`
      : "notificacionesJugador";

  const datosNotificacionesUsuario = useSyncExternalStore(
    suscribir,
    () => localStorage.getItem(claveNotificaciones),
    obtenerSesionServidor,
  );

  let notificaciones = [];

  try {
    const datos = datosNotificacionesUsuario ?? datosNotificacionesGenerales;

    const lista = datos ? JSON.parse(datos) : [];

    notificaciones = Array.isArray(lista) ? lista : [];
  } catch (error) {
    console.error("Error leyendo las notificaciones:", error);
  }

  const sinLeer = notificaciones.filter(
    (notificacion) => !notificacion.leida,
  ).length;

  // Verificar la sesión sin actualizar estados durante el render.
  useEffect(() => {
    if (!datosUsuario) {
      router.replace("/login");
    }
  }, [datosUsuario, router]);

  const cerrarPaneles = () => {
    setMostrarMenu(false);
    setMostrarDropdown(false);
  };

  const marcarComoLeidas = () => {
    const listaActualizada = notificaciones.map((notificacion) => ({
      ...notificacion,
      leida: true,
    }));

    guardarNotificaciones(claveNotificaciones, listaActualizada);
  };

  const eliminarNotificacion = (id) => {
    const listaActualizada = notificaciones.filter(
      (notificacion) => notificacion.id !== id,
    );

    guardarNotificaciones(claveNotificaciones, listaActualizada);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("arbitroSesion");

    actualizarAlmacenamiento();
    cerrarPaneles();

    router.replace("/login");
  };

  const enlaces = [
    { nombre: "Dashboard", ruta: "/dashboard" },
    { nombre: "Canchas", ruta: "/canchas" },
    { nombre: "Mis reservas", ruta: "/mis-reservas" },
    { nombre: "Mapa", ruta: "/mapa" },
    { nombre: "Mi perfil", ruta: "/perfil" },
  ];

  const esActivo = (ruta) =>
    pathname === ruta || pathname?.startsWith(`${ruta}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080d0b]/95 text-white shadow-[0_10px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-80" />

      <nav className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/dashboard"
          onClick={cerrarPaneles}
          className="group flex shrink-0 items-center gap-3"
          aria-label="Ir al Dashboard de FutZone"
        >
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-green-400/30 bg-green-400/10 p-1.5 shadow-[0_0_22px_rgba(74,222,128,0.10)] transition duration-300 group-hover:border-green-400/70">
            <Image
              src="/icons/futzone logo.jpeg"
              alt="Logo FutZone"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-black uppercase italic leading-none tracking-tight sm:text-2xl">
              FUT<span className="text-green-400">ZONE</span>
            </h1>
            <p className="mt-1.5 hidden text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500 sm:block">
              Tu pasión, tu cancha
            </p>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1.5 lg:flex">
          {enlaces.map((enlace) => {
            const activo = esActivo(enlace.ruta);

            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                onClick={cerrarPaneles}
                className={`relative rounded-xl px-4 py-3 text-sm font-bold transition duration-200 ${
                  activo
                    ? "bg-green-400/10 text-green-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {activo && (
                  <span className="absolute inset-x-4 bottom-1 h-[2px] rounded-full bg-green-400" />
                )}
                {enlace.nombre}
              </Link>
            );
          })}
        </div>

        {/* ACCIONES DEL USUARIO */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NOTIFICACIONES */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMostrarDropdown((anterior) => !anterior);
                setMostrarMenu(false);
              }}
              aria-label="Abrir notificaciones"
              aria-expanded={mostrarDropdown}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                mostrarDropdown
                  ? "border-green-400/40 bg-green-400/10 text-green-300"
                  : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-green-400/30 hover:bg-green-400/10 hover:text-green-300"
              }`}
            >
              <Bell size={20} />

              {sinLeer > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-[#080d0b] bg-green-400 px-1 text-[10px] font-black text-black">
                  {sinLeer > 99 ? "99+" : sinLeer}
                </span>
              )}
            </button>

            {mostrarDropdown && (
              <>
                <button
                  type="button"
                  aria-label="Cerrar notificaciones"
                  onClick={() => setMostrarDropdown(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 z-50 mt-3 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/10 bg-[#101712] shadow-[0_25px_80px_rgba(0,0,0,0.65)] sm:w-[390px]">
                  {/* ENCABEZADO */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0b110d] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                        <Bell size={19} />
                      </div>

                      <div>
                        <h3 className="font-black">Notificaciones</h3>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {sinLeer} sin leer
                        </p>
                      </div>
                    </div>

                    {sinLeer > 0 && (
                      <button
                        type="button"
                        onClick={marcarComoLeidas}
                        className="flex items-center gap-1.5 text-xs font-bold text-green-400 transition hover:text-green-300"
                      >
                        <CheckCheck size={15} />
                        Leer todas
                      </button>
                    )}
                  </div>

                  {/* LISTADO */}
                  <div className="max-h-[min(400px,60vh)] divide-y divide-white/[0.06] overflow-y-auto">
                    {notificaciones.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <Bell size={30} className="mx-auto text-gray-600" />
                        <p className="mt-3 font-bold text-gray-300">
                          Todo tranquilo
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Aquí aparecerán tus notificaciones.
                        </p>
                      </div>
                    ) : (
                      notificaciones.map((notificacion) => (
                        <div
                          key={notificacion.id}
                          className={`group p-4 transition hover:bg-white/[0.035] ${
                            !notificacion.leida
                              ? "border-l-2 border-green-400 bg-green-400/[0.035]"
                              : "border-l-2 border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-green-400">
                              <CalendarCheck size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold text-white">
                                  {notificacion.titulo}
                                </h4>

                                {!notificacion.leida && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-400" />
                                )}
                              </div>

                              <p className="mt-1.5 break-words text-xs leading-5 text-gray-400">
                                {notificacion.mensaje}
                              </p>

                              <span className="mt-2 block text-[10px] text-gray-500">
                                {notificacion.fecha}
                                {notificacion.hora
                                  ? ` · ${notificacion.hora}`
                                  : ""}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                eliminarNotificacion(notificacion.id)
                              }
                              aria-label="Eliminar notificación"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-400/10 hover:text-red-400"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notificaciones.length > 0 && (
                    <div className="border-t border-white/[0.08] bg-[#0b110d] px-5 py-3">
                      <p className="text-center text-[11px] text-gray-500">
                        FUTZONE · Centro de notificaciones
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* PERFIL */}
          <Link
            href="/perfil"
            onClick={cerrarPaneles}
            className="group flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-1.5 pr-3 transition hover:border-green-400/30 hover:bg-green-400/[0.05]"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-green-400/40 bg-[#17251b]">
              {fotoPerfil ? (
                <Image
                  src={fotoPerfil}
                  alt="Foto de perfil"
                  width={36}
                  height={36}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={19} className="text-green-300" />
              )}
            </div>

            <div className="hidden max-w-[125px] sm:block">
              <p className="truncate text-xs font-black text-white transition group-hover:text-green-300">
                {usuario?.nombre || usuario?.usuario || "Jugador"}
              </p>

              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                <CircleDot size={9} className="text-green-400" />
                {usuario?.rol || "Jugador"}
              </p>
            </div>

            <ChevronRight
              size={14}
              className="hidden text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-green-400 sm:block"
            />
          </Link>

          {/* CERRAR SESIÓN */}
          <button
            type="button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.07] px-3 text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15 sm:px-4"
          >
            <LogOut size={17} />
            <span className="hidden text-xs font-black sm:inline">SALIR</span>
          </button>

          {/* MENÚ MÓVIL */}
          <button
            type="button"
            onClick={() => {
              setMostrarMenu((anterior) => !anterior);
              setMostrarDropdown(false);
            }}
            aria-label={mostrarMenu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mostrarMenu}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:border-green-400/30 hover:text-green-300 lg:hidden"
          >
            {mostrarMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* MENÚ RESPONSIVE */}
      {mostrarMenu && (
        <div className="border-t border-white/[0.08] bg-[#0b110d] px-4 py-4 shadow-2xl lg:hidden sm:px-6">
          <div className="mx-auto grid max-w-[1500px] gap-2">
            {enlaces.map((enlace) => {
              const activo = esActivo(enlace.ruta);

              return (
                <Link
                  key={enlace.ruta}
                  href={enlace.ruta}
                  onClick={cerrarPaneles}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-bold transition ${
                    activo
                      ? "border-green-400/20 bg-green-400/10 text-green-300"
                      : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {enlace.nombre}
                  <ChevronRight size={16} />
                </Link>
              );
            })}

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <Shield size={19} className="text-green-400" />

              <div>
                <p className="text-xs font-black uppercase tracking-wider">
                  FutZone Player
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Tu espacio deportivo
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
