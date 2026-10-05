"use client";

import { useState } from "react";
import {
    Bell,
    CalendarCheck,
    UserPlus,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    Check
} from "lucide-react";
import { notificacionesIniciales } from "./notificaciones";
const iconos = {
    CalendarCheck,
    UserPlus,
    CreditCard,
    AlertTriangle
};

export default function AdminNotificaciones() {


    const [notificaciones, setNotificaciones] =
        useState(() => {
            if (typeof window !== "undefined") {
                const guardadas = localStorage.getItem("notificaciones");

                if (guardadas) {
                    return JSON.parse(guardadas);
                }
            }

            return notificacionesIniciales;
        });

    const guardarNotificaciones = (nuevasNotificaciones) => {
        setNotificaciones(nuevasNotificaciones);

        localStorage.setItem(
            "notificaciones",
            JSON.stringify(nuevasNotificaciones)
        );
    };

    // Marcar una notificación como leída
    const marcarComoLeida = (id) => {
        const nuevasNotificaciones = notificaciones.map(
            (notificacion) =>
                notificacion.id === id
                    ? { ...notificacion, leida: true }
                    : notificacion
        );

        guardarNotificaciones(nuevasNotificaciones);
    };

    // Marcar todas como leídas
    const marcarTodasComoLeidas = () => {
        const nuevasNotificaciones = notificaciones.map(
            (notificacion) => ({
                ...notificacion,
                leida: true
            })
        );

        guardarNotificaciones(nuevasNotificaciones);
    };


    const noLeidas = notificaciones.filter(
        (notificacion) => !notificacion.leida
    ).length;


    return (

        <div className="max-w-5xl mx-auto">

            {/* ENCABEZADO */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Notificaciones
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Revisa las novedades y actividades de FutZone
                    </p>

                </div>

                <div className="bg-green-100 p-3 rounded-xl">

                    <Bell
                        size={28}
                        className="text-green-600"
                    />

                </div>

            </div>


            {/* RESUMEN */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Notificaciones no leídas
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-1">
                            {noLeidas}
                        </h2>

                    </div>


                    {noLeidas > 0 && (

                        <button
                            onClick={marcarTodasComoLeidas}
                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-semibold transition"
                        >

                            <Check size={17} />

                            Marcar todas como leídas

                        </button>

                    )}

                </div>

            </div>


            {/* LISTA */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {notificaciones.map((notificacion) => {

                    const Icono = iconos[notificacion.icono];

                    return (

                        <div
                            key={notificacion.id}
                            onClick={() =>
                                marcarComoLeida(notificacion.id)
                            }
                            className={`
                                flex items-start gap-4 p-5 border-b last:border-b-0
                                border-gray-100 transition cursor-pointer
                                ${notificacion.leida
                                    ? "hover:bg-gray-50"
                                    : "bg-green-50/50 hover:bg-green-50"
                                }
                            `}
                        >

                            {/* ICONO */}

                            <div
                                className={`
                                    p-3 rounded-xl shrink-0
                                    ${notificacion.leida
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-green-100 text-green-600"
                                    }
                                `}
                            >

                                <Icono size={22} />

                            </div>


                            {/* INFORMACIÓN */}

                            <div className="flex-1">

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-2">

                                        <h3
                                            className={`
                                                font-semibold
                                                ${notificacion.leida
                                                    ? "text-gray-600"
                                                    : "text-gray-800"
                                                }
                                            `}
                                        >
                                            {notificacion.titulo}
                                        </h3>


                                        {!notificacion.leida && (

                                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                                Nueva
                                            </span>

                                        )}

                                    </div>


                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {notificacion.tiempo}
                                    </span>

                                </div>


                                <p className="text-sm text-gray-500 mt-1">
                                    {notificacion.mensaje}
                                </p>

                            </div>


                            {/* ESTADO */}

                            <div className="pt-1">

                                {notificacion.leida ? (

                                    <CheckCircle
                                        size={18}
                                        className="text-gray-300"
                                    />

                                ) : (

                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>

                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );
}