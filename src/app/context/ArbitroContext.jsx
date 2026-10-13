"use client";

import { createContext, useContext, useState } from "react";

const ArbitroContext = createContext();

export function ArbitroProvider({ children }) {
  // 1. Estado del Árbitro: Lee directamente la sesión limpia guardada por el Login
  const [arbitro, setArbitro] = useState(() => {
    const datosBase = {
      nombre: "Árbitro FutZone",
      correo: "arbitro@futzone.com",
      telefono: "320 456 7890",
      ciudad: "Popayán",
      categoria: "Árbitro Nacional",
      partidosDirigidos: 125,
      calificacion: 4.9,
      ingreso: "15 Enero 2025",
      foto: "https://i.pravatar.cc/300?img=15",
      disponible: true,
    };

    if (typeof window !== "undefined") {
      try {
        const sesion = localStorage.getItem("usuarioSesion");
        if (sesion) {
          const user = JSON.parse(sesion);
          return {
            ...datosBase,
            nombre: user.nombre || datosBase.nombre,
            correo: user.correo || user.email || datosBase.correo,
          };
        }
      } catch (error) {
        console.error("Error al leer usuarioSesion del localStorage:", error);
      }
    }

    return datosBase;
  });

  // 2. Estado de Partidos
  const [partidos, setPartidos] = useState([
    {
      id: 25,
      local: "Atlético FC",
      visitante: "Juventus",
      cancha: "FutZone Norte",
      fecha: "15/10/2026",
      hora: "6:00 PM",
      categoria: "Sub-20",
      estado: "Pendiente",
    },
    {
      id: 26,
      local: "Millonarios",
      visitante: "Nacional",
      cancha: "FutZone Centro",
      fecha: "16/10/2026",
      hora: "8:00 PM",
      categoria: "Libre",
      estado: "En Curso",
    },
  ]);

  // 3. Notificaciones y Partido Seleccionado
  const [notificaciones, setNotificaciones] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  // --- FUNCIONES DE NEGOCIO (ACCIONES) ---

  // Alternar disponibilidad del árbitro
  const toggleDisponibilidad = () => {
    setArbitro((prev) => ({
      ...prev,
      disponible: !prev.disponible,
    }));
  };

  // Cambiar estado del partido (ej: Pendiente -> En Curso)
  const cambiarEstadoPartido = (id, nuevoEstado) => {
    setPartidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  // Finalizar Partido (Registra el acta y suma +1 a partidos dirigidos)
  function finalizarPartido(id, resumen) {
    const partidoTarget = partidos.find((p) => p.id === id);

    setPartidos((partidosAnteriores) =>
      partidosAnteriores.map((partido) =>
        partido.id === id
          ? { ...partido, estado: "Finalizado", resumen }
          : partido
      )
    );

    // Incrementar automáticamente partidos dirigidos del árbitro
    setArbitro((prev) => ({
      ...prev,
      partidosDirigidos: prev.partidosDirigidos + 1,
    }));

    // Agregar Notificación con datos seguros
    const nombreLocal = partidoTarget?.local || "Equipo A";
    const nombreVisitante = partidoTarget?.visitante || "Equipo B";

    setNotificaciones((anteriores) => [
      {
        id: Date.now(),
        icono: "📋",
        titulo: "Acta registrada",
        mensaje: `El partido ${nombreLocal} vs ${nombreVisitante} fue finalizado correctamente.`,
        fecha: new Date().toLocaleString(),
        leida: false,
      },
      ...anteriores,
    ]);

    if (partidoSeleccionado?.id === id) {
      setPartidoSeleccionado(null);
    }
  }

  // Actualizar perfil
  const actualizarArbitro = (nuevosDatos) => {
    setArbitro((prev) => ({ ...prev, ...nuevosDatos }));
  };

  // Marcar notificaciones como leídas
  const marcarNotificacionLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
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
        cambiarEstadoPartido,
        partidoSeleccionado,
        setPartidoSeleccionado,
        notificaciones,
        setNotificaciones,
        marcarNotificacionLeida,
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
    throw new Error("useArbitro debe usarse dentro de un ArbitroProvider");
  }
  return context;
}