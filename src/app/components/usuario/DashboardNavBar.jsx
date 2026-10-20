"use client";

import Link from "next/link";
import { Bell, User, LogOut, CheckCheck, Trash2, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardNavbar() {
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [notificaciones, setNotificaciones] = useState([]);
    const [sinLeer, setSinLeer] = useState(0);
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    useEffect(() => {
        const datosUsuario = localStorage.getItem("usuarioLogueado");

        if (!datosUsuario) {
            router.replace("/login");
            return;
        }

        const user = JSON.parse(datosUsuario);
        setUsuario(user);

        // 1. CARGAR FOTO DE PERFIL DEL USUARIO ESPECÍFICO
        const fotoGuardada = localStorage.getItem(`fotoPerfil_${user.id}`);
        if (fotoGuardada) {
            setFotoPerfil(fotoGuardada);
        }

        // 2. CARGAR NOTIFICACIONES ESPECÍFICAS DEL USUARIO
        const claveNotif = `notificacionesJugador_${user.id}`;
        const datosNotificaciones = localStorage.getItem(claveNotif);
        if (datosNotificaciones) {
            const lista = JSON.parse(datosNotificaciones);
            setNotificaciones(lista);
            setSinLeer(lista.filter((item) => !item.leida).length);
        }
    }, [router]);

    // MARCAR TODAS COMO LEÍDAS
    const marcarComoLeidas = () => {
        if (!usuario) return;
        const claveNotif = `notificacionesJugador_${usuario.id}`;
        const listaActualizada = notificaciones.map((n) => ({ ...n, leida: true }));
        setNotificaciones(listaActualizada);
        setSinLeer(0);
        localStorage.setItem(claveNotif, JSON.stringify(listaActualizada));
    };

    // ELIMINAR NOTIFICACIÓN
    const eliminarNotificacion = (id) => {
        if (!usuario) return;
        const claveNotif = `notificacionesJugador_${usuario.id}`;
        const listaFiltrada = notificaciones.filter((n) => n.id !== id);
        setNotificaciones(listaFiltrada);
        setSinLeer(listaFiltrada.filter((item) => !item.leida).length);
        localStorage.setItem(claveNotif, JSON.stringify(listaFiltrada));
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuarioLogueado");
        router.replace("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-gray-950 text-white px-8 py-4 shadow-lg border-b border-gray-800">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo */}
                <div
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
                >
                    <Image
                        src="/icons/futzone logo.jpeg"
                        alt="Logo FutZone"
                        width={45}
                        height={45}
                        className="object-contain rounded-full border border-green-500"
                    />
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        Fut<span className="text-green-500">Zone</span>
                    </h1>
                </div>

                {/* Menú */}
                <div className="hidden md:flex gap-8 font-medium text-gray-300">
                    <button onClick={() => router.push("/dashboard")} className="hover:text-green-500 transition cursor-pointer">
                        Dashboard
                    </button>
                    <button onClick={() => router.push("/mis-reservas")} className="hover:text-green-500 transition cursor-pointer">
                        Mis Reservas
                    </button>
                    <button onClick={() => router.push("/canchas")} className="hover:text-green-500 transition cursor-pointer">
                        Canchas
                    </button>
                    <button onClick={() => router.push("/mapa")} className="hover:text-green-500 transition cursor-pointer">
                        Mapa
                    </button>
                    <button onClick={() => router.push("/perfil")} className="hover:text-green-500 transition cursor-pointer">
                        Mi Perfil
                    </button>
                </div>

                {/* Área de Usuario & Notificaciones */}
                <div className="flex items-center gap-5 relative">
                    {/* BOTÓN DE NOTIFICACIONES */}
                    <div className="relative">
                        <button
                            onClick={() => setMostrarDropdown(!mostrarDropdown)}
                            className="relative p-2 rounded-full hover:bg-gray-800 transition text-gray-300 hover:text-white cursor-pointer"
                        >
                            <Bell size={22} />
                            {sinLeer > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                    {sinLeer}
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN DE NOTIFICACIONES */}
                        {mostrarDropdown && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-gray-200">
                                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                                        <Bell size={18} className="text-green-500" />
                                        Notificaciones
                                    </h3>
                                    {sinLeer > 0 && (
                                        <button
                                            onClick={marcarComoLeidas}
                                            className="text-xs text-green-400 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <CheckCheck size={14} /> Leídas
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/50">
                                    {notificaciones.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            No tienes notificaciones por el momento.
                                        </div>
                                    ) : (
                                        notificaciones.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-4 transition ${n.leida ? "bg-gray-900/50 opacity-75" : "bg-gray-800/40 border-l-4 border-green-500"}`}
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-1">
                                                            <CalendarCheck size={16} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-white">{n.titulo}</h4>
                                                            <p className="text-xs text-gray-300 mt-1">{n.mensaje}</p>
                                                            <span className="text-[10px] text-gray-500 block mt-2">
                                                                {n.fecha} • {n.hora}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => eliminarNotificacion(n.id)}
                                                        className="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AVATAR DE USUARIO CON FOTO DE PERFIL */}
                    <Link href="/perfil" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden bg-gray-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            {fotoPerfil ? (
                                <Image
                                    src={fotoPerfil}
                                    alt="Foto de perfil"
                                    width={40}
                                    height={40}
                                    unoptimized={fotoPerfil.startsWith("data:")}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <User size={20} className="text-gray-300" />
                            )}
                        </div>

                        {/* Nombre y Rol */}
                        <div className="hidden lg:block">
                            <p className="font-semibold text-sm group-hover:text-green-400 transition leading-tight">
                                {usuario?.nombre || usuario?.usuario || "Jugador"}
                            </p>
                            <p className="text-[11px] text-gray-400 capitalize">
                                {usuario?.rol || "Jugador"}
                            </p>
                        </div>
                    </Link>

                    {/* Cerrar Sesión */}
                    <button
                        onClick={cerrarSesion}
                        className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ml-2"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}