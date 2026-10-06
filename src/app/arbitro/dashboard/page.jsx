"use client";

import { useRouter } from "next/navigation";
import SidebarArbitro from "@/app/components/arbitro/SidebarArbitro";
import EstadisticaCard from "@/app/components/arbitro/EstadisticaCard";
import TarjetaPartido from "@/app/components/arbitro/TarjetaPartido";
import { useArbitro } from "@/app/context/ArbitroContext";
import {
  FaFutbol,
  FaCalendarAlt,
  FaStar,
  FaClipboardCheck,
} from "react-icons/fa";

export default function DashboardArbitroPage() {
  const router = useRouter();
  const { arbitro, partidos, toggleDisponibilidad } = useArbitro();

  // Filtrar conteos rápidos
  const partidosHoy = partidos.filter(
    (p) => p.estado === "Pendiente" || p.estado === "En Curso"
  );
  const pendientesCount = partidos.filter((p) => p.estado === "Pendiente").length;
  const enCursoCount = partidos.filter((p) => p.estado === "En Curso").length;

  // Configuración de las 4 tarjetas de métricas
  const estadisticas = [
    {
      titulo: "Partidos Hoy",
      valor: partidosHoy.length,
      subtexto: `${pendientesCount} pendiente${pendientesCount !== 1 ? "s" : ""}, ${enCursoCount} en curso`,
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
      action: () => router.push("/arbitro/partidos-asignados"),
    },
    {
      titulo: "Calificación",
      valor: arbitro?.calificacion || 4.9,
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
      valor: arbitro?.partidosDirigidos || 0,
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
        {/* Encabezado */}
        <header>
          <h1 className="text-4xl font-bold text-gray-800">
            Buenos días, {arbitro?.nombre?.split(" ")[0] || "Carlos"} 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Hoy tienes {partidosHoy.length} partido{partidosHoy.length !== 1 ? "s" : ""} asignado{partidosHoy.length !== 1 ? "s" : ""}.
          </p>
        </header>

        {/* 1. Tarjetas de Métricas Interactivas */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {estadisticas.map((item, index) => (
            <EstadisticaCard key={index} {...item} />
          ))}
        </section>

        {/* 2. Control de Estado del Árbitro */}
        <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Estado del árbitro
            </h2>
            <p className="text-sm text-gray-400">Próximo compromiso en 3h</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Badge Indicator */}
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-medium transition-colors ${
                arbitro?.disponible
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  arbitro?.disponible ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></span>
              {arbitro?.disponible ? "Disponible" : "No disponible"}
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleDisponibilidad}
              className="flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer"
            >
              <span>Cambiar estado</span>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  arbitro?.disponible ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    arbitro?.disponible ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        {/* 3. Listado de Partidos */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Partidos Activos</h2>
          {partidosHoy.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center text-gray-400 shadow-sm border border-gray-100">
              No tienes partidos pendientes o en curso por el momento.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {partidosHoy.map((partido) => (
                <TarjetaPartido key={partido.id} {...partido} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}