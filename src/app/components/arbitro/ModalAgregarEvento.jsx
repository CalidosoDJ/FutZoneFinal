"use client";

import { useState } from "react";
export default function ModalAgregarEvento({ abierto, onClose, onGuardar }) {
  const [tipo, setTipo] = useState("Gol");
  const [jugador, setJugador] = useState("");
  const [minuto, setMinuto] = useState("");
  const [equipo, setEquipo] = useState("Local");

  if (!abierto) return null;

  function agregarEvento() {
    if (!jugador.trim() || !minuto) {
      alert("Completa todos los campos.");
      return;
    }

    onGuardar({
      id: Date.now(),
      tipo,
      jugador,
      minuto: Number(minuto),
      equipo,
    });

    setJugador("");
    setMinuto("");
    setTipo("Gol");
    setEquipo("Local");

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <section className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Agregar Evento
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Tipo de evento
            </label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="
w-full
border
border-gray-300
rounded-xl
p-3
text-gray-700
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-green-500
"
            >
              <option>Gol</option>

              <option>Tarjeta Amarilla</option>

              <option>Tarjeta Roja</option>

              <option>Cambio</option>

              <option>Lesión</option>

              <option>Penal</option>

              <option>Tiempo Agregado</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Jugador
            </label>

            <input
              type="text"
              value={jugador}
              onChange={(e) => setJugador(e.target.value)}
              className="
w-full
border
border-gray-300
rounded-xl
p-3
text-gray-700
placeholder:text-gray-400 
focus:outline-none
focus:ring-2
focus:ring-green-500
"
              placeholder="Nombre del jugador"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Minuto
            </label>

            <input
              type="number"
              value={minuto}
              onChange={(e) => setMinuto(e.target.value)}
              className="
w-full
border
border-gray-300
rounded-xl
p-3
text-gray-700
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-green-500
"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Equipo
            </label>

            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="
w-full
border
border-gray-300
rounded-xl
p-3
text-gray-700
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-green-500
"
            >
              <option>Local</option>

              <option>Visitante</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            onClick={agregarEvento}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
          >
            Agregar
          </button>
        </div>
      </section>
    </div>
  );
}
