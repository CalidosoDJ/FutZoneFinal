
"use client";

import { createContext, useContext, useState } from "react";

const ArbitroContext = createContext(null);

export function ArbitroProvider({ children }) {
  const [arbitro, setArbitro] = useState({
    nombre: "Carlos Pérez",
    correo: "carlos.perez@futzone.com",
    telefono: "320 456 7890",
    ciudad: "Popayán",
    categoria: "Árbitro Nacional",
    partidosDirigidos: 125,
    calificacion: 4.9,
    ingreso: "15 Enero 2025",
    foto: "https://i.pravatar.cc/300?img=15",
    disponible: true,
  });

  const [partidos, setPartidos] = useState([
    {
      id: 25,
      local: "Atlético FC",
      visitante: "Juventus",
      cancha: "FutZone Norte",
      fecha: "15/07/2026",
      hora: "6:00 PM",
      categoria: "Sub-20",
      estado: "Pendiente",
    },
    {
      id: 26,
      local: "Millonarios",
      visitante: "Nacional",
      cancha: "FutZone Centro",
      fecha: "16/07/2026",
      hora: "8:00 PM",
      categoria: "Libre",
      estado: "En Curso",
    },
  ]);

  const [notificaciones, setNotificaciones] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  // Cambiar disponibilidad del árbitro
  const toggleDisponibilidad = () => {
    setArbitro((anterior) => ({
      ...anterior,
      disponible: !anterior.disponible,
    }));
  };

  function finalizarPartido(id, resumen) {
    const partido = partidos.find((p) => p.id === id);

    setPartidos((anteriores) =>
      anteriores.map((p) =>
        p.id === id
          ? { ...p, estado: "Finalizado", resumen }
          : p
      )
    );

    setNotificaciones((anteriores) => [
      {
        id: Date.now(),
        icono: "📋",
        titulo: "Acta registrada",
        mensaje: `El partido ${partido?.local} vs ${partido?.visitante} fue finalizado correctamente.`,
        fecha: new Date().toLocaleString(),
        leida: false,
      },
      ...anteriores,
    ]);

    setPartidoSeleccionado(null);
  }

  const actualizarArbitro = (nuevosDatos) => {
    setArbitro((anterior) => ({
      ...anterior,
      ...nuevosDatos,
    }));
  };

  return (
    <ArbitroContext.Provider
      value={{
        arbitro,
        setArbitro,
        actualizarArbitro,
        toggleDisponibilidad,
        partidos,
        setPartidos,
        partidoSeleccionado,
        setPartidoSeleccionado,
        notificaciones,
        setNotificaciones,
        finalizarPartido,
      }}
    >
      {children}
    </ArbitroContext.Provider>
  );
}

export function useArbitro() {
  const context = useContext(ArbitroContext);

  if (!context) {
    throw new Error(
      "useArbitro debe utilizarse dentro de ArbitroProvider"
    );
  }

  return context;
}
