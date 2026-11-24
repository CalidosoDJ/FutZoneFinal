"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, CalendarPlus, Trophy } from "lucide-react";

export default function BannerBienvenida() {
    const [nombreUsuario, setNombreUsuario] = useState("Jugador");
    const [saludo, setSaludo] = useState("¡Bienvenido!");

    useEffect(() => {
        const hora = new Date().getHours();
        if (hora < 12) {
            setSaludo("¡Buenos días, crack! ☀️");
        } else if (hora < 18) {
            setSaludo("¡Buenas tardes, crack! ⚡");
        } else {
            setSaludo("¡Buenas noches, crack! 🌙");
        }

        try {
            const userIdActive = localStorage.getItem("usuarioLogueadoId");
            const usuarioGuardado =
                (userIdActive && localStorage.getItem(`perfilUsuario_${userIdActive}`)) ||
                localStorage.getItem("usuarioLogueado") ||
                sessionStorage.getItem("usuarioLogueado");

            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado);
                const nombreReal =
                    usuario.nombre_completo ||
                    usuario.nombre ||
                    usuario.username ||
                    "Jugador";
                setNombreUsuario(nombreReal);
            }
        } catch (err) {
            console.error("Error leyendo usuario de sesión:", err);
        }
    }, []);

    return (
        <section className="relative isolate overflow-hidden rounded-[32px] bg-gradient-to-r from-emerald-950 via-[#071b14] to-slate-900 p-8 md:p-10 text-white shadow-xl shadow-emerald-950/10 border border-emerald-500/20 mb-8">
            <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-64 w-64 rounded-full bg-lime-400/10 blur-[80px]" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 shadow-xs">
                        <Sparkles size={14} />
                        {saludo}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                        Hola,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
                            {nombreUsuario}
                        </span>{" "}
                        👋
                    </h1>

                    <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                        Estás listo para romperla en la cancha. Revisa tus reservas pendientes, haz pagos rápidos por Nequi y mantente al tanto de toda la comunidad FutZone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Link
                        href="/canchas"
                        className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                        <CalendarPlus size={18} />
                        Reservar Cancha
                    </Link>

                    <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 backdrop-blur-md">
                        <div className="p-2 rounded-xl bg-lime-400/20 text-lime-300">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Estado FutZone
                            </p>
                            <p className="text-xs font-black text-white">Sedes Activa 🟢</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}