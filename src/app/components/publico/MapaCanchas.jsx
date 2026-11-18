
"use client";

import { useState, useRef } from "react";
import {
    MapPin,
    Navigation,
    Clock,
    Star,
    ExternalLink,
    Calendar,
    Trophy,
    ShieldCheck,
    Map,
    LocateFixed,
} from "lucide-react";

import Link from "next/link";
import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

// Configuración de los marcadores de Leaflet
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

    const [canchaSeleccionada, setCanchaSeleccionada] = useState(
        canchas[0]
    );

    const centrarEnCancha = (cancha) => {
        setCanchaSeleccionada(cancha);

        if (mapRef.current) {
            mapRef.current.flyTo(cancha.posicion, 16, {
                duration: 1.2,
            });
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-green-100 bg-white">

                <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-green-100/70 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">

                    <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">

                        <div>

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                <span className="text-xs font-extrabold uppercase tracking-widest text-green-700">
                                    Explora FutZone
                                </span>
                            </div>

                            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Encuentra tu cancha,
                                <span className="block text-green-600">
                                    vive el fútbol.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                Descubre escenarios deportivos en Popayán,
                                consulta su ubicación y encuentra el lugar
                                ideal para tu próximo partido.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">

                                <a
                                    href="#mapa"
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-1 hover:bg-green-700"
                                >
                                    <Map size={19} />
                                    Explorar mapa
                                </a>

                                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-600 shadow-sm">
                                    <MapPin size={19} className="text-green-600" />
                                    Popayán, Cauca
                                </div>

                            </div>

                        </div>

                        {/* TARJETA INFORMATIVA */}
                        <div className="relative">

                            <div className="rounded-3xl border border-green-100 bg-white p-7 shadow-xl shadow-green-900/5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                        <Trophy size={29} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            Plataforma deportiva
                                        </p>
                                        <h2 className="text-2xl font-black text-slate-900">
                                            FUT<span className="text-green-600">ZONE</span>
                                        </h2>
                                    </div>

                                </div>

                                <div className="my-6 h-px bg-slate-100" />

                                <div className="space-y-5">

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                            <MapPin size={21} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                Ubicación precisa
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Encuentra escenarios deportivos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                                            <Calendar size={21} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                Reserva tu espacio
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Organiza tu próximo encuentro.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                                            <ShieldCheck size={21} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                Vive la experiencia
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Todo empieza en una cancha.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* MAPA Y DETALLES */}
            <section
                id="mapa"
                className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16"
            >

                {/* TITULO DE SECCION */}
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
                            Encuentra tu escenario
                        </span>

                        <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                            Mapa de <span className="text-green-600">canchas</span>
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Selecciona un marcador para consultar la información
                            del escenario deportivo.
                        </p>
                    </div>

                    {/* LEYENDA */}
                    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                        <div className="flex items-center gap-2 px-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-slate-600">
                                Disponible
                            </span>
                        </div>

                        <div className="flex items-center gap-2 px-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold text-slate-600">
                                Próxima reserva
                            </span>
                        </div>

                        <div className="flex items-center gap-2 px-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                            <span className="text-xs font-bold text-slate-600">
                                Ocupada
                            </span>
                        </div>

                    </div>

                </div>

                <div className="grid items-start gap-7 lg:grid-cols-3">

                    {/* MAPA */}
                    <div className="space-y-4 lg:col-span-2">

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5">

                            <div className="relative h-[420px] overflow-hidden rounded-2xl sm:h-[550px]">

                                <MapContainer
                                    center={canchaSeleccionada.posicion}
                                    zoom={16}
                                    scrollWheelZoom={true}
                                    ref={mapRef}
                                    className="z-0 h-full w-full"
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
                                                <div className="min-w-[190px] p-1 text-slate-800">

                                                    <h3 className="text-base font-extrabold text-green-700">
                                                        {cancha.nombre}
                                                    </h3>

                                                    <p className="mt-2 text-xs font-medium text-slate-500">
                                                        {cancha.tipo}
                                                    </p>

                                                    <p className="mt-2 text-sm font-bold text-slate-800">
                                                        {cancha.precio}
                                                    </p>

                                                    <Link
                                                        href={`/reserva/${cancha.id}`}
                                                        className="mt-3 block rounded-lg bg-green-600 px-3 py-2 text-center text-xs font-bold text-white no-underline transition hover:bg-green-700"
                                                    >
                                                        Reservar cancha
                                                    </Link>

                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                </MapContainer>

                            </div>

                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">

                            <LocateFixed
                                size={20}
                                className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <p className="text-sm leading-6 text-blue-800">
                                <strong>Explora el mapa:</strong> puedes
                                desplazarte, acercar o alejar la vista y
                                seleccionar los marcadores para consultar
                                cada escenario.
                            </p>

                        </div>

                    </div>

                    {/* PANEL DE INFORMACION */}
                    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

                        {/* ENCABEZADO */}
                        <div className="border-b border-slate-100 p-6">

                            <div className="flex items-center justify-between gap-3">

                                <span className="text-xs font-black uppercase tracking-widest text-green-700">
                                    Cancha seleccionada
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    {canchaSeleccionada.estado}
                                </span>

                            </div>

                            <h3 className="mt-5 text-2xl font-black leading-tight text-slate-900">
                                {canchaSeleccionada.nombre}
                            </h3>

                            <div className="mt-3 flex items-center gap-2">

                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star
                                        size={17}
                                        className="fill-amber-400"
                                    />
                                    <span className="font-extrabold text-slate-800">
                                        {canchaSeleccionada.calificacion}
                                    </span>
                                </div>

                                <span className="text-slate-300">|</span>

                                <span className="text-xs font-semibold text-slate-500">
                                    {canchaSeleccionada.tipo}
                                </span>

                            </div>

                        </div>

                        {/* INFORMACION */}
                        <div className="space-y-4 p-6">

                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                    <MapPin size={21} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Ubicación
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                        {canchaSeleccionada.ciudad}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                                    <Clock size={21} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Horario de atención
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                        {canchaSeleccionada.horario}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                                    <Navigation size={21} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Precio por hora
                                    </p>
                                    <p className="mt-1 text-xl font-black text-green-700">
                                        {canchaSeleccionada.precio}
                                    </p>
                                </div>
                            </div>

                            {/* ACCIONES */}
                            <div className="space-y-3 pt-3">

                                <Link
                                    href={`/reserva/${canchaSeleccionada.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                                >
                                    <Calendar size={19} />
                                    Reservar esta cancha
                                </Link>

                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${canchaSeleccionada.posicion[0]},${canchaSeleccionada.posicion[1]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <ExternalLink size={18} />
                                    Abrir en Google Maps
                                </a>

                            </div>

                        </div>

                    </aside>

                </div>

            </section>

            {/* CIERRE */}
            <section className="border-t border-green-100 bg-white">

                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center">

                    <div>
                        <p className="text-xl font-black tracking-wider text-slate-900">
                            FUT<span className="text-green-600">ZONE</span>
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Tu equipo. Tu cancha. Tu historia.
                        </p>
                    </div>

                    <a
                        href="#mapa"
                        className="text-sm font-bold text-green-700 transition hover:text-green-900"
                    >
                        Volver al mapa ↑
                    </a>

                </div>

            </section>

        </main>
    );
}
