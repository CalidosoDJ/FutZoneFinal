"use client";

import { useEffect, useState } from "react";

import {
    Search,
    Bell,
    UserCircle,
    Settings,
    LogOut,
    CalendarCheck,
    UserPlus,
    CreditCard,
    AlertTriangle,
    Check
} from "lucide-react";

import { notificacionesIniciales } from "./notificaciones";

export default function AdminNavBar() {

    const [mostrarPerfil, setMostrarPerfil] = useState(false);
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    const [notificaciones, setNotificaciones] = useState([]);

    // CARGAR NOTIFICACIONES
    useEffect(() => {

        const cargarNotificaciones = () => {

            const guardadas =
                localStorage.getItem("notificaciones");

            if (guardadas) {

                setNotificaciones(
                    JSON.parse(guardadas)
                );

            } else {

                localStorage.setItem(
                    "notificaciones",
                    JSON.stringify(notificacionesIniciales)
                );

                setNotificaciones(
                    notificacionesIniciales
                );
            }
        };

        cargarNotificaciones();

        window.addEventListener(
            "notificacionesActualizadas",
            cargarNotificaciones
        );

        return () => {

            window.removeEventListener(
                "notificacionesActualizadas",
                cargarNotificaciones
            );

        };

    }, []);


    // ICONOS DE LAS NOTIFICACIONES
    const iconos = {
        CalendarCheck,
        UserPlus,
        CreditCard,
        AlertTriangle
    };


    // CONTAR NO LEÍDAS
    const noLeidas = notificaciones.filter(
        (notificacion) => !notificacion.leida
    ).length;

    const marcarComoLeida = (id) => {

        const actualizadas = notificaciones.map(
            (notificacion) =>
                notificacion.id === id
                    ? { ...notificacion, leida: true }
                    : notificacion
        );

        setNotificaciones(actualizadas);

        localStorage.setItem(
            "notificaciones",
            JSON.stringify(actualizadas)
        );

        window.dispatchEvent(
            new Event("notificacionesActualizadas")
        );
    };

    const marcarTodasComoLeidas = () => {
        const actualizadas = notificaciones.map(
            (notificacion) => ({
                ...notificacion,
                leida: true
            })
        );

        setNotificaciones(actualizadas);

        localStorage.setItem(
            "notificaciones",
            JSON.stringify(actualizadas)
        );

        window.dispatchEvent(
            new Event("notificacionesActualizadas")
        );
    };


    return (

        <header className="h-20 bg-white shadow-md flex items-center justify-between px-8 text-gray-700">

            {/* BUSCADOR */}

            <div className="relative">

                <Search
                    size={20}
                    className="absolute left-4 top-3 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Buscar en FutZone..."
                    className="pl-11 pr-4 py-2.5 w-80
                    border border-gray-200 rounded-xl
                    outline-none bg-gray-50
                    focus:bg-white
                    focus:border-green-500
                    transition"
                />

            </div>


            {/* PARTE DERECHA */}

            <div className="flex items-center gap-7">


                {/* ================= NOTIFICACIONES ================= */}

                <div className="relative">

                    <button
                        onClick={() => {
                            setMostrarNotificaciones(
                                !mostrarNotificaciones
                            );

                            setMostrarPerfil(false);
                        }}
                        className="relative p-2 rounded-xl
                        hover:bg-green-50 transition cursor-pointer"
                    >

                        <Bell
                            size={24}
                            className={
                                noLeidas > 0
                                    ? "text-gray-600"
                                    : "text-gray-700"

                            }
                        />


                        {/* CONTADOR */}

                        {noLeidas > 0 && (

                            <span
                                className="absolute -top-1 -right-1
                                min-w-5 h-5 px-1
                                flex items-center justify-center
                                bg-red-500 text-white
                                text-xs font-bold
                                rounded-full
                                border-2 border-white"
                            >

                                {noLeidas}

                            </span>

                        )}

                    </button>


                    {/* DROPDOWN NOTIFICACIONES */}

                    {mostrarNotificaciones && (

                        <div
                            className="absolute right-0 mt-3
                            w-96 bg-white
                            rounded-2xl shadow-xl
                            border border-gray-100
                            overflow-hidden z-50"
                        >

                            {/* CABECERA */}

                            <div
                                className="px-5 py-4
                                border-b bg-gray-50
                                flex items-center justify-between"
                            >
                                <button
                                    onClick={marcarTodasComoLeidas}
                                    className="flex items-center gap-2
                                    px-4 py-2 rounded-xl
                                    text-sm font-semibold
                                    text-green-600
                                    hover:bg-green-50
                                    transition"
                                >
                                    <Check size={17} />
                                    Marcar todas como leídas
                                </button>

                                <div>

                                    <h3 className="font-bold text-gray-800">
                                        Notificaciones
                                    </h3>

                                    <p className="text-sm text-gray-400">

                                        {noLeidas} sin leer

                                    </p>

                                </div>



                            </div>


                            {/* LISTA */}

                            <div className="max-h-80 overflow-y-auto">

                                {notificaciones.length === 0 ? (

                                    <div className="p-8 text-center">

                                        <Bell
                                            size={35}
                                            className="mx-auto text-gray-300 mb-3"
                                        />

                                        <p className="text-gray-500">
                                            No tienes notificaciones
                                        </p>

                                    </div>

                                ) : (

                                    notificaciones.map(
                                        (notificacion) => {

                                            const Icono =
                                                iconos[
                                                notificacion.icono
                                                ];

                                            return (

                                                <div
                                                    key={
                                                        notificacion.id
                                                    }
                                                    onClick={() => marcarComoLeida(notificacion.id)}
                                                    className={`
                                                        flex gap-3
                                                        px-5 py-4
                                                        border-b
                                                        hover:bg-gray-50
                                                        transition
                                                        ${!notificacion.leida
                                                            ? "bg-green-50/50"
                                                            : ""
                                                        }
                                                    `}
                                                >

                                                    {/* ICONO */}

                                                    <div
                                                        className="w-10 h-10
                                                        rounded-xl
                                                        bg-green-100
                                                        flex items-center
                                                        justify-center
                                                        flex-shrink-0"
                                                    >

                                                        {Icono && (

                                                            <Icono
                                                                size={19}
                                                                className="text-green-600"
                                                            />

                                                        )}

                                                    </div>


                                                    {/* INFORMACIÓN */}

                                                    <div className="flex-1">

                                                        <div
                                                            className="flex
                                                            items-center
                                                            justify-between
                                                            gap-2"
                                                        >

                                                            <h4
                                                                className={`
                                                                text-sm
                                                                ${!notificacion.leida
                                                                        ? "font-bold text-gray-800"
                                                                        : "font-semibold text-gray-600"
                                                                    }
                                                                `}
                                                            >

                                                                {
                                                                    notificacion.titulo
                                                                }

                                                            </h4>


                                                            {/* PUNTO */}

                                                            {!notificacion.leida && (

                                                                <span
                                                                    className="w-2 h-2
                                                                    bg-green-500
                                                                    rounded-full
                                                                    flex-shrink-0"
                                                                />

                                                            )}

                                                        </div>


                                                        <p className="text-xs text-gray-500 mt-1">

                                                            {
                                                                notificacion.mensaje
                                                            }

                                                        </p>


                                                        <p className="text-xs text-gray-400 mt-2">

                                                            {
                                                                notificacion.tiempo
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )

                                )}

                            </div>


                            {/* VER TODAS */}

                            <div className="p-3 border-t">

                                <button
                                    onClick={() => {
                                        window.location.href =
                                            "/admin/notificaciones";
                                    }}
                                    className="w-full py-2.5
                                    rounded-xl
                                    text-sm font-semibold
                                    text-green-600
                                    hover:bg-green-50
                                    transition"
                                >

                                    Ver todas las notificaciones

                                </button>

                            </div>

                        </div>

                    )}

                </div>


                {/* ================= PERFIL ================= */}

                <div className="relative">

                    <button
                        onClick={() => {
                            setMostrarPerfil(
                                !mostrarPerfil
                            );

                            setMostrarNotificaciones(false);
                        }}
                        className="flex items-center gap-3
                        hover:bg-gray-50 rounded-xl
                        px-3 py-2 transition cursor-pointer"
                    >

                        <div className="relative">

                            <UserCircle
                                size={43}
                                className="text-gray-700"
                            />

                            <span
                                className="absolute bottom-0 right-0
                                w-3 h-3 bg-green-500
                                border-2 border-white
                                rounded-full"
                            />

                        </div>


                        <div className="text-left">

                            <h3 className="font-bold text-gray-800">
                                Administrador
                            </h3>

                            <p className="text-gray-400 text-sm">
                                FutZone
                            </p>

                        </div>

                    </button>


                    {/* MENU PERFIL */}

                    {mostrarPerfil && (

                        <div
                            className="absolute right-0 mt-3
                            w-64 bg-white
                            rounded-2xl shadow-xl
                            border border-gray-100
                            overflow-hidden z-50"
                        >

                            {/* CUENTA */}

                            <div
                                className="px-5 py-4
                                bg-gray-50 border-b"
                            >

                                <p className="text-xs text-gray-400">
                                    Cuenta
                                </p>

                                <p className="font-bold text-gray-800">
                                    Administrador
                                </p>

                                <p className="text-sm text-gray-500">
                                    admin@futzone.com
                                </p>

                            </div>


                            {/* OPCIONES */}

                            <div className="p-2">

                                {/* PERFIL */}

                                <button
                                    onClick={() => {
                                        window.location.href =
                                            "/admin/perfil";
                                    }}
                                    className="w-full flex items-center
                                    gap-3 px-3 py-3 rounded-xl
                                    hover:bg-green-50
                                    transition text-gray-700"
                                >

                                    <UserCircle
                                        size={19}
                                        className="text-green-600"
                                    />

                                    <span>
                                        Mi perfil
                                    </span>

                                </button>


                                {/* CONFIGURACIÓN */}

                                <button
                                    className="w-full flex items-center
                                    gap-3 px-3 py-3 rounded-xl
                                    hover:bg-gray-100
                                    transition text-gray-700"
                                >

                                    <Settings
                                        size={19}
                                        className="text-gray-500"
                                    />

                                    <span>
                                        Configuración
                                    </span>

                                </button>

                            </div>


                            {/* CERRAR SESIÓN */}

                            <div className="border-t p-2">

                                <button
                                    onClick={() => {

                                        localStorage.removeItem(
                                            "usuarioLogueado"
                                        );

                                        window.location.href =
                                            "/login";

                                    }}
                                    className="w-full flex items-center
                                    gap-3 px-3 py-3 rounded-xl
                                    hover:bg-red-50
                                    text-red-600 transition"
                                >

                                    <LogOut
                                        size={19}
                                        className="text-red-500"
                                    />

                                    <span>
                                        Cerrar sesión
                                    </span>

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );
}