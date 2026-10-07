"use client";

import { FaStar, FaChevronRight } from "react-icons/fa";

export default function EstadisticaCard({
  titulo,
  valor,
  subtexto,
  badgeInferior,
  icono,
  color,
  esRating = false,
  action,
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 flex flex-col justify-between">
      {/* 1. Título de la tarjeta */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-gray-500">{titulo}</span>
      </div>

      {/* 2. Valor principal, estrellas/subtexto e ícono estático */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-gray-800">
              {valor}
            </span>
            {esRating && (
              <div className="flex text-yellow-400 text-sm gap-0.5 ml-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            )}
          </div>
          {subtexto && (
            <p className="text-xs text-gray-400 mt-1">{subtexto}</p>
          )}
        </div>

        {/* Ícono visual (Estático - No hace nada al darle clic) */}
        <div className={`p-3 rounded-xl text-white text-xl shadow-sm ${color}`}>
          {icono}
        </div>
      </div>

      {/* 3. ÚNICO BOTÓN CLICKEABLE EN TODA LA TARJETA */}
      {badgeInferior && (
        <button
          onClick={action}
          className="w-full pt-3 mt-1 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
        >
          <span>{badgeInferior}</span>
          <FaChevronRight className="text-[10px]" />
        </button>
      )}
    </div>
  );
}