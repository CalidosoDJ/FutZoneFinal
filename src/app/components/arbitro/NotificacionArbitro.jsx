"use client";

import { useState } from "react";
import SidebarArbitro from "./SidebarArbitro";
import TarjetaNotificacion from "./TarjetaNotificacion";
import { useArbitro } from "@/app/context/ArbitroContext";

export default function NotificacionArbitro() {
  const { notificaciones, setNotificaciones, marcarNotificacionLeida } = useArbitro();
  const [filtro, setFiltro] = useState("Todas");

  // Calcular conteo sin leer
  const sinLeerCount = notificaciones.filter((n) => !n.leida).length;

  // Filtrado dinámico
  const notificacionesFiltradas = notificaciones.filter((n) => {
    if (filtro === "No leídas") return !n.leida;
    if (filtro === "Partidos") return n.titulo.toLowerCase().includes("partido") || n.titulo.toLowerCase().includes("acta");
    if (filtro === "Sistema") return !n.titulo.toLowerCase().includes("partido");
    return true; // "Todas"
  });

  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <SidebarArbitro />

      <section className="ml-72 min-h-screen px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Encabezado */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                🔔 Notificaciones
              </h1>
              <p className="mt-2 text-slate-600">
                Consulta las novedades relacionadas con tus partidos y actividades como árbitro.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 border border-green-200 rounded-xl px-5 py-3">
                <p className="text-sm font-semibold text-green-700">
                  {sinLeerCount} {sinLeerCount === 1 ? "nueva" : "nuevas"}
                </p>
              </div>

              {sinLeerCount > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="text-xs font-semibold text-green-700 hover:text-green-800 underline px-2 py-1 cursor-pointer"
                >
                  Marcar todas leídas
                </button>
              )}
            </div>
          </header>

          {/* Barra de Filtros */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <div className="flex flex-wrap gap-3">
              {["Todas", "No leídas", "Partidos", "Sistema"].map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setFiltro(categoria)}
                  className={`px-5 py-2 rounded-full font-semibold transition cursor-pointer ${
                    filtro === categoria
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </section>

          {/* Listado de Notificaciones */}
          <section className="space-y-4">
            {notificacionesFiltradas.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-slate-200 shadow-sm">
                No tienes notificaciones en este filtro.
              </div>
            ) : (
              notificacionesFiltradas.map((notificacion) => (
                <div
                  key={notificacion.id}
                  onClick={() => marcarNotificacionLeida(notificacion.id)}
                  className="cursor-pointer"
                >
                  <TarjetaNotificacion
                    icono={notificacion.icono}
                    titulo={notificacion.titulo}
                    descripcion={notificacion.mensaje}
                    tiempo={notificacion.fecha}
                    leida={notificacion.leida}
                  />
                </div>
              ))
            )}
          </section>
        </div>
      </section>
    </main>
  );
}