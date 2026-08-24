"use client";

import { useState } from "react";
import SidebarArbitro from "./SidebarArbitro";
import TimelinePartido from "./TimelinePartido";
import ModalResumen from "./ModalResumen";
import MarcadorPartido from "./MarcadorPartido";
import HeaderResumen from "./HeaderResumen";
import PanelObservaciones from "./PanelObservaciones";
import BotonesResumen from "./BotonesResumen";
import { useArbitro } from "@/app/context/ArbitroContext";

export default function ResumenPartido() {
  // Inicializados explícitamente como números enteros

  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { partidoSeleccionado, finalizarPartido } = useArbitro();

  function agregarEvento(eventoNuevo) {
    setEventos((eventosAnteriores) => [...eventosAnteriores, eventoNuevo]);
  }
  const partido = partidoSeleccionado || {
    local: "",
    visitante: "",
    cancha: "",
    fecha: "",
    hora: "",
    categoria: "",
  };

  const { local, visitante, cancha, fecha, hora, categoria } = partido;
  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Sidebar con color de texto base forzado a oscuro si es necesario */}
      <SidebarArbitro />

      {/* Contenedor principal con alta visibilidad y distribución compacta */}
      <section className="ml-72 min-h-screen px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabecera optimizada en espacio */}
          <HeaderResumen />

          <MarcadorPartido
            local={local}
            visitante={visitante}
            cancha={cancha}
            fecha={fecha}
            hora={hora}
            categoria={categoria}
            golesLocal={golesLocal}
            setGolesLocal={setGolesLocal}
            golesVisitante={golesVisitante}
            setGolesVisitante={setGolesVisitante}
          />
          {/* Grid de doble columna para mitigar el Scroll */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Columna de Eventos/Cronología */}
            <div className="lg:col-span-2">
              <TimelinePartido
                eventos={eventos}
                onAgregarEvento={agregarEvento}
              />
            </div>

            {/* Columna de Cierre de Acta */}
            <div className="space-y-6">
              <PanelObservaciones
                observaciones={observaciones}
                setObservaciones={setObservaciones}
                calificacion={calificacion}
                setCalificacion={setCalificacion}
              />

              {/* Botonera Principal */}
              <BotonesResumen
                onCancelar={() => {
                  setObservaciones("");
                  setCalificacion(0);
                  setGolesLocal(0);
                  setGolesVisitante(0);
                  setEventos([]);
                }}
                onGuardar={() => setMostrarModal(true)}
              />
            </div>
          </div>

          {/* Modal del sistema */}
          <ModalResumen
            abierto={mostrarModal}
            onClose={() => setMostrarModal(false)}
            onConfirmar={() => {
              finalizarPartido(partido.id, {
                golesLocal,
                golesVisitante,
                observaciones,
                calificacion,
                eventos,
              });

              alert("Resumen guardado correctamente.");

              setMostrarModal(false);
            }}
            partido={partido}
            golesLocal={golesLocal}
            golesVisitante={golesVisitante}
            observaciones={observaciones}
            calificacion={calificacion}
            eventos={eventos}
          />
        </div>
      </section>
    </main>
  );
}
