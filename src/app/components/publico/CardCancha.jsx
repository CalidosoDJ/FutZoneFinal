"use client";

import {
  Star,
  MapPin,
  Users,
  CircleCheck,
} from "lucide-react";

export default function CardCancha({ cancha }) {
  return (
    <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-700 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 duration-300">

      {/* Imagen */}
      <div className="relative">

        <img
          src={cancha.imagen}
          alt={cancha.nombre}
          className="w-full h-56 object-cover hover:scale-105 duration-500"
        />

        <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Disponible
        </span>

        <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full flex items-center gap-1">
          <Star
            size={15}
            className="fill-yellow-400 text-yellow-400"
          />
          <span className="text-white text-sm">
            {cancha.calificacion}
          </span>
        </div>

      </div>

      {/* Contenido */}

      <div className="p-6">

        <h2 className="text-2xl font-bold text-white">

          {cancha.nombre}

        </h2>

        <p className="text-green-400 mt-1">

          {cancha.zona}

        </p>

        <div className="mt-5 space-y-3">

          <div className="flex items-center gap-2 text-gray-300">

            <MapPin size={18} />

            {cancha.direccion}

          </div>

          <div className="flex items-center gap-2 text-gray-300">

            <Users size={18} />

            10 jugadores

          </div>

          <div className="flex items-center gap-2 text-green-400">

            <CircleCheck size={18} />

            Disponible ahora

          </div>

        </div>

        <div className="flex justify-between items-center mt-6">

          <div>

            <p className="text-gray-400 text-sm">

              Precio

            </p>

            <h3 className="text-3xl font-black text-green-400">

              ${cancha.precio.toLocaleString()}

            </h3>

          </div>

          <button
            className="
            bg-green-500
            hover:bg-green-600
            px-6
            py-3
            rounded-xl
            text-white
            font-semibold
            duration-300
            "
          >

            Reservar

          </button>

        </div>

      </div>

    </div>
  );
}