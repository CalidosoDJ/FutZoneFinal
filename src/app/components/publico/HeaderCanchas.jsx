"use client";

import Link from "next/link";
import { Bell, UserCircle2, MapPin, Star, Car, Coffee } from "lucide-react";
import DashboardNavbar from "../usuario/DashboardNavBar";

export default function HeaderCanchas() {
    return (
        <header className="relative min-h-screen">

            {/* Fondo */}

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/img/elcubo-banner.jpg')"
                }}
            />

            {/* Oscurecer */}

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-green-900/60" />
            <DashboardNavbar />

            {/* Navbar */}

           
            {/* Hero */}

            <div className="relative z-10 max-w-7xl mx-auto px-10 h-[80vh] flex items-center">

                <div className="max-w-3xl">

                    <span className="bg-green-500/20 text-green-300 px-5 py-2 rounded-full">

                        ⚽ Centro Deportivo El Cubo

                    </span>

                    <h1 className="mt-8 text-7xl font-black text-white leading-tight">

                        Reserva tu cancha favorita

                    </h1>

                    <p className="text-xl text-gray-300 mt-6 leading-9">

                        Vive la mejor experiencia deportiva.
                        Escoge la cancha ideal y reserva en pocos segundos.

                    </p>

                    <div className="flex gap-10 mt-10 flex-wrap">

                        <div className="flex items-center gap-2 text-white">

                            <Star className="text-yellow-400 fill-yellow-400"/>

                            4.9

                        </div>

                        <div className="flex items-center gap-2 text-white">

                            <Car className="text-green-400"/>

                            Parqueadero

                        </div>

                        <div className="flex items-center gap-2 text-white">

                            <Coffee className="text-green-400"/>

                            Cafetería

                        </div>

                        <div className="flex items-center gap-2 text-white">

                            <MapPin className="text-green-400"/>

                            Popayán

                        </div>

                    </div>

                    <button
                        className="
                        mt-12
                        bg-green-500
                        hover:bg-green-600
                        duration-300
                        text-white
                        px-10
                        py-4
                        rounded-2xl
                        font-bold
                        text-lg
                        shadow-xl
                        "
                    >

                        Ver Canchas Disponibles

                    </button>

                </div>

            </div>

        </header>
    );
}