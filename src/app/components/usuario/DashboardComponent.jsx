"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    ShieldCheck,
    MapPinned,
    Clock3,
    CalendarCheck,
    Users,
    MessageCircleQuestion,
    Handshake,
    Megaphone,
    Newspaper,
    Tag,
    ChevronRight,
} from "lucide-react";

export default function DashboardComponent() {
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioLogueado = localStorage.getItem("usuarioLogueado");

        // Validar si la sesión existe
        if (!usuarioLogueado) {
            router.replace("/login");
            return;
        }

        setUsuario(JSON.parse(usuarioLogueado));
    }, [router]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true);
    const [errorPublicaciones, setErrorPublicaciones] = useState(false);

    useEffect(() => {
        const cargarPublicaciones = async () => {
            try {
                const respuesta = await fetch(
                    "http://127.0.0.1:8000/api/publicaciones/?publicadas=true"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las publicaciones");
                }

                const datos = await respuesta.json();
                setPublicaciones(datos);
            } catch (error) {
                console.error("Error cargando publicaciones:", error);
                setErrorPublicaciones(true);
            } finally {
                setCargandoPublicaciones(false);
            }
        };

        cargarPublicaciones();
    }, []);

    // Si la sesión no ha cargado o no existe, prevenimos renderizar el contenido
    if (!usuario) return null;

    return (
        <>
            {/* Tarjeta principal optimizada en relleno (py-6 px-8) */}
            <section className="bg-gradient-to-br from-white via-slate-50 to-green-50 rounded-[35px] border border-slate-200 shadow-xl px-8 py-6 text-center">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                    ⚽ ¡Hola, {usuario?.nombre || "Jugador"}! Bienvenido a FutZone
                </span>

                <h1 className="mt-4 text-4xl lg:text-5xl font-black text-gray-800 leading-tight">
                    Tu próximo partido comienza aquí.
                </h1>

                <p className="mt-4 text-gray-700 text-lg lg:text-xl max-w-3xl mx-auto leading-8">
                    Reserva una cancha en segundos, administra tus horarios, descubre nuevos escenarios deportivos y vive una experiencia moderna desde FutZone.
                </p>

                <div className="flex justify-center gap-5 mt-8">
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
            </section>

            <div className="mt-12 mb-6">
                <h2 className="text-3xl font-black text-gray-800">
                    ¿Por qué elegir FutZone?
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                    Todo lo que necesitas para reservar una cancha de manera rápida y segura.
                </p>
            </div>

            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
                <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <MapPinned className="text-green-600" size={34} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mt-6">6</h2>
                    <p className="text-gray-500 text-lg mt-2">Canchas disponibles</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <Clock3 className="text-green-600" size={34} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mt-6">24/7</h2>
                    <p className="text-gray-500 text-lg mt-2">Horarios disponibles</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <CalendarCheck className="text-green-600" size={34} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mt-6">100%</h2>
                    <p className="text-gray-500 text-lg mt-2">Reservas online</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                        <ShieldCheck className="text-green-600" size={34} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mt-6">Seguro</h2>
                    <p className="text-gray-500 text-lg mt-2">
                        Sistema confiable para gestionar tus reservas
                    </p>
                </div>
            </section>


            {/* NOTICIAS Y PROMOCIONES */}
            <section className="mt-14">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                            <Megaphone size={17} />
                            NOVEDADES FUTZONE
                        </span>

                        <h2 className="text-3xl lg:text-4xl font-black text-gray-800 mt-4">
                            Noticias y promociones
                        </h2>

                        <p className="text-gray-500 mt-2 text-lg">
                            Entérate de las últimas novedades y aprovecha las ofertas.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <Newspaper size={20} />
                        <span>Información oficial</span>
                    </div>
                </div>

                {cargandoPublicaciones && (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
                            >
                                <div className="h-52 bg-gray-200" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!cargandoPublicaciones && errorPublicaciones && (
                    <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
                        <p className="text-gray-700 font-semibold">
                            No pudimos cargar las publicaciones.
                        </p>
                        <p className="text-gray-500 mt-2">
                            Intenta actualizar la página en unos momentos.
                        </p>
                    </div>
                )}

                {!cargandoPublicaciones &&
                    !errorPublicaciones &&
                    publicaciones.length === 0 && (
                        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                                <Megaphone size={30} className="text-green-600" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mt-5">
                                Próximamente, nuevas publicaciones
                            </h3>

                            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                                Aquí encontrarás noticias, promociones y novedades de FutZone.
                            </p>
                        </div>
                    )}

                {!cargandoPublicaciones &&
                    !errorPublicaciones &&
                    publicaciones.length > 0 && (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {publicaciones.slice(0, 6).map((publicacion) => {
                                const imagen = publicacion.imagen_url
                                    ? publicacion.imagen_url.startsWith("http")
                                        ? publicacion.imagen_url
                                        : `http://127.0.0.1:8000/media/${publicacion.imagen_url.replace(/^\/?media\//, "")}`
                                    : null;

                                return (
                                    <article
                                        key={publicacion.id_publicacion}
                                        className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="relative h-52 bg-gradient-to-br from-green-800 to-emerald-500 overflow-hidden">
                                            {imagen ? (
                                                <img
                                                    src={imagen}
                                                    alt={publicacion.titulo}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                                                    {publicacion.tipo === "Noticia" ? (
                                                        <Newspaper size={46} />
                                                    ) : (
                                                        <Megaphone size={46} />
                                                    )}
                                                    <span className="font-bold mt-3 text-lg">
                                                        FUTZONE
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow ${publicacion.tipo === "Promoción"
                                                            ? "bg-amber-100 text-amber-800"
                                                            : "bg-blue-100 text-blue-800"
                                                        }`}
                                                >
                                                    <Tag size={13} />
                                                    {publicacion.tipo}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <CalendarDays size={16} />
                                                <span>
                                                    {publicacion.fecha_publicacion
                                                        ? new Date(
                                                            `${publicacion.fecha_publicacion}T12:00:00`
                                                        ).toLocaleDateString("es-CO", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })
                                                        : "Fecha no disponible"}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-gray-800 leading-snug line-clamp-2">
                                                {publicacion.titulo}
                                            </h3>

                                            <p className="text-gray-600 mt-3 leading-7 line-clamp-3 whitespace-pre-line">
                                                {publicacion.descripcion}
                                            </p>

                                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-green-700">
                                                    PUBLICADO POR FUTZONE
                                                </span>

                                                <span className="text-green-600">
                                                    <ChevronRight size={22} />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
            </section>


            {/* AYUDA Y MÁS INFORMACIÓN */}
            <section className="mt-12">
                <div className="mb-6">
                    <h2 className="text-3xl font-black text-gray-800">
                        Conoce más sobre FutZone
                    </h2>
                    <p className="text-gray-500 mt-2 text-lg">
                        Encuentra información sobre nuestra plataforma y resuelve tus dudas.
                    </p>
                </div>

                <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
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
                        <h2 className="text-2xl font-black text-gray-800 mt-6">Nosotros</h2>
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
        </>
    );
}