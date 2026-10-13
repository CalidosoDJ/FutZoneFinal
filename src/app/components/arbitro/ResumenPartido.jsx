"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarArbitro from "./SidebarArbitro";
import TimelinePartido from "./TimelinePartido";
import ModalResumen from "./ModalResumen";
import MarcadorPartido from "./MarcadorPartido";
import HeaderResumen from "./HeaderResumen";
import PanelObservaciones from "./PanelObservaciones";
import BotonesResumen from "./BotonesResumen";
import { useArbitro } from "@/app/context/ArbitroContext";

export default function ResumenPartido() {
  const router = useRouter();
  const { partidoSeleccionado, finalizarPartido } = useArbitro();

  // Estados locales para la gestión del acta
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar datos previos si el partido ya tenía resumen registrado
  useEffect(() => {
    if (partidoSeleccionado?.resumen) {
      setGolesLocal(partidoSeleccionado.resumen.golesLocal || 0);
      setGolesVisitante(partidoSeleccionado.resumen.golesVisitante || 0);
      setObservaciones(partidoSeleccionado.resumen.observaciones || "");
      setCalificacion(partidoSeleccionado.resumen.calificacion || 5);
      setEventos(partidoSeleccionado.resumen.eventos || []);
    }
  }, [partidoSeleccionado]);

  function agregarEvento(eventoNuevo) {
    setEventos((eventosAnteriores) => [...eventosAnteriores, eventoNuevo]);
  }

  // Si no hay partido seleccionado, mostramos un fallback amigable o invitamos a seleccionar uno
  if (!partidoSeleccionado) {
    return (
      <main className="bg-gray-100 min-h-screen flex">
        <SidebarArbitro />
        <section className="flex-1 ml-72 p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No hay partido seleccionado
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Por favor, selecciona un partido desde el Dashboard o la sección de Mis Partidos para registrar el acta.
            </p>
            <button
              onClick={() => router.push("/arbitro/dashboard")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Ir al Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  const { id, local, visitante, cancha, fecha, hora, categoria } = partidoSeleccionado;

  const handleConfirmarFinalizacion = () => {
    finalizarPartido(id, {
      golesLocal,
      golesVisitante,
      observaciones,
      calificacion,
      eventos,
    });

    setMostrarModal(false);
    router.push("/arbitro/dashboard");
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <SidebarArbitro />

      <section className="ml-72 min-h-screen px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderResumen />

          {/* Marcador e Información Principal */}
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

          {/* Grid de 2 Columnas */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Columna Izquierda: Cronología de Eventos */}
            <div className="lg:col-span-2">
              <TimelinePartido
                eventos={eventos}
                onAgregarEvento={agregarEvento}
              />
            </div>

            {/* Columna Derecha: Observaciones y Acciones */}
            <div className="space-y-6">
              <PanelObservaciones
                observaciones={observaciones}
                setObservaciones={setObservaciones}
                calificacion={calificacion}
                setCalificacion={setCalificacion}
              />

              <BotonesResumen
                onCancelar={() => router.push("/arbitro/dashboard")}
                onGuardar={() => setMostrarModal(true)}
              />
            </div>
          </div>

          {/* Modal de Confirmación */}
          <ModalResumen
            abierto={mostrarModal}
            onClose={() => setMostrarModal(false)}
            onConfirmar={handleConfirmarFinalizacion}
            partido={partidoSeleccionado}
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