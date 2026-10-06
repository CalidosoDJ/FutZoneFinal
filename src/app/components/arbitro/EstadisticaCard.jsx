"use client";

import { FaStar, FaChevronRight } from "react-icons/fa";

export default function EstadisticaCard({
    titulo,
    valor,
    subtexto,
    badgeSuperior,
    badgeInferior,
    icono,
    color,
    esRating = false,
    action,
}) {
    return (
        <div
            onClick={action}
            className={`bg-white rounded-xl p-5 shadow-md border border-gray-100 flex flex-col justify-between transition-all duration-200 ${action ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5" : ""
                }`}
        >
            {/* Superior: Título + Badge de Acción Superior */}
            <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-500">{titulo}</span>
                {badgeSuperior && (
                    <span className="text-xs font-semibold text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors">
                        {badgeSuperior} <FaChevronRight className="text-[10px]" />
                    </span>
                )}
            </div>

            {/* Medio: Valor + Ícono + Subtexto */}
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

                <div className={`p-3 rounded-xl text-white text-xl shadow-sm ${color}`}>
                    {icono}
                </div>
            </div>

            {/* Inferior: Enlace/Botón Inferior */}
            {badgeInferior && (
                <div className="w-full pt-3 mt-1 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600 hover:text-green-600 transition-colors">
                    <span>{badgeInferior}</span>
                    <FaChevronRight className="text-[10px]" />
                </div>
            )}
        </div>
    );
}