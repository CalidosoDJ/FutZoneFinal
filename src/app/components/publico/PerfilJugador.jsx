"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  Flag,
  Goal,
  LoaderCircle,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const DEPORTES = ["Fútbol 5", "Fútbol 8", "Fútbol 11", "Fútbol sala"];

const POSICIONES = [
  "Portero",
  "Defensa",
  "Lateral",
  "Mediocampista",
  "Delantero",
  "Extremo",
  "No definida",
];

const ESTILOS = [
  "Técnico",
  "Velocidad",
  "Defensivo",
  "Ofensivo",
  "Equilibrado",
];

const PERFIL_DEPORTIVO_INICIAL = {
  deporte: "Fútbol 5",
  posicion: "No definida",
  estilo: "Equilibrado",
  objetivo: "",
};

function leerJSON(valor, respaldo = null) {
  try {
    return valor ? JSON.parse(valor) : respaldo;
  } catch {
    return respaldo;
  }
}

function obtenerId(usuario) {
  return (
    usuario?.id_usuario ??
    usuario?.id ??
    usuario?.pk ??
    usuario?.usuario_id ??
    null
  );
}

function obtenerRol(usuario) {
  if (!usuario) return null;
  const rol = usuario.id_rol;
  if (rol === null || rol === undefined || rol === "") return null;
  const idRol = Number(rol);
  return Number.isInteger(idRol) ? idRol : null;
}

function normalizarTexto(valor) {
  return String(valor ?? "").trim().toLowerCase();
}

function fechaValida(fecha) {
  if (!fecha) return null;
  const resultado = new Date(fecha);
  return Number.isNaN(resultado.getTime()) ? null : resultado;
}

function formatearFecha(fecha, opciones = {}) {
  const date = fechaValida(fecha);
  if (!date) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opciones,
  }).format(date);
}

function formatearHora(hora) {
  if (!hora) return "";
  return String(hora).slice(0, 5);
}

function estadoReserva(estado) {
  const valor = normalizarTexto(estado);
  if (valor.includes("cancel")) return "cancelada";
  if (valor.includes("complet")) return "completada";
  if (valor.includes("confirm")) return "confirmada";
  if (valor.includes("pend")) return "pendiente";
  return "otro";
}

function obtenerFechaReserva(reserva) {
  return reserva?.fecha_reserva ?? reserva?.fecha ?? null;
}

function obtenerIdCancha(reserva) {
  const cancha = reserva?.id_cancha ?? reserva?.cancha;
  if (typeof cancha === "object" && cancha !== null) {
    return cancha.id_cancha ?? cancha.id ?? cancha.pk ?? null;
  }
  return cancha ?? null;
}

function perteneceAlUsuario(reserva, usuario) {
  const idUsuario = obtenerId(usuario);
  const idReserva =
    reserva?.id_usuario?.id_usuario ??
    reserva?.id_usuario?.id ??
    reserva?.id_usuario ??
    reserva?.usuario?.id_usuario ??
    reserva?.usuario?.id ??
    reserva?.usuario_id;

  if (
    idUsuario != null &&
    idReserva != null &&
    String(idUsuario) === String(idReserva)
  ) {
    return true;
  }

  const emailUsuario = normalizarTexto(usuario?.email);
  const emailReserva = normalizarTexto(
    reserva?.email_usuario ?? reserva?.usuario_email
  );

  return Boolean(
    emailUsuario && emailReserva && emailUsuario === emailReserva
  );
}

