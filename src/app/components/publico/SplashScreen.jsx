"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Posiciones y tiempos estables para las partículas
const particulas = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 37.7 + 13) % 100}%`,
  animationDelay: `${(i * 0.37) % 2}s`,
  animationDuration: `${2 + ((i * 0.23) % 2)}s`,
}));

export default function SplashScreen({ onFinish }) {
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const temporizadorAnimacion = setTimeout(() => {
      setAnimar(true);
    }, 300);

    const temporizadorFinal = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(temporizadorAnimacion);
      clearTimeout(temporizadorFinal);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br
      from-green-900 via-green-700 to-green-500 flex justify-center items-center
      ${animar ? "animate-screenShake" : ""}`}
    >
      {/* Luz de fondo */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-green-400/20 blur-[150px] animate-pulse" />

      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white"
            style={{ top: `${i * 8}%` }}
          />
        ))}
      </div>

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden">
        {particulas.map((particula) => (
          <span
            key={particula.id}
            className="particle"
            style={{
              left: particula.left,
              animationDelay: particula.animationDelay,
              animationDuration: particula.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div
        className={`absolute transition-all duration-[1500ms] ${
          animar
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 rotate-12"
        }`}
      >
        <Image
          src="/icons/futzone logo.jpeg"
          alt="FutZone"
          width={240}
          height={240}
          priority
          className="animate-logo-glow"
        />
      </div>

      {/* Fondo inferior */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-green-900 via-green-700 to-transparent" />

      {/* Jugador */}
      <div
        className={`absolute bottom-16 left-10 transition-all duration-[1800ms] ${
          animar ? "translate-x-[260px]" : ""
        }`}
      >
        <Image
          src="/images/jugador.png"
          alt="Jugador"
          width={200}
          height={200}
          priority
          className="drop-shadow-2xl animate-jugador"
        />
      </div>

      {/* Balón */}
      <div
        className={`absolute bottom-16 left-52 transition-all duration-[1000ms] ${
          animar ? "translate-x-[1000px] rotate-[1080deg] scale-125" : ""
        }`}
      >
        <Image
          src="/images/balon.png"
          alt="Balón"
          width={60}
          height={60}
          priority
          className="animate-balon animate-ball-shot"
        />
      </div>

      {/* Efecto del balón */}
      <div
        className={`absolute bottom-20 left-60 w-24 h-24 rounded-full bg-white/20 blur-3xl transition-all duration-1000 ${
          animar ? "opacity-100 scale-[4]" : "opacity-0"
        }`}
      />

      {/* Texto */}
      <div
        className={`absolute bottom-24 flex flex-col items-center transition-all duration-1000 ${
          animar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-6xl font-black text-white tracking-widest">
          FUTZONE
        </h1>

        <p className="text-green-100 text-xl mt-3">
          Reserva • Juega • Disfruta
        </p>
      </div>
    </div>
  );
}
