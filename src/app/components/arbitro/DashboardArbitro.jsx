"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarArbitro from "./SidebarArbitro";
import { useArbitro } from "@/app/context/ArbitroContext";
import {
  FaFutbol,
  FaCalendarAlt,
  FaStar,
  FaClipboardCheck,
  FaChevronRight,
} from "react-icons/fa";
import EstadisticaCard from "./EstadisticaCard";
import TarjetaPartido from "./TarjetaPartido";

export default function DashboardArbitro() {
  const router = useRouter();
  const { partidos, arbitro } = useArbitro();

  // Estado local interactivo para disponibilidad del árbitro
  const [disponible, setDisponible] = useState(arbitro?.disponible ?? true);

  const toggleEstado = () => {
    setDisponible((prev) => !prev);
    // Aquí puedes invocar tu función del context para actualizar en DB/API
  };

  const estadisticas = [
    {
      titulo: "Partidos Hoy",
      valor: partidos.length,
      subtexto: "1 pendiente, 1 en curso",
      badgeSuperior: "Ver más",
      badgeInferior: "Ver agenda",
      icono: <FaFutbol />,
      color: "bg-green-500",
      action: () => router.push("/arbitro/partidos-asignados"),
    },
    {
      titulo: "Próximos Partidos",
      valor: "6:00 PM",
      subtexto: "Hoy vs Juventus",
      badgeSuperior: "Ver más",
      badgeInferior: "Ver calendario completo",
      icono: <FaCalendarAlt />,
      color: "bg-blue-500",
    action: () => router.push("/arbitro/calendario"),
    },
    {
      titulo: "Calificación",
      valor: arbitro?.calificacion || "4.9",
      subtexto: "Excelente (Últimos 10 juegos)",
      badgeSuperior: "Ver más",
      badgeInferior: "Ver desglose de comentarios",
      icono: <FaStar />,
      color: "bg-yellow-500",
      esRating: true,
      action: () => router.push("/arbitro/perfil"),
    },
    {
      titulo: "Partidos Dirigidos",
      valor: arbitro?.partidosDirigidos || "125",
      subtexto: "Historial completo",
      badgeSuperior: "Detalles",
      badgeInferior: "Ver estadísticas",
      icono: <FaClipboardCheck />,
      color: "bg-purple-500",
      action: () => router.push("/arbitro/resumen-partido"),
    },
  ];

  return (
    <main className="flex bg-gray-100 min-h-screen text-gray-700">
      <SidebarArbitro />

      <section className="flex-1 ml-72 p-8 space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold text-gray-800">
            Buenos días, {arbitro?.nombre || "Carlos"} 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Hoy tienes {partidos.length} partidos asignados.
          </p>
        </header>

        {/* Métricas e Indicadores Funcionales */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {estadisticas.map((item, index) => (
            <EstadisticaCard key={index} {...item} />
          ))}
        </section>

        {/* Control de Estado del Árbitro */}
        <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Estado del árbitro
            </h2>
            <p className="text-sm text-gray-400">
              Próximo compromiso en 3h
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-medium transition-colors ${
                disponible
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  disponible ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              {disponible ? "Disponible" : "No disponible"}
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleEstado}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
            >
              <span>Cambiar estado</span>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  disponible ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    disponible ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        {/* Listado de Partidos Relevantes */}
        <div className="grid lg:grid-cols-2 gap-6">
          {partidos
            .filter(
              (partido) =>
                partido.estado === "Pendiente" || partido.estado === "En Curso"
            )
            .map((partido) => (
              <TarjetaPartido key={partido.id} {...partido} />
            ))}
        </div>
      </section>
    </main>
  );
}