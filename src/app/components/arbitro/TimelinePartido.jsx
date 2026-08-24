"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import EventoTimeline from "./EventoTimeline";
import ModalAgregarEvento from "./ModalAgregarEvento";

export default function TimelinePartido({ eventos, onAgregarEvento }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  function guardarEvento(nuevoEvento) {
    onAgregarEvento(nuevoEvento);
    setMostrarModal(false);
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 min-h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Cronología del Partido
        </h2>

        <button
          onClick={() => setMostrarModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <FaPlus />
          Agregar Evento
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {eventos.length === 0 && (
          <div className="flex h-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">
              Aún no se han registrado eventos.
            </p>
          </div>
        )}
        {eventos.map((evento) => (
          <EventoTimeline
            key={evento.id}
            tipo={evento.tipo}
            jugador={evento.jugador}
            equipo={evento.equipo}
            minuto={evento.minuto}
          />
        ))}
      </div>

      <ModalAgregarEvento
        abierto={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onGuardar={guardarEvento}
      />
    </section>
  );
}
