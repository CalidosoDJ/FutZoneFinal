"use client";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFutbol,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useArbitro } from "@/app/context/ArbitroContext";

export default function TarjetaPartido({
  id,
  local,
  visitante,
  cancha,
  fecha,
  hora,
  categoria,
  estado,
}) {
  const router = useRouter();

  const { setPartidoSeleccionado } = useArbitro();
  const colorEstado = {
    Pendiente: "bg-yellow-100 text-yellow-700",

    "En Curso": "bg-blue-100 text-blue-700",

    Finalizado: "bg-green-100 text-green-700",

    Cancelado: "bg-red-100 text-red-700",
  };
  function dirigirPartido() {
  setPartidoSeleccionado({
    id,
    local,
    visitante,
    cancha,
    fecha,
    hora,
    categoria,
    estado,
  });

  router.push("/arbitro/resumen-partido");
}

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg text-slate-800">⚽ Partido #{id}</h2>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${colorEstado[estado]}`}
        >
          {estado}
        </span>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold text-slate-800 text-center">
          {local}
        </h3>

        <p className="text-center text-slate-700 font-semibold my-2">VS</p>

        <h3 className="text-2xl font-bold text-slate-800 text-center">
          {visitante}
        </h3>
      </div>

      <div className="space-y-3 text-gray-700">
        <p className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-green-600" />

          {cancha}
        </p>

        <p className="flex items-center gap-3">
          <FaCalendarAlt className="text-green-600" />

          {fecha}
        </p>

        <p className="flex items-center gap-3">
          <FaClock className="text-green-600" />

          {hora}
        </p>

        <p className="flex items-center gap-3">
          <FaFutbol className="text-green-600" />

          {categoria}
        </p>
      </div>

      <button
  onClick={dirigirPartido}
  className="
      mt-8
      w-full
      bg-green-600
      hover:bg-green-700
      text-white
      py-3
      rounded-xl
      font-semibold
      transition
  "
>
        Dirigir Partido
      </button>
    </article>
  );
}
