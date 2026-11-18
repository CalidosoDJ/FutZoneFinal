"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ onFinish }) {
    const [animar, setAnimar] = useState(false);
    const [particulas, setParticulas] = useState([]);

    useEffect(() => {
        // 1. GENERAR PARTÍCULAS SOLO EN EL CLIENTE PARA EVITAR ERROR DE HIDRATACIÓN
        const particulasGeneradas = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
        }));
        setParticulas(particulasGeneradas);

        // 2. DISPARAR ANIMACIONES DE ENTRADA
        const timerAnimacion = setTimeout(() => {
            setAnimar(true);
        }, 200);

        // 3. FINALIZAR SPLASH SCREEN
        const timerFinish = setTimeout(() => {
            onFinish();
        }, 1500);

        return () => {
            clearTimeout(timerAnimacion);
            clearTimeout(timerFinish);
        };
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 flex flex-col items-center justify-between p-6 sm:p-10 ${animar ? "animate-screenShake" : ""
                }`}
        >
            {/* LUZ Y LÍNEAS DE FONDO DECORATIVAS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-emerald-400/20 blur-[100px] sm:blur-[140px] animate-pulse pointer-events-none" />

            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-px bg-white"
                        style={{ top: `${i * 8.5}%` }}
                    />
                ))}
            </div>

            {/* PARTÍCULAS CONTROLADAS EN CLIENTE */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particulas.map((p) => (
                    <span
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            animationDelay: p.animationDelay,
                            animationDuration: p.animationDuration,
                        }}
                    />
                ))}
            </div>

            {/* CONTENEDOR CENTRAL: LOGO + TÍTULO (FLEXBOX CENTRADO QUE EVITA SOLAPAMIENTO) */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center gap-4 sm:gap-6 max-w-lg">
                {/* LOGO CON ESCALA RESPONSIVA */}
                <div
                    className={`transition-all duration-[1200ms] ease-out ${animar
                        ? "opacity-100 scale-100 rotate-0"
                        : "opacity-0 scale-50 rotate-12"
                        }`}
                >
                    <Image
                        src="/icons/futzone logo.jpeg"
                        alt="FutZone"
                        width={180}
                        height={180}
                        priority
                        className="w-36 h-36 sm:w-52 sm:h-52 rounded-full border-4 border-emerald-400/40 shadow-2xl animate-logo-glow object-cover"
                    />
                </div>

                {/* TEXTOS (FUTZONE Y SLOGAN) */}
                <div
                    className={`transition-all duration-[1000ms] delay-300 ${animar
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                        }`}
                >
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest drop-shadow-md">
                        FUT<span className="text-emerald-400">ZONE</span>
                    </h1>
                    <p className="text-emerald-100 text-sm sm:text-xl font-medium mt-1 sm:mt-2 tracking-wide">
                        Reserva • Juega • Disfruta
                    </p>
                </div>
            </div>

            {/* ZONA INFERIOR: CANCHA / JUGADOR Y BALÓN (SÓLO VISIBLE EN PANTALLAS MEDIANAS Y GRANDES PARA MANTENER LA LIMPIEZA) */}
            <div className="relative z-10 w-full max-w-4xl h-24 sm:h-32 flex items-end justify-between pointer-events-none overflow-hidden">
                {/* JUGADOR */}
                <div
                    className={`transition-all duration-[1500ms] ease-out ${animar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                        }`}
                >
                    <Image
                        src="/images/jugador.png"
                        alt="Jugador"
                        width={140}
                        height={140}
                        priority
                        className="w-24 h-24 sm:w-36 sm:h-36 object-contain drop-shadow-2xl"
                    />
                </div>

                {/* BALÓN CON REMATE / ANIMACIÓN */}
                <div
                    className={`transition-all duration-[1200ms] ease-out ${animar ? "translate-x-0 rotate-[720deg] opacity-100" : "translate-x-[-200px] opacity-0"
                        }`}
                >
                    <Image
                        src="/images/balon.png"
                        alt="Balón"
                        width={50}
                        height={50}
                        priority
                        className="w-10 h-10 sm:w-14 sm:h-14 object-contain animate-balon"
                    />
                </div>
            </div>
        </div>
    );
}