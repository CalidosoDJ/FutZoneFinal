"use client";

import { useState, useRef } from "react";
import { MapPin, Navigation, Clock, Star, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaCanchas() {
    const mapRef = useRef(null);

    const canchas = [
        {
            id: 1,
            nombre: "Canchas Sintéticas El Cubo",
            posicion: [2.458279368072198, -76.59833580185445],
            tipo: "Fútbol 5, 6 y 7",
            precio: "$90.000 / hr",
            calificacion: 4.9,
            horario: "6:00 AM - 11:00 PM",
            estado: "Disponible",
            ciudad: "Popayán, Cauca",
        },
    ];

    const [canchaSeleccionada, setCanchaSeleccionada] = useState(canchas[0]);

    const centrarEnCancha = (cancha) => {
        setCanchaSeleccionada(cancha);
        if (mapRef.current) {
            mapRef.current.flyTo(cancha.posicion, 16, { duration: 1.2 });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {/* HERO SECTION COMPACTO */}
            <section className="relative bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 pt-10 pb-12 border-b border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-3">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-green-300 font-bold text-xs uppercase tracking-wider">
                                    Explora la ciudad
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                Encuentra tu cancha en <span className="text-green-400">Popayán</span>
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
                                Selecciona un centro deportivo en el mapa para revisar sus estados, precios y disponibilidad en tiempo real.
                            </p>
                        </div>

                        {/* ESTADOS DE DISPONIBILIDAD (COMPACTO) */}
                        <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                                <span className="text-xs font-bold text-green-400">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                <span className="text-xs font-bold text-amber-400">Próx. Reserva</span>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                <span className="text-xs font-bold text-red-400">Ocupada</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN PRINCIPAL: MAPA + PANEL DETALLES */}
            <section className="max-w-7xl mx-auto px-6 py-8" id="mapa">
                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* CONTENEDOR DEL MAPA (2 COLUMNAS) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[550px] z-0">
                            <MapContainer
                                center={canchaSeleccionada.posicion}
                                zoom={16}
                                scrollWheelZoom={true}
                                ref={mapRef}
                                className="h-full w-full z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {canchas.map((cancha) => (
                                    <Marker
                                        key={cancha.id}
                                        position={cancha.posicion}
                                        eventHandlers={{
                                            click: () => centrarEnCancha(cancha),
                                        }}
                                    >
                                        <Popup>
                                            <div className="p-1 text-slate-900">
                                                <h3 className="font-extrabold text-base text-green-700">
                                                    {cancha.nombre}
                                                </h3>
                                                <p className="text-xs font-medium text-slate-600 mt-1">
                                                    ⚽ {cancha.tipo}
                                                </p>
                                                <p className="text-xs font-bold text-slate-800 mt-1">
                                                    ⭐ {cancha.calificacion} / 5.0
                                                </p>
                                                <div className="mt-3 flex gap-2">
                                                    <Link
                                                        href={`/reserva/${cancha.id}`}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 !text-white text-center py-1.5 rounded-lg text-xs font-bold no-underline transition"
                                                    >
                                                        Reservar
                                                    </Link>
                                                    <a
                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${cancha.posicion[0]},${cancha.posicion[1]}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 p-1.5 rounded-lg text-xs flex items-center justify-center no-underline"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-2 px-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Los mapas interactivos te permiten arrastrar, hacer zoom y pulsar directamente sobre los marcadores.
                        </p>
                    </div>

                    {/* PANEL DERECHO CON INFO DETALLADA (STICKY) */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md sticky top-24">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                                Cancha Seleccionada
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                {canchaSeleccionada.estado}
                            </span>
                        </div>

                        <h2 className="text-2xl font-black text-white mt-4">
                            {canchaSeleccionada.nombre}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="fill-amber-400" size={16} />
                                <span className="font-extrabold text-sm text-white">
                                    {canchaSeleccionada.calificacion}
                                </span>
                            </div>
                            <span className="text-slate-500 text-xs">•</span>
                            <span className="text-xs text-slate-400 font-medium">
                                {canchaSeleccionada.tipo}
                            </span>
                        </div>

                        {/* DETALLES DE LA CANCHA */}
                        <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                                <MapPin className="text-green-400 shrink-0" size={18} />
                                <span>{canchaSeleccionada.ciudad}</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                                <Clock className="text-green-400 shrink-0" size={18} />
                                <span>{canchaSeleccionada.horario}</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300 text-sm bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                                <Navigation className="text-green-400 shrink-0" size={18} />
                                <span className="font-bold text-white">{canchaSeleccionada.precio}</span>
                            </div>
                        </div>

                        {/* ACCIONES */}
                        <div className="space-y-3 mt-8">
                            <Link
                                href={`/reserva/${canchaSeleccionada.id}`}
                                className="w-full bg-green-600 hover:bg-green-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
                            >
                                <Calendar size={18} />
                                <span>Ir reservar</span>
                            </Link>

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${canchaSeleccionada.posicion[0]},${canchaSeleccionada.posicion[1]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition"
                            >
                                <ExternalLink size={18} />
                                <span>Abrir en Google Maps</span>
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}