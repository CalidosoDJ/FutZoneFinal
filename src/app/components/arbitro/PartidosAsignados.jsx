"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaFutbol } from "react-icons/fa";
import { useArbitro } from "@/app/context/ArbitroContext";

import SidebarArbitro from "./SidebarArbitro";
import TarjetaPartido from "./TarjetaPartido";

export default function PartidosAsignados() {
  const [buscar, setBuscar] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [orden, setOrden] = useState("fecha");
  const { partidos } = useArbitro();

  // Helper seguro para ordenar por fecha
  const convertirFecha = (fechaStr) => {
    if (!fechaStr) return new Date();
    if (fechaStr.includes("/")) {
      const [dia, mes, anio] = fechaStr.split("/");
      return new Date(anio, mes - 1, dia);
    }
    return new Date(fechaStr);
  };

  const partidosFiltrados = useMemo(() => {
    let lista = [...partidos];

    lista = lista.filter((partido) => {
      const texto = buscar.toLowerCase();

      const coincideBusqueda =
        partido.local.toLowerCase().includes(texto) ||
        partido.visitante.toLowerCase().includes(texto) ||
        partido.cancha?.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" || partido.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });

    switch (orden) {
      case "equipo":
        lista.sort((a, b) => a.local.localeCompare(b.local));
        break;

      case "estado":
        lista.sort((a, b) => a.estado.localeCompare(b.estado));
        break;

      default:
        lista.sort(
          (a, b) => convertirFecha(a.fecha) - convertirFecha(b.fecha)
        );
    }

    return lista;
  }, [partidos, buscar, filtroEstado, orden]);

  return (
    <main className="flex min-h-screen bg-gray-100">
      <SidebarArbitro />

      <section className="flex-1 ml-72 p-8 space-y-6">
        <header>
          <h1 className="text-4xl font-bold text-slate-800">Mis Partidos</h1>
          <p className="mt-2 text-slate-600">
            Consulta y gestiona todos los partidos asignados para la jornada.
          </p>
        </header>

        {/* Barra de Filtros y Búsqueda */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por equipo o cancha..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-700 bg-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
            >
              <option value="fecha">Ordenar por fecha</option>
              <option value="equipo">Ordenar por equipo</option>
              <option value="estado">Ordenar por estado</option>
            </select>
          </div>

          {/* Botones de Filtro por Estado */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["Todos", "Pendiente", "En Curso", "Finalizado"].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-5 py-2 rounded-full font-semibold transition-all cursor-pointer ${
                  filtroEstado === estado
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </section>

        {/* Encabezado de Resultados */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaFutbol className="text-green-600" />
            <span>{partidosFiltrados.length} partidos encontrados</span>
          </h2>
        </div>

        {/* Listado o Mensaje de No Resultados */}
        {partidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            <p className="text-lg font-medium">
              No se encontraron partidos que coincidan con la búsqueda.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Prueba cambiando el filtro de estado o el texto ingresado.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {partidosFiltrados.map((partido) => (
              <TarjetaPartido key={partido.id} {...partido} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}