import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    Trophy,
    ShieldCheck,
    MapPinned,
    Clock3,
    CalendarCheck,
    Users,
    HelpCircle,
    MessageCircleQuestion,
    Handshake,
} from "lucide-react";;
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardComponent() {
    return (
        <>
            <section className="bg-gradient-to-br from-white via-slate-50 to-green-50 rounded-[35px] border border-slate-200 shadow-xl p-14 text-center">

                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">

                    <div className="max-w-7xl mx-auto p-8">

                        <h1 className="mt-8 text-5xl font-black text-gray-800 leading-tight">

                            Tu próximo partido comienza aquí.

                        </h1>

                        <p className="mt-6 text-gray-700 text-xl max-w-3xl mx-auto leading-9">

                            Reserva una cancha en segundos, administra tus horarios,
                            descubre nuevos escenarios deportivos y vive una experiencia
                            moderna desde FutZone.

                        </p>

                        <div className="flex justify-center gap-5 mt-10">

                            <Link
                                href="/canchas"
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-green-300/50 hover:scale-105 transition-all duration-300"
                            >

                                ⚽ Reservar cancha

                                <ArrowRight
                                    size={20}
                                    className="group-hover:translate-x-1 transition-transform"
                                />

                            </Link>

                            <Link
                                href="/mis-reservas"
                                className="group inline-flex items-center gap-3 bg-white border border-slate-300 text-gray-700 px-8 py-4 rounded-2xl font-bold shadow-md hover:bg-slate-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >

                                <CalendarDays size={20} />

                                Mis reservas

                            </Link>

                        </div>

                    </div>

                    <div className="mt-14 mb-8">

                        <h2 className="text-3xl font-black text-gray-800">

                            ¿Por qué elegir FutZone?

                        </h2>

                        <p className="text-gray-500 mt-2 text-lg">

                            Todo lo que necesitas para reservar una cancha de manera rápida y segura.

                        </p>

                    </div>
                    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">

                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                                <MapPinned className="text-green-600" size={34} />

                            </div>

                            <h2 className="text-5xl font-black text-gray-900 mt-6">

                                6

                            </h2>

                            <p className="text-gray-500 text-lg mt-2">

                                Canchas disponibles

                            </p>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">

                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                                <Clock3 className="text-green-600" size={34} />

                            </div>

                            <h2 className="text-5xl font-black text-gray-900 mt-6">

                                24/7

                            </h2>

                            <p className="text-gray-500 text-lg mt-2">

                                Horarios disponibles

                            </p>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">

                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                                <CalendarCheck className="text-green-600" size={34} />

                            </div>

                            <h2 className="text-5xl font-black text-gray-900 mt-6">

                                100%

                            </h2>

                            <p className="text-gray-500 text-lg mt-2">

                                Reservas online

                            </p>

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">

                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                                <ShieldCheck className="text-green-600" size={34} />

                            </div>

                            <h2 className="text-5xl font-black text-gray-900 mt-6">

                                Seguro

                            </h2>

                            <p className="text-gray-500 text-lg mt-2">

                                Sistema confiable para gestionar tus reservas

                            </p>

                        </div>

                    </section>
                    {/* AYUDA Y MÁS INFORMACIÓN */}

                    <section className="mt-14">

                        <div className="mb-8">

                            <h2 className="text-3xl font-black text-gray-800">

                                Conoce más sobre FutZone

                            </h2>

                            <p className="text-gray-500 mt-2 text-lg">

                                Encuentra información sobre nuestra plataforma y resuelve tus dudas.

                            </p>

                        </div>

                        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

                            {/* NOSOTROS */}

                            <Link
                                href="/nosotros"
                                className="group bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                            >

                                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition">

                                    <Users
                                        className="text-green-600 group-hover:text-white transition"
                                        size={32}
                                    />

                                </div>

                                <h2 className="text-2xl font-black text-gray-800 mt-6">

                                    Nosotros

                                </h2>

                                <p className="text-gray-500 mt-3 leading-7">

                                    Conoce más sobre FutZone, nuestra misión y cómo trabajamos para transformar la experiencia deportiva.

                                </p>

                                <div className="flex items-center gap-2 text-green-600 font-bold mt-6">

                                    Conocer FutZone

                                    <ArrowRight
                                        size={20}
                                        className="group-hover:translate-x-2 transition-transform"
                                    />

                                </div>

                            </Link>


                            {/* PREGUNTAS FRECUENTES */}

                            <Link
                                href="/preguntasFrecuentes"
                                className="group bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                            >

                                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition">

                                    <MessageCircleQuestion
                                        className="text-blue-600 group-hover:text-white transition"
                                        size={32}
                                    />

                                </div>

                                <h2 className="text-2xl font-black text-gray-800 mt-6">

                                    Preguntas frecuentes

                                </h2>

                                <p className="text-gray-500 mt-3 leading-7">

                                    Encuentra respuestas rápidas a las preguntas más comunes sobre reservas y el funcionamiento de FutZone.

                                </p>

                                <div className="flex items-center gap-2 text-blue-600 font-bold mt-6">

                                    Ver preguntas

                                    <ArrowRight
                                        size={20}
                                        className="group-hover:translate-x-2 transition-transform"
                                    />

                                </div>

                            </Link>


                            {/* CONVENIOS */}

                            <Link
                                href="/convenios"
                                className="group relative overflow-hidden bg-gradient-to-br from-green-700 to-emerald-600 rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                            >

                                {/* Decoración */}

                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />

                                <div className="relative">

                                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-white transition">

                                        <Handshake
                                            className="text-white group-hover:text-green-600 transition"
                                            size={32}
                                        />

                                    </div>

                                    <h2 className="text-2xl font-black text-white mt-6">

                                        Convenios FutZone

                                    </h2>

                                    <p className="text-green-50 mt-3 leading-7">

                                        ¿Tienes una empresa, negocio o escenario deportivo? Conoce los beneficios y solicita un convenio con FutZone.

                                    </p>

                                    <div className="flex items-center gap-2 text-white font-bold mt-6">

                                        Crear alianza

                                        <ArrowRight
                                            size={20}
                                            className="group-hover:translate-x-2 transition-transform"
                                        />

                                    </div>

                                </div>

                            </Link>
                        </section>
                    </section>
                </span>
            </section>
        </>
    );
}