function obtenerHeadersAutorizados(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* TARJETAS DE ESTADÍSTICAS */

function TarjetaEstadistica({
  icono: Icono,
  titulo,
  valor,
  descripcion,
  color = "green",
}) {
  const colores = {
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{titulo}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {valor}
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            {descripcion}
          </p>
        </div>

        <div
          className={`rounded-2xl p-3.5 ring-1 ${colores[color] || colores.green}`}
        >
          <Icono size={22} />
        </div>
      </div>
    </article>
  );
}

function EtiquetaEstado({ estado }) {
  const estilos = {
    confirmada: "border-emerald-200 bg-emerald-50 text-emerald-700",
    pendiente: "border-amber-200 bg-amber-50 text-amber-700",
    completada: "border-blue-200 bg-blue-50 text-blue-700",
    cancelada: "border-rose-200 bg-rose-50 text-rose-700",
    otro: "border-slate-200 bg-slate-100 text-slate-600",
  };

  const etiquetas = {
    confirmada: "Confirmada",
    pendiente: "Pendiente",
    completada: "Completada",
    cancelada: "Cancelada",
    otro: estado || "Sin estado",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
        estilos[estado] || estilos.otro
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {etiquetas[estado] || estado || "Sin estado"}
    </span>
  );
}

export default function PerfilJugador() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [accesoDenegado, setAccesoDenegado] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalDeportivo, setModalDeportivo] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
  });

  const [perfilDeportivo, setPerfilDeportivo] = useState(
    PERFIL_DEPORTIVO_INICIAL
  );

  const [fotoPerfil, setFotoPerfil] = useState("");
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const inputFotoRef = useRef(null);
  const solicitudRef = useRef(0);
  const usuarioIdRef = useRef(null);

  const idUsuario = obtenerId(usuario);
  const rolUsuario = obtenerRol(usuario);

  const mostrarMensaje = useCallback((texto, esError = false) => {
    setMensaje(esError ? "" : texto);
    setErrorGuardado(esError ? texto : "");

    window.setTimeout(() => {
      setMensaje("");
      setErrorGuardado("");
    }, 4500);
  }, []);

  const cargarDatos = useCallback(async () => {
    const numeroSolicitud = ++solicitudRef.current;
    const sigueSiendoSolicitudActual = () =>
      solicitudRef.current === numeroSolicitud;

    setCargando(true);
    setErrorCarga("");
    setAccesoDenegado(false);

    try {
      const sesionLocal = leerJSON(
        sessionStorage.getItem("usuarioLogueado"),
        null
      );

      const token = sessionStorage.getItem("tokenFutZone");

      if (!sesionLocal || !obtenerId(sesionLocal) || !token) {
        usuarioIdRef.current = null;
        setUsuario(null);
        setReservas([]);
        setFotoPerfil("");
        setArchivoFoto(null);
        setPerfilDeportivo({ ...PERFIL_DEPORTIVO_INICIAL });

        setErrorCarga(
          "No encontramos una sesión activa. Inicia sesión para ver tu perfil."
        );
        return;
      }

      const id = obtenerId(sesionLocal);

      // Sincronizamos con sessionStorage y el backend
      const actualizado = {
        ...sesionLocal,
        id_usuario: id,
        id_rol: Number(sesionLocal.id_rol || 2),
      };

      usuarioIdRef.current = id;
      setUsuario(actualizado);

      setFormulario({
        nombre_completo: actualizado.nombre_completo ?? actualizado.nombre ?? "",
        email: actualizado.email ?? "",
        telefono: actualizado.telefono ?? "",
      });

      const fotoGuardada = sessionStorage.getItem(`fotoPerfil_${id}`);
      setFotoPerfil(fotoGuardada || actualizado.foto_url || actualizado.foto || "");

      const perfilGuardado = leerJSON(
        sessionStorage.getItem(`perfilDeportivo_${id}`),
        null
      );
      setPerfilDeportivo({
        ...PERFIL_DEPORTIVO_INICIAL,
        ...(perfilGuardado || {}),
      });

      const headers = obtenerHeadersAutorizados(token);

      const respuestaReservas = await fetch(`${API_URL}/reservas/`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (sigueSiendoSolicitudActual() && respuestaReservas.ok) {
        const datos = await respuestaReservas.json();
        const lista = Array.isArray(datos)
          ? datos
          : datos?.results ?? datos?.reservas ?? [];
        setReservas(
          lista.filter((reserva) => perteneceAlUsuario(reserva, actualizado))
        );
      }
    } catch (error) {
      console.error("Error cargando el perfil:", error);
      if (sigueSiendoSolicitudActual()) {
        setErrorCarga(
          "No fue posible cargar la información. Comprueba que Django esté funcionando."
        );
      }
    } finally {
      if (sigueSiendoSolicitudActual()) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const nombreJugador =
    usuario?.nombre_completo ??
    usuario?.nombre ??
    usuario?.username ??
    "Jugador FutZone";

  const correoJugador = usuario?.email ?? "";
  const telefonoJugador = usuario?.telefono ?? "";

  const reservasActivas = useMemo(
    () =>
      reservas.filter((reserva) =>
        ["confirmada", "pendiente"].includes(estadoReserva(reserva.estado))
      ),
    [reservas]
  );

  const reservasCompletadas = useMemo(
    () =>
      reservas.filter(
        (reserva) => estadoReserva(reserva.estado) === "completada"
      ),
    [reservas]
  );

  const canchasVisitadas = useMemo(() => {
    const ids = new Set();
    reservasCompletadas.forEach((reserva) => {
      const id = obtenerIdCancha(reserva);
      if (id != null) ids.add(String(id));
    });
    return ids.size;
  }, [reservasCompletadas]);

  const proximaReserva = useMemo(() => {
    const ahora = new Date();
    return (
      reservas
        .filter((reserva) => {
          const estado = estadoReserva(reserva.estado);
          const fecha = fechaValida(obtenerFechaReserva(reserva));
          if (!fecha || fecha < ahora) return false;
          return estado === "confirmada" || estado === "pendiente";
        })
        .sort((a, b) => {
          const fechaA = fechaValida(obtenerFechaReserva(a)) || new Date(0);
          const fechaB = fechaValida(obtenerFechaReserva(b)) || new Date(0);
          if (fechaA.getTime() !== fechaB.getTime()) return fechaA - fechaB;
          return String(a.hora_inicio || "").localeCompare(
            String(b.hora_inicio || "")
          );
        })[0] || null
    );
  }, [reservas]);

  const guardarPerfil = async (evento) => {
    evento.preventDefault();
    const idActual = obtenerId(usuario);

    if (!idActual) {
      mostrarMensaje("No pudimos identificar tu usuario.", true);
      return;
    }

    if (!formulario.nombre_completo.trim() || !formulario.email.trim()) {
      mostrarMensaje("El nombre y el correo son obligatorios.", true);
      return;
    }

    setGuardandoPerfil(true);

    try {
      const token = sessionStorage.getItem("tokenFutZone");
      const respuesta = await fetch(`${API_URL}/usuarios/${idActual}/`, {
        method: "PATCH",
        headers: obtenerHeadersAutorizados(token),
        body: JSON.stringify({
          nombre_completo: formulario.nombre_completo.trim(),
          email: formulario.email.trim(),
          telefono: formulario.telefono.trim(),
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el perfil en el servidor.");
      }

      const datosActualizados = await respuesta.json().catch(() => ({}));
      const actualizado = {
        ...usuario,
        ...datosActualizados,
        nombre_completo: formulario.nombre_completo.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim(),
      };

      sessionStorage.setItem("usuarioLogueado", JSON.stringify(actualizado));
      setUsuario(actualizado);
      setModalPerfil(false);
      mostrarMensaje("¡Perfil actualizado correctamente!");
    } catch (error) {
      console.error(error);
      mostrarMensaje("No pudimos guardar los cambios.", true);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const seleccionarFoto = (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      mostrarMensaje("Selecciona un archivo de imagen válido.", true);
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      const resultado = String(lector.result || "");
      sessionStorage.setItem(`fotoPerfil_${obtenerId(usuario)}`, resultado);
      setFotoPerfil(resultado);
      mostrarMensaje("Foto de perfil actualizada.");
    };
    lector.readAsDataURL(archivo);
  };

  const guardarPerfilDeportivo = (evento) => {
    evento.preventDefault();
    const idActual = obtenerId(usuario);
    if (!idActual) return;

    sessionStorage.setItem(
      `perfilDeportivo_${idActual}`,
      JSON.stringify(perfilDeportivo)
    );
    setModalDeportivo(false);
    mostrarMensaje("Preferencias deportivas guardadas con éxito.");
  };

  if (cargando) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 text-slate-800">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200">
            <LoaderCircle className="animate-spin text-emerald-600" size={30} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Preparando tu perfil</h2>
          <p className="text-sm text-slate-500">Cargando tu información deportiva...</p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 text-slate-800">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <UserRound size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-900">Tu perfil te espera</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {errorCarga || "Inicia sesión para consultar tu información."}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
          >
            Iniciar sesión <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* MENSAJES DE ALERTA O ÉXITO */}
        {(mensaje || errorGuardado) && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-3 animate-in fade-in ${
              errorGuardado
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <Sparkles size={18} className="shrink-0" />
            <span>{mensaje || errorGuardado}</span>
          </div>
        )}

        {/* ENCABEZADO DEL PERFIL */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-3xl font-black overflow-hidden border-4 border-white shadow-md">
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{nombreJugador.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-md hover:bg-emerald-600 transition cursor-pointer"
                title="Cambiar foto"
              >
                <Camera size={16} />
              </button>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                onChange={seleccionarFoto}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <ShieldCheck size={14} /> Jugador Verificado FutZone
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{nombreJugador}</h1>
              <p className="text-sm text-slate-500">{correoJugador || "Sin correo registrado"} {telefonoJugador ? `• ${telefonoJugador}` : ""}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setModalPerfil(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Edit3 size={15} /> Editar Perfil
            </button>
            <button
              type="button"
              onClick={() => setModalDeportivo(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-5 py-3 rounded-2xl border border-emerald-200 transition flex items-center gap-2 cursor-pointer"
            >
              <Target size={15} /> Preferencias Deportivas
            </button>
          </div>
        </section>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TarjetaEstadistica
            icono={CalendarDays}
            titulo="Reservas Activas"
            valor={reservasActivas.length}
            descripcion="Partidos programados próximamente"
            color="green"
          />
          <TarjetaEstadistica
            icono={Trophy}
            titulo="Partidos Jugados"
            valor={reservasCompletadas.length}
            descripcion="Encuentros completados con éxito"
            color="blue"
          />
          <TarjetaEstadistica
            icono={MapPin}
            titulo="Canchas Visitadas"
            valor={canchasVisitadas}
            descripcion="Diferentes sedes recorridas"
            color="amber"
          />
          <TarjetaEstadistica
            icono={Zap}
            titulo="Nivel de Actividad"
            valor={reservas.length > 5 ? "Alto" : "Activo"}
            descripcion="Basado en tus reservas recientes"
            color="purple"
          />
        </div>

        {/* PRÓXIMA RESERVA & PREFERENCIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Próximo partido */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock3 className="text-emerald-600" size={20} /> Próximo Partido
                </h2>
                {proximaReserva && <EtiquetaEstado estado={estadoReserva(proximaReserva.estado)} />}
              </div>

              {proximaReserva ? (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-xl">
                      ⚽ Cancha Reservada
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      📅 {formatearFecha(obtenerFechaReserva(proximaReserva))} • ⏰ {formatearHora(proximaReserva.hora_inicio)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-800">
                    Prepárate para saltar a la cancha y darlo todo en el terreno de juego.
                  </p>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-medium text-slate-500">No tienes partidos programados próximamente.</p>
                  <Link
                    href="/"
                    className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    Reservar una cancha
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Perfil deportivo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Target className="text-emerald-600" size={20} /> Perfil Deportivo
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium">Deporte favorito</span>
                <span className="font-bold text-slate-800">{perfilDeportivo.deporte}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium">Posición habitual</span>
                <span className="font-bold text-slate-800">{perfilDeportivo.posicion}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-medium">Estilo de juego</span>
                <span className="font-bold text-slate-800">{perfilDeportivo.estilo}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL EDITAR PERFIL */}
      {modalPerfil && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Editar Información</h3>
              <button onClick={() => setModalPerfil(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarPerfil} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  value={formulario.nombre_completo}
                  onChange={(e) => setFormulario({ ...formulario, nombre_completo: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Teléfono</label>
                <input
                  type="text"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalPerfil(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoPerfil}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm"
                >
                  {guardandoPerfil ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREFERENCIAS DEPORTIVAS */}
      {modalDeportivo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Perfil Deportivo</h3>
              <button onClick={() => setModalDeportivo(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarPerfilDeportivo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deporte Favorito</label>
                <select
                  value={perfilDeportivo.deporte}
                  onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, deporte: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                >
                  {DEPORTES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Posición Habitual</label>
                <select
                  value={perfilDeportivo.posicion}
                  onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, posicion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                >
                  {POSICIONES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Estilo de Juego</label>
                <select
                  value={perfilDeportivo.estilo}
                  onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, estilo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition"
                >
                  {ESTILOS.map((es) => (
                    <option key={es} value={es}>{es}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalDeportivo(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm"
                >
                  Guardar Preferencias
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}