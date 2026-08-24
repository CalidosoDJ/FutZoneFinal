"use client";

import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useArbitro } from "@/app/context/ArbitroContext";

import SidebarArbitro from "./SidebarArbitro";
import TarjetaPartido from "./TarjetaPartido";

export default function PartidosAsignados() {
  const [buscar, setBuscar] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [orden, setOrden] = useState("fecha");
  const { partidos } = useArbitro();

  const convertirFecha = (fecha) => {
    const [dia, mes, anio] = fecha.split("/");
    return new Date(anio, mes - 1, dia);
  };

  const partidosFiltrados = useMemo(() => {
    let lista = [...partidos];

    lista = lista.filter((partido) => {
      const texto = buscar.toLowerCase();

      const coincideBusqueda =
        partido.local.toLowerCase().includes(texto) ||
        partido.visitante.toLowerCase().includes(texto);

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
        lista.sort((a, b) => convertirFecha(a.fecha) - convertirFecha(b.fecha));
    }

    return lista;
  }, [buscar, filtroEstado, orden]);

  return (
    <main className="flex min-h-screen bg-gray-100">
      <SidebarArbitro />

      <section className="flex-1 ml-72 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Mis Partidos</h1>

          <p className="mt-2 text-slate-600">
            Consulta todos los partidos asignados para esta jornada.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder="Buscar equipo..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                className="
w-full
border
border-gray-300
rounded-xl
py-3
pl-12
pr-4
text-gray-700
placeholder:text-gray-400
outline-none
focus:ring-2
focus:ring-green-500
"
              />
            </div>

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="
border
border-gray-300
rounded-xl
px-4
py-3
text-gray-700
bg-white
outline-none
focus:ring-2
focus:ring-green-500
"
            >
              <option value="fecha">Ordenar por fecha</option>
              <option value="equipo">Ordenar por equipo</option>
              <option value="estado">Ordenar por estado</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {["Todos", "Pendiente", "En Curso", "Finalizado"].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  filtroEstado === estado
                    ? "bg-green-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            ⚽ {partidosFiltrados.length} partidos encontrados
          </h2>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {partidosFiltrados.map((partido) => (
            <TarjetaPartido key={partido.id} {...partido} />
          ))}
        </section>
      </section>
    </main>
  );
}