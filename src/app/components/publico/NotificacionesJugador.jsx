
"use client";
import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotificacionesJugador() {
    const [notificaciones, setNotificaciones] = useState([
        {
            id: 1,
            tipo: "confirmada",
            titulo: "Reserva confirmada",
            mensaje: "Tu reserva para la Cancha Sintética Norte fue confirmada.",
            fecha: "Hace 5 minutos",
            leida: false,
        },
        {
            id: 2,
            tipo: "recordatorio",
            titulo: "Tu partido inicia pronto",
            mensaje: "Recuerda que tu partido comienza en 30 minutos.",
            fecha: "Hoy - 5:30 PM",
            leida: false,
        },
        {
            id: 3,
            tipo: "calificacion",
            titulo: "Califica tu experiencia",
            mensaje: "Tu partido finalizó. Ayúdanos calificando la cancha.",
            fecha: "Hoy - 3:00 PM",
            leida: false,
        },
        {
            id: 4,
            tipo: "promocion",
            titulo: "Nueva promoción",
            mensaje: "Obtén un 15% de descuento reservando antes de las 3:00 PM.",
            fecha: "Ayer",
            leida: true,
        },
    ]);
    const sinLeer = notificaciones.filter(
        item => !item.leida
    ).length;

    const marcarComoLeida = (id) => {

        const nuevas = notificaciones.map(item =>

            item.id === id
                ? { ...item, leida: true }
                : item

        );

        setNotificaciones(nuevas);

        localStorage.setItem(
            "notificacionesJugador",
            JSON.stringify(nuevas)
        );

    };
    useEffect(() => {

        const datos = localStorage.getItem("notificacionesJugador");

        if (datos) {

            setNotificaciones(JSON.parse(datos));

        }

    }, []);
    return (

        <>

            {/* ENCABEZADO */}

            <section className="bg-white rounded-[35px] shadow-lg border border-slate-200 p-10">

                <div className="flex flex-col lg:flex-row justify-between gap-8">

                    <div>

                        <div className="flex items-center gap-5">

                            <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center">

                                <Bell
                                    size={42}
                                    className="text-green-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-4xl font-black text-slate-800">

                                    Centro de Notificaciones

                                </h1>

                                <p className="text-slate-500 mt-2 text-lg">

                                    Aquí encontrarás toda la información importante
                                    sobre tus reservas, recordatorios, promociones
                                    y novedades de FutZone.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* RESUMEN */}

                    <div className="grid grid-cols-2 gap-5">

                        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 min-w-[170px]">

                            <p className="text-slate-500">

                                Sin leer

                            </p>

                            <h2 className="text-5xl font-black text-green-600 mt-2">

                                {sinLeer}

                            </h2>

                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 min-w-[170px]">

                            <p className="text-slate-500">

                                {notificaciones.length}

                            </p>

                            <h2 className="text-5xl font-black text-blue-600 mt-2">

                                18

                            </h2>

                        </div>

                    </div>

                </div>

            </section>

            {/* BUSCADOR */}

            <section className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 mt-8">

                <div className="flex flex-col lg:flex-row gap-5">

                    <div className="flex-1 relative">

                        <Search
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input

                            type="text"

                            placeholder="Buscar notificación..."

                            className="w-full rounded-2xl border border-slate-300 py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-green-500"

                        />

                    </div>

                    <div className="flex gap-3 flex-wrap">

                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold">

                            Todas

                        </button>

                        <button className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl font-semibold text-slate-700">

                            Sin leer

                        </button>

                        <button className="bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-2xl font-semibold text-slate-700">

                            Leídas

                        </button>

                    </div>

                </div>

            </section>
            <section className="mt-8 space-y-5">

                {notificaciones.map((item) => (

                    <div
                        key={item.id}
                        className={`rounded-3xl border p-7 shadow-md hover:shadow-xl transition duration-300 ${item.leida
                            ? "bg-white border-slate-200"
                            : "bg-green-50 border-green-300"
                            }`}
                    >

                        <div className="flex justify-between items-start">

                            <div className="flex gap-5">

                                {/* ICONO */}

                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                        ${item.tipo === "confirmada"
                                            ? "bg-green-100"
                                            : item.tipo === "recordatorio"
                                                ? "bg-yellow-100"
                                                : item.tipo === "calificacion"
                                                    ? "bg-orange-100"
                                                    : item.tipo === "promocion"
                                                        ? "bg-purple-100"
                                                        : item.tipo === "cancha"
                                                            ? "bg-blue-100"
                                                            : "bg-red-100"
                                        }`}
                                >

                                    {item.tipo === "confirmada" && "✅"}
                                    {item.tipo === "recordatorio" && "⏰"}
                                    {item.tipo === "calificacion" && "⭐"}
                                    {item.tipo === "promocion" && "🎁"}
                                    {item.tipo === "cancha" && "🏟️"}
                                    {item.tipo === "cancelada" && "❌"}

                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold text-slate-800">

                                        {item.titulo}

                                    </h2>

                                    <p className="text-slate-500 mt-2">

                                        {item.mensaje}

                                    </p>

                                    <p className="text-sm text-slate-400 mt-4">

                                        {item.fecha}

                                    </p>

                                </div>

                            </div>

                            {!item.leida && (

                                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">

                                    Nuevo

                                </span>

                            )}

                        </div>

                        <div className="flex justify-end gap-4 mt-8">

                            <button className="border border-slate-300 hover:bg-slate-100 px-6 py-3 rounded-2xl font-semibold">

                                Ver detalle

                            </button>

                            {!item.leida ? (

                                < button
                                    onClick={() => marcarComoLeida(item.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold"
                                >

                                    Marcar como leída

                                </button>

                            ) : (

                                <button className="bg-slate-200 text-slate-500 px-6 py-3 rounded-2xl font-semibold cursor-default">

                                    Leída

                                </button>

                            )}

                        </div>

                    </div>

                ))}

            </section >

        </>

    );

}