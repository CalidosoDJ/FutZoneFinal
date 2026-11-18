
import Image from "next/image";
import {
    MapPinned,
    CalendarCheck,
    ShieldCheck,
    Users,
    Trophy,
    Target,
    Goal,
    Heart,
} from "lucide-react";

export default function FooterJugador() {
    return (
        <footer className="mt-20 bg-slate-950 text-white">

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* IDENTIDAD Y PROPÓSITO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <div className="flex items-center gap-4">
                            <Image
                                src="/icons/futzone%20logo.jpeg"
                                alt="Logo FutZone"
                                width={75}
                                height={75}
                                className="rounded-xl object-contain"
                            />

                            <div>
                                <h2 className="text-4xl font-black tracking-wide">
                                    FUT<span className="text-green-400">ZONE</span>
                                </h2>
                                <p className="text-green-400 font-semibold">
                                    Tu pasión, tu cancha
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-400 leading-8 mt-7 text-lg">
                            FutZone es una plataforma digital diseñada para
                            conectar a jugadores, equipos y escenarios deportivos
                            en un solo lugar, facilitando la organización de
                            encuentros y la reserva de canchas sintéticas.
                        </p>

                        <p className="text-green-400 font-bold text-lg mt-5">
                            La pasión nunca se detiene.
                        </p>
                    </div>

                    {/* FRASE DESTACADA */}
                    <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-900/50 to-slate-900 p-9">
                        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-green-500/10" />

                        <div className="relative">
                            <Goal size={42} className="text-green-400 mb-5" />

                            <h3 className="text-3xl font-black leading-tight">
                                Más que reservar una cancha,
                                <span className="text-green-400"> conectamos pasiones.</span>
                            </h3>

                            <p className="text-slate-300 leading-7 mt-5">
                                Creamos una experiencia deportiva más organizada,
                                accesible y sencilla para quienes viven el fútbol.
                            </p>
                        </div>
                    </div>

                </div>

                {/* INFORMACIÓN DEL PROYECTO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-7">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                            <Target size={26} className="text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">
                            Nuestra misión
                        </h3>
                        <p className="text-slate-400 leading-7 text-sm">
                            Simplificar la búsqueda y reserva de escenarios
                            deportivos mediante una solución digital intuitiva.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-7">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                            <MapPinned size={26} className="text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">
                            Escenarios deportivos
                        </h3>
                        <p className="text-slate-400 leading-7 text-sm">
                            Facilitamos el descubrimiento de canchas sintéticas
                            y la consulta de su información y disponibilidad.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-7">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                            <CalendarCheck size={26} className="text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">
                            Organización digital
                        </h3>
                        <p className="text-slate-400 leading-7 text-sm">
                            Promovemos una gestión más eficiente de horarios,
                            reservas y encuentros deportivos.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-7">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                            <Users size={26} className="text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">
                            Comunidad futbolera
                        </h3>
                        <p className="text-slate-400 leading-7 text-sm">
                            Conectamos jugadores y equipos para fortalecer
                            la integración alrededor del deporte.
                        </p>
                    </div>

                </div>

                {/* VALORES */}
                <div className="mt-16 text-center">
                    <span className="text-green-400 uppercase tracking-[0.25em] text-sm font-bold">
                        Nuestra esencia
                    </span>

                    <h3 className="text-3xl font-black mt-3">
                        El fútbol nos une
                    </h3>

                    <div className="flex flex-wrap justify-center gap-5 mt-8">

                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-full">
                            <ShieldCheck size={19} className="text-green-400" />
                            <span className="text-slate-300">Confianza</span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-full">
                            <Heart size={19} className="text-green-400" />
                            <span className="text-slate-300">Pasión deportiva</span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-full">
                            <Trophy size={19} className="text-green-400" />
                            <span className="text-slate-300">Competitividad</span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-full">
                            <Users size={19} className="text-green-400" />
                            <span className="text-slate-300">Trabajo en equipo</span>
                        </div>

                    </div>
                </div>

                {/* CIERRE */}
                <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()}{" "}
                        <strong className="text-white">FutZone</strong>.
                        Todos los derechos reservados.
                    </p>

                    <p className="text-slate-400 text-sm font-medium">
                        Hecho para los amantes del fútbol ⚽
                    </p>

                </div>

            </div>
        </footer>
    );
}
