"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarArbitro from "./SidebarArbitro";
import { useArbitro } from "@/app/context/ArbitroContext";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaFutbol,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

export default function CalendarioArbitro() {
  const router = useRouter();
  const { partidos, setPartidoSeleccionado } = useArbitro();

  // Fecha de navegación
  const [fechaActual, setFechaActual] = useState(new Date(2026, 9, 1)); // Octubre 2026
  const [partidoDetalle, setPartidoDetalle] = useState(null);

  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Días del mes actual
  const primerDiaMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    1
  );
  const ultimoDiaMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() + 1,
    0
  );

  let offsetInicio = primerDiaMes.getDay() - 1;
  if (offsetInicio === -1) offsetInicio = 6;

  const totalDias = ultimoDiaMes.getDate();

  const mesAnterior = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1)
    );
  };

  const mesSiguiente = () => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1)
    );
  };

  const nombreMes = fechaActual.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // Comparar fecha del calendario con la fecha cargada en el Contexto
  const obtenerPartidosDelDia = (dia) => {
    const diaFormatted = String(dia).padStart(2, "0");
    const mesFormatted = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const anioFormatted = fechaActual.getFullYear();
    const fechaBuscar = `${diaFormatted}/${mesFormatted}/${anioFormatted}`;

    return partidos.filter((p) => p.fecha === fechaBuscar);
  };

  const handleIrADirigir = (partido) => {
    setPartidoSeleccionado(partido);
    router.push("/arbitro/resumen-partido");
  };

  return (
    <main className="bg-slate-50 min-h-screen text-slate-700">
      <SidebarArbitro />

      <section className="ml-72 p-8 space-y-6">
        {/* Header Superior */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <FaCalendarAlt className="text-green-600" />
              Calendario de Programación
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Consulta tus fechas asignadas y haz clic sobre ellas para ver los detalles.
            </p>
          </div>

          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaInfoCircle className="text-green-600 text-sm" />
            <span>{partidos.length} Partidos Programados en Sistema</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Grilla Principal del Calendario */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            {/* Control de Navegación del Mes */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-800 capitalize tracking-wide">
                {nombreMes}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={mesAnterior}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={mesSiguiente}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center font-bold text-slate-400 text-xs uppercase tracking-wider">
              {diasSemana.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Celdas del Mes */}
            <div className="grid grid-cols-7 gap-2">
              {/* Offset inicial */}
              {Array.from({ length: offsetInicio }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-28 bg-slate-50/60 rounded-xl border border-slate-100/50"
                />
              ))}

              {/* Días de la grilla */}
              {Array.from({ length: totalDias }).map((_, idx) => {
                const dia = idx + 1;
                const partidosDia = obtenerPartidosDelDia(dia);
                const tienePartidos = partidosDia.length > 0;
                const esSeleccionado = partidoDetalle?.fecha === partidosDia[0]?.fecha;

                return (
                  <div
                    key={dia}
                    onClick={() =>
                      tienePartidos && setPartidoDetalle(partidosDia[0])
                    }
                    className={`h-28 p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                      tienePartidos
                        ? esSeleccionado
                          ? "bg-green-100 border-green-500 shadow-md ring-2 ring-green-400 cursor-pointer"
                          : "bg-emerald-50/60 border-emerald-300 hover:border-green-500 hover:shadow-md cursor-pointer"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          tienePartidos
                            ? "bg-green-600 text-white shadow-sm"
                            : "text-slate-600"
                        }`}
                      >
                        {dia}
                      </span>
                    </div>

                    {/* Muestra rápida de partido */}
                    <div className="space-y-1 overflow-hidden">
                      {partidosDia.map((p) => (
                        <div
                          key={p.id}
                          className="text-[10px] font-bold p-1.5 rounded-lg bg-slate-900 text-white truncate shadow-xs"
                        >
                          <span className="text-green-400">{p.hora}</span> - {p.local}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Derecha: Información Detallada */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
              Detalles del Partido
            </h2>

            {partidoDetalle ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Partido #{partidoDetalle.id}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {partidoDetalle.fecha}
                  </span>
                </div>

                <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl text-center space-y-2 shadow-sm">
                  <h3 className="text-xl font-extrabold">{partidoDetalle.local}</h3>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-widest">
                    VS
                  </p>
                  <h3 className="text-xl font-extrabold">{partidoDetalle.visitante}</h3>
                </div>

                <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-3">
                    <FaClock className="text-green-600 text-base" />
                    <span className="font-semibold">{partidoDetalle.hora}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-green-600 text-base" />
                    <span>{partidoDetalle.cancha}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaFutbol className="text-green-600 text-base" />
                    <span>Categoría: {partidoDetalle.categoria}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleIrADirigir(partidoDetalle)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-md"
                >
                  Ir a Dirigir / Ver Acta
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-20 text-slate-800" />
                <p className="text-sm font-semibold text-slate-600">
                  Selecciona una fecha destacada en verde
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Aquí aparecerá el resumen completo del partido seleccionado.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
