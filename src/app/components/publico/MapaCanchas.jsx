"use client";

import { MapPin, Navigation, Clock, Star } from "lucide-react";
import Link from "next/link";

import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaCanchas() {
    const posicion = [2.458279368072198, -76.59833580185445];

    const canchas = [
        {
            id: 1,
            nombre: "Canchas Sintéticas El Cubo",
            posicion: [2.458279368072198, -76.59833580185445],
            tipo: "Fútbol 5, 6 y 7",
            precio: "Desde $90.000",
            calificacion: 4.9,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100">

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950 to-green-700 py-20 lg:py-28">

                {/* EFECTOS DE FONDO */}

                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>

                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>


                <div className="relative max-w-7xl mx-auto px-6">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">


                        {/* CONTENIDO */}

                        <div>

                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2 rounded-full">

                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                                <span className="text-green-100 font-semibold text-sm">

                                    EXPLORA TUS CANCHAS

                                </span>

                            </div>


                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mt-7 leading-tight">

                                Encuentra tu próxima

                                <span className="block text-green-400">

                                    cancha de fútbol.

                                </span>

                            </h1>


                            <p className="text-slate-300 text-lg md:text-xl mt-6 max-w-xl leading-8">

                                Explora el mapa, conoce la ubicación de cada cancha y
                                encuentra el escenario perfecto para tu próximo partido.

                            </p>


                            {/* BOTONES */}

                            <div className="flex flex-wrap gap-4 mt-9">

                                <a
                                    href="#mapa"
                                    className="bg-green-500 hover:bg-green-400 text-white px-7 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-900/40"
                                >

                                    🗺️ Ver mapa

                                </a>

                                <a
                                    href="https://www.google.com/maps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-7 py-4 rounded-2xl font-bold transition-all"
                                >

                                    📍 Abrir ubicación

                                </a>

                            </div>

                        </div>


                        {/* TARJETA DEL MAPA */}

                        <div className="relative">

                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>


                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl">


                                {/* HEADER TARJETA */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-green-300 text-sm font-bold tracking-wider">

                                            UBICACIÓN DESTACADA

                                        </p>

                                        <h2 className="text-2xl md:text-3xl font-black text-white mt-2">

                                            Canchas Sintéticas El Cubo

                                        </h2>

                                    </div>


                                    <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-2xl shadow-lg">

                                        ⚽

                                    </div>

                                </div>


                                {/* INFORMACIÓN */}

                                <div className="grid grid-cols-2 gap-4 mt-8">

                                    <div className="bg-black/20 border border-white/10 rounded-2xl p-5">

                                        <p className="text-slate-400 text-sm">

                                            Estado

                                        </p>

                                        <p className="text-white font-bold mt-1 flex items-center gap-2">

                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>

                                            Disponible

                                        </p>

                                    </div>


                                    <div className="bg-black/20 border border-white/10 rounded-2xl p-5">

                                        <p className="text-slate-400 text-sm">

                                            Calificación

                                        </p>

                                        <p className="text-white font-bold mt-1">

                                            ⭐ 4.9 / 5

                                        </p>

                                    </div>

                                </div>


                                {/* UBICACIÓN */}

                                <div className="mt-5 bg-black/20 border border-white/10 rounded-2xl p-5">

                                    <p className="text-slate-400 text-sm">

                                        📍 Ubicación

                                    </p>

                                    <p className="text-white font-semibold mt-2">

                                        Popayán, Cauca

                                    </p>

                                </div>


                                {/* MINI MAPA DECORATIVO */}

                                <div className="relative mt-6 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-green-700 to-emerald-900 border border-white/10">

                                    <div className="absolute inset-0 opacity-20">

                                        <div className="w-full h-full"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle, white 1px, transparent 1px)",
                                                backgroundSize: "20px 20px"
                                            }}
                                        />

                                    </div>

                                    <div className="relative h-full flex items-center justify-center">

                                        <div className="w-12 h-12 rounded-full bg-white text-green-700 flex items-center justify-center shadow-xl text-xl">

                                            📍

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CONTENIDO */}
            <section  className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* MAPA */}
                    <div  id = "mapa"className="lg:col-span-2">

                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[500px]">

                            <MapContainer
                                center={posicion}
                                zoom={16}
                                scrollWheelZoom={true}
                                className="h-full w-full"
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {canchas.map((cancha) => (
                                    <Marker
                                        key={cancha.id}
                                        position={cancha.posicion}
                                    >
                                        <Popup>

                                            <div className="w-56">

                                                <h3 className="font-bold text-lg text-green-700">
                                                    {cancha.nombre}
                                                </h3>

                                                <p className="mt-2">
                                                    ⚽ {cancha.tipo}
                                                </p>

                                                <p>
                                                    ⭐ {cancha.calificacion}
                                                </p>

                                                <p>
                                                    💲 {cancha.precio}
                                                </p>

                                                <Link
                                                    href={`/reserva/${cancha.id}`}
                                                    className="block mt-4 bg-green-600 hover:bg-green-700 !text-white text-center py-2 rounded-lg font-semibold no-underline"
                                                >
                                                    Reservar
                                                </Link>

                                                <a
                                                    href="https://www.google.com/maps/dir/?api=1&destination=2.4448,-76.6147"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex justify-center items-center w-full mt-4 bg-blue-600 hover:bg-blue-700 !text-white py-4 rounded-2xl font-bold no-underline transition"
                                                >
                                                    Cómo llegar
                                                </a>

                                            </div>

                                        </Popup>
                                    </Marker>
                                ))}

                            </MapContainer>


                        </div>

                        {/* LEYENDA */}




                        {/* ENCABEZADO */}

                        <div className="bg-gradient-to-r from-slate-50 to-green-50 px-8 py-6 border-b border-gray-100">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">

                                    📍

                                </div>

                                <div>

                                    <h3 className="font-black text-2xl text-gray-800">

                                        Estado de las canchas

                                    </h3>

                                    <p className="text-gray-500 mt-1">

                                        Consulta la disponibilidad directamente en el mapa

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ESTADOS */}

                        <div className="p-6 grid md:grid-cols-3 gap-5">

                            {/* DISPONIBLE */}

                            <div className="group flex items-center gap-4 p-5 rounded-2xl bg-green-50 border border-green-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-green-600 shadow-lg">

                                    <span className="absolute w-full h-full rounded-full bg-green-400 animate-ping opacity-30"></span>

                                    <span className="relative w-4 h-4 rounded-full bg-white"></span>

                                </div>

                                <div>

                                    <h4 className="font-bold text-gray-800 text-lg">

                                        Disponible

                                    </h4>

                                    <p className="text-sm text-gray-500">

                                        Lista para reservar

                                    </p>

                                </div>

                            </div>


                            {/* PRÓXIMA RESERVA */}

                            <div className="group flex items-center gap-4 p-5 rounded-2xl bg-yellow-50 border border-yellow-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 shadow-lg">

                                    <span className="w-4 h-4 rounded-full bg-white"></span>

                                </div>

                                <div>

                                    <h4 className="font-bold text-gray-800 text-lg">

                                        Próxima reserva

                                    </h4>

                                    <p className="text-sm text-gray-500">

                                        Disponible por poco tiempo

                                    </p>

                                </div>

                            </div>


                            {/* OCUPADA */}

                            <div className="group flex items-center gap-4 p-5 rounded-2xl bg-red-50 border border-red-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg">

                                    <span className="w-4 h-4 rounded-full bg-white"></span>

                                </div>

                                <div>

                                    <h4 className="font-bold text-gray-800 text-lg">

                                        Ocupada

                                    </h4>

                                    <p className="text-sm text-gray-500">

                                        Actualmente no disponible

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* PIE */}

                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">

                            <p className="text-sm text-gray-500 flex items-center gap-2">

                                <span className="text-green-600 font-bold">

                                    ●

                                </span>

                                Los estados pueden actualizarse según las reservas realizadas.

                            </p>

                        </div>

                    </div>

                    {/* PANEL DERECHO */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 h-fit">

                        <h2 className="text-3xl font-black text-slate-800">
                            Centro Deportivo El Cubo
                        </h2>

                        <div className="flex items-center gap-2 mt-6">

                            <Star
                                className="text-yellow-500 fill-yellow-400"
                                size={20}
                            />

                            <span className="font-semibold">
                                4.9 / 5.0
                            </span>

                        </div>

                        <div className="flex items-start gap-3 mt-6">

                            <MapPin
                                className="text-green-600"
                                size={22}
                            />

                            <span className="text-slate-600">
                                Popayán, Cauca
                            </span>

                        </div>

                        <div className="flex items-center gap-3 mt-6">

                            <Navigation
                                className="text-green-600"
                                size={22}
                            />

                            <span className="text-slate-600">
                                Canchas de Fútbol 5, 6 y 7
                            </span>

                        </div>

                        <div className="flex items-center gap-3 mt-6">

                            <Clock
                                className="text-green-600"
                                size={22}
                            />

                            <span className="text-slate-600">
                                6:00 AM - 11:00 PM
                            </span>

                        </div>

                        <Link
                            href="/canchas"
                            className="block mt-10 w-full bg-green-600 hover:bg-green-700 text-center text-white py-4 rounded-2xl font-bold transition"
                        >
                            Ver todas las canchas
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}