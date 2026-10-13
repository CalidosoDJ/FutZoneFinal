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
  const { setPartidoSeleccionado, cambiarEstadoPartido } = useArbitro();

  const colorEstado = {
    Pendiente: "bg-amber-100 text-amber-700 font-semibold",
    "En Curso": "bg-blue-100 text-blue-700 font-bold animate-pulse",
    Finalizado: "bg-green-100 text-green-700 font-semibold",
    Cancelado: "bg-red-100 text-red-700 font-semibold",
  };

  const handleAccionPartido = () => {
    // 1. Guardar el partido activo en el contexto
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

    // 2. Si estaba pendiente, actualizar estado a 'En Curso' automáticamente al ingresar
    if (estado === "Pendiente") {
      cambiarEstadoPartido(id, "En Curso");
    }

    // 3. Redirigir a la vista de gestión del partido
    router.push("/arbitro/resumen-partido");
  };

  // Determinar texto y estilo del botón según el estado
  const getBotonConfig = () => {
    switch (estado) {
      case "En Curso":
        return {
          texto: "Ir a transmisión / Dirigir",
          estilos: "bg-green-600 hover:bg-green-700 text-white shadow-md",
        };
      case "Finalizado":
        return {
          texto: "Ver Acta / Resumen",
          estilos: "bg-slate-700 hover:bg-slate-800 text-white",
        };
      case "Cancelado":
        return {
          texto: "Partido Cancelado",
          estilos: "bg-gray-200 text-gray-400 cursor-not-allowed",
        };
      default:
        return {
          texto: "Dirigir Partido",
          estilos: "bg-green-600 hover:bg-green-700 text-white",
        };
    }
  };

  const { texto, estilos } = getBotonConfig();

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100 flex flex-col justify-between">
      <div>
        {/* Encabezado: Número de Partido y Badge de Estado */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-800">⚽ Partido #{id}</h2>
          <span className={`px-4 py-1.5 rounded-full text-xs ${colorEstado[estado] || "bg-gray-100 text-gray-700"}`}>
            {estado}
          </span>
        </div>

        {/* Equipos */}
        <div className="my-6">
          <h3 className="text-2xl font-bold text-slate-800 text-center">
            {local}
          </h3>
          <p className="text-center text-slate-400 font-bold my-1 text-sm">vs</p>
          <h3 className="text-2xl font-bold text-slate-800 text-center">
            {visitante}
          </h3>
        </div>

        {/* Detalles del Encuentro */}
        <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-green-600 text-base" />
            <span>{cancha}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaCalendarAlt className="text-green-600 text-base" />
            <span>{fecha}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaClock className="text-green-600 text-base" />
            <span>{hora}</span>
          </p>
          <p className="flex items-center gap-3">
            <FaFutbol className="text-green-600 text-base" />
            <span>{categoria}</span>
          </p>
        </div>
      </div>

      {/* Botón de Acción Dinámico */}
      <button
        onClick={handleAccionPartido}
        disabled={estado === "Cancelado"}
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-200 ${estilos}`}
      >
        {texto}
      </button>
    </article>
  );
}