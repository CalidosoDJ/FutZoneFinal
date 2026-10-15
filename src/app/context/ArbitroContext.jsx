
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const ArbitroContext = createContext();

export function ArbitroProvider({ children }) {
  // Datos reales del árbitro autenticado
  const [arbitro, setArbitro] = useState(null);
  const [cargandoArbitro, setCargandoArbitro] = useState(true);

  // Cargar los datos de la sesión
  useEffect(() => {
    try {
      const sesion = localStorage.getItem("arbitroSesion");

      if (sesion) {
        const usuario = JSON.parse(sesion);

        setArbitro({
          ...usuario,
          nombre: usuario.nombre || "",
          correo: usuario.correo || usuario.email || "",
          telefono: usuario.celular || usuario.telefono || "",
          ciudad: usuario.ciudad || "",
          categoria: usuario.categoria || "",
          partidosDirigidos: usuario.partidosDirigidos ?? 0,
          calificacion: usuario.calificacion ?? 0,
          foto: usuario.foto || "",
          disponible: usuario.disponible ?? true,
        });
      } else {
        setArbitro(null);
      }
    } catch (error) {
      console.error("Error al cargar la sesión del árbitro:", error);
      setArbitro(null);
    } finally {
      setCargandoArbitro(false);
    }
  }, []);

  // Partidos
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

  // Notificaciones y partido seleccionado
  const [notificaciones, setNotificaciones] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  const toggleDisponibilidad = () => {
    setArbitro((prev) =>
      prev ? { ...prev, disponible: !prev.disponible } : prev
    );
  };

  const cambiarEstadoPartido = (id, nuevoEstado) => {
    setPartidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: nuevoEstado } : p
      )
    );
  };

  function finalizarPartido(id, resumen) {
    const partidoTarget = partidos.find((p) => p.id === id);

    setPartidos((prev) =>
      prev.map((partido) =>
        partido.id === id
          ? { ...partido, estado: "Finalizado", resumen }
          : partido
      )
    );

    setArbitro((prev) =>
      prev
        ? {
            ...prev,
            partidosDirigidos: (prev.partidosDirigidos ?? 0) + 1,
          }
        : prev
    );

    const nombreLocal = partidoTarget?.local || "Equipo A";
    const nombreVisitante = partidoTarget?.visitante || "Equipo B";

    setNotificaciones((prev) => [
      {
        id: Date.now(),
        icono: "📋",
        titulo: "Acta registrada",
        mensaje: `El partido ${nombreLocal} vs ${nombreVisitante} fue finalizado correctamente.`,
        fecha: new Date().toLocaleString(),
        leida: false,
      },
      ...prev,
    ]);

    if (partidoSeleccionado?.id === id) {
      setPartidoSeleccionado(null);
    }
  }

  // Actualizar perfil y mantener los datos sincronizados
  const actualizarArbitro = (nuevosDatos) => {
    setArbitro((prev) => {
      if (!prev) return prev;

      const actualizado = { ...prev, ...nuevosDatos };

      const sesion = localStorage.getItem("arbitroSesion");

      if (sesion) {
        localStorage.setItem(
          "arbitroSesion",
          JSON.stringify({ ...JSON.parse(sesion), ...actualizado })
        );
      }

      return actualizado;
    });
  };

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
        cargandoArbitro,
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
    throw new Error(
      "useArbitro debe usarse dentro de un ArbitroProvider"
    );
  }

  return context;
}
