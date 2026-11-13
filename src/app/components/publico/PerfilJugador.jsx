"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  Flag,
  Goal,
  LoaderCircle,
  MapPin,
  Medal,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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

function normalizarTexto(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
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

function obtenerNombreCancha(reserva) {
  const cancha = reserva?.id_cancha ?? reserva?.cancha;

  if (typeof cancha === "object" && cancha !== null) {
    return cancha.nombre ?? cancha.nombre_cancha ?? "Cancha reservada";
  }

  return reserva?.nombre_cancha ?? reserva?.cancha_nombre ?? "Cancha reservada";
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
    reserva?.email_usuario ?? reserva?.usuario_email,
  );

  return Boolean(emailUsuario && emailReserva && emailUsuario === emailReserva);
}

function iniciales(nombre) {
  const palabras = String(nombre || "Jugador")
    .trim()
    .split(/\s+/);
  return palabras
    .slice(0, 2)
    .map((palabra) => palabra[0] || "")
    .join("")
    .toUpperCase();
}

function TarjetaEstadistica({
  icono: Icono,
  titulo,
  valor,
  descripcion,
  color = "green",
}) {
  const colores = {
    green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    blue: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    purple: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111914] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#152019]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {valor}
          </p>
          <p className="mt-2 text-xs leading-5 text-gray-500">{descripcion}</p>
        </div>

        <div
          className={`rounded-xl p-3 ring-1 ${colores[color] || colores.green}`}
        >
          <Icono size={21} />
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-12 -right-8 h-28 w-28 rounded-full bg-emerald-400/[0.04] blur-2xl transition group-hover:bg-emerald-400/[0.10]" />
    </article>
  );
}

function EtiquetaEstado({ estado }) {
  const estilos = {
    confirmada: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    pendiente: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    completada: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    cancelada: "border-red-400/20 bg-red-400/10 text-red-300",
    otro: "border-emerald-100/10 bg-white/5 text-gray-300",
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
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
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalDeportivo, setModalDeportivo] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
  });

  const [perfilDeportivo, setPerfilDeportivo] = useState({
    deporte: "Fútbol 5",
    posicion: "Delantero",
    estilo: "Equilibrado",
    objetivo: "",
    pierna: "Derecha",
    horario: "06:00 PM",
    cancha: "Fútbol 6",
    zona: "Norte",
    nivel: "Intermedio",
    modalidad: "Amistoso",
    frecuencia: "2 veces/semana",
  });

  const [fotoPerfil, setFotoPerfil] = useState("");
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [guardandoFoto, setGuardandoFoto] = useState(false);
  const inputFotoRef = useRef(null);

  const idUsuario = obtenerId(usuario);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");

    try {
      const sesion = leerJSON(
        typeof window !== "undefined"
          ? localStorage.getItem("usuarioLogueado")
          : null,
        null,
      );

      if (!sesion) {
        setErrorCarga(
          "No encontramos una sesión activa. Inicia sesión para ver tu perfil.",
        );
        setUsuario(null);
        setReservas([]);
        return;
      }

      setUsuario(sesion);

      const id = obtenerId(sesion);

      setFormulario({
        nombre_completo: sesion.nombre_completo ?? sesion.nombre ?? "",
        email: sesion.email ?? "",
        telefono: sesion.telefono ?? "",
      });

      if (id != null) {
        const fotoGuardada = localStorage.getItem(`fotoPerfil_${id}`);
        setFotoPerfil(fotoGuardada || sesion.foto_url || sesion.foto || "");

        const perfilGuardado = leerJSON(
          localStorage.getItem(`perfilDeportivo_${id}`),
          null,
        );

        if (perfilGuardado) {
          setPerfilDeportivo((anterior) => ({
            ...anterior,
            ...perfilGuardado,
          }));
        }

        const solicitudes = await Promise.allSettled([
          fetch(`${API_URL}/usuarios/${id}/`),
          fetch(`${API_URL}/reservas/`),
        ]);

        const respuestaUsuario = solicitudes[0];
        const respuestaReservas = solicitudes[1];

        if (
          respuestaUsuario.status === "fulfilled" &&
          respuestaUsuario.value.ok
        ) {
          const datosUsuario = await respuestaUsuario.value.json();

          setUsuario((anterior) => {
            const actualizado = {
              ...(anterior || sesion),
              ...datosUsuario,
            };

            localStorage.setItem(
              "usuarioLogueado",
              JSON.stringify(actualizado),
            );

            return actualizado;
          });

          setFormulario({
            nombre_completo:
              datosUsuario.nombre_completo ??
              sesion.nombre_completo ??
              sesion.nombre ??
              "",
            email: datosUsuario.email ?? sesion.email ?? "",
            telefono: datosUsuario.telefono ?? sesion.telefono ?? "",
          });

          if (datosUsuario.foto_url || datosUsuario.foto) {
            setFotoPerfil(datosUsuario.foto_url || datosUsuario.foto);
          }
        }

        if (
          respuestaReservas.status === "fulfilled" &&
          respuestaReservas.value.ok
        ) {
          const datos = await respuestaReservas.value.json();
          const lista = Array.isArray(datos)
            ? datos
            : (datos?.results ?? datos?.reservas ?? []);

          setReservas(
            lista.filter((reserva) => perteneceAlUsuario(reserva, sesion)),
          );
        } else {
          setReservas([]);
        }
      } else {
        setReservas([]);
      }
    } catch (error) {
      console.error("Error cargando el perfil:", error);
      setErrorCarga(
        "No fue posible cargar toda la información. Comprueba que Django esté funcionando.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const iniciarCarga = async () => {
      await cargarDatos();
    };

    void iniciarCarga();
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
        ["confirmada", "pendiente"].includes(estadoReserva(reserva.estado)),
      ),
    [reservas],
  );

  const reservasCompletadas = useMemo(
    () =>
      reservas.filter(
        (reserva) => estadoReserva(reserva.estado) === "completada",
      ),
    [reservas],
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

          if (fechaA.getTime() !== fechaB.getTime()) {
            return fechaA - fechaB;
          }

          return String(a.hora_inicio || "").localeCompare(
            String(b.hora_inicio || ""),
          );
        })[0] || null
    );
  }, [reservas]);

  const fechaRegistro =
    usuario?.fecha_registro ??
    usuario?.fecha_creacion ??
    usuario?.created_at ??
    null;

  const anioRegistro = fechaValida(fechaRegistro)?.getFullYear() ?? null;

  const porcentajeContacto = useMemo(() => {
    const campos = [
      Boolean(nombreJugador && nombreJugador !== "Jugador FutZone"),
      Boolean(correoJugador),
      Boolean(telefonoJugador),
      Boolean(fotoPerfil),
    ];

    return Math.round((campos.filter(Boolean).length / campos.length) * 100);
  }, [nombreJugador, correoJugador, telefonoJugador, fotoPerfil]);

  const mostrarMensaje = (texto, esError = false) => {
    setMensaje(esError ? "" : texto);
    setErrorGuardado(esError ? texto : "");
    window.setTimeout(() => {
      setMensaje("");
      setErrorGuardado("");
    }, 4500);
  };

  const guardarPerfil = async (evento) => {
    evento.preventDefault();

    if (!idUsuario) {
      mostrarMensaje("No pudimos identificar tu usuario.", true);
      return;
    }

    if (!formulario.nombre_completo.trim() || !formulario.email.trim()) {
      mostrarMensaje("El nombre y el correo son obligatorios.", true);
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/${idUsuario}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_completo: formulario.nombre_completo.trim(),
          email: formulario.email.trim(),
          telefono: formulario.telefono.trim(),
        }),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        console.error("Respuesta de Django:", detalle);

        throw new Error(
          respuesta.status === 404
            ? "No encontramos el usuario en Django."
            : respuesta.status === 400
              ? "Revisa los datos ingresados; el servidor los rechazó."
              : "No se pudo actualizar el perfil.",
        );
      }

      let datosActualizados = {};
      try {
        datosActualizados = await respuesta.json();
      } catch {
        // Algunos endpoints PATCH pueden responder sin contenido.
      }

      const actualizado = {
        ...usuario,
        ...datosActualizados,
        nombre_completo:
          datosActualizados.nombre_completo ??
          formulario.nombre_completo.trim(),
        email: datosActualizados.email ?? formulario.email.trim(),
        telefono: datosActualizados.telefono ?? formulario.telefono.trim(),
      };

      setUsuario(actualizado);
      localStorage.setItem("usuarioLogueado", JSON.stringify(actualizado));

      setFormulario({
        nombre_completo: actualizado.nombre_completo,
        email: actualizado.email,
        telefono: actualizado.telefono,
      });

      setModalPerfil(false);
      mostrarMensaje("Tu perfil se actualizó correctamente.");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      mostrarMensaje(error.message || "No pudimos guardar los cambios.", true);
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarFoto = (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      mostrarMensaje("Selecciona un archivo de imagen válido.", true);
      evento.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarMensaje("La imagen no puede superar los 5 MB.", true);
      evento.target.value = "";
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      setArchivoFoto(String(lector.result || ""));
    };

    lector.onerror = () => {
      mostrarMensaje("No pudimos leer la imagen.", true);
    };

    lector.readAsDataURL(archivo);
    evento.target.value = "";
  };

  const guardarFotoLocal = async () => {
    if (!archivoFoto || !idUsuario) {
      mostrarMensaje("Selecciona una imagen primero.", true);
      return;
    }

    setGuardandoFoto(true);

    try {
      // Se conserva la lógica local del proyecto.
      // Para sincronizar la foto entre dispositivos se necesita
      // un endpoint Django de carga de archivos.
      localStorage.setItem(`fotoPerfil_${idUsuario}`, archivoFoto);
      setFotoPerfil(archivoFoto);
      setArchivoFoto(null);
      mostrarMensaje("Foto actualizada en este navegador.");
    } catch (error) {
      console.error(error);
      mostrarMensaje(
        "No pudimos guardar la foto. Prueba con una imagen más pequeña.",
        true,
      );
    } finally {
      setGuardandoFoto(false);
    }
  };

  const guardarPerfilDeportivo = (evento) => {
    evento.preventDefault();

    if (!idUsuario) {
      mostrarMensaje("No pudimos identificar tu usuario.", true);
      return;
    }

    try {
      localStorage.setItem(
        `perfilDeportivo_${idUsuario}`,
        JSON.stringify(perfilDeportivo),
      );

      setModalDeportivo(false);
      mostrarMensaje("Preferencias deportivas guardadas en este navegador.");
    } catch (error) {
      console.error(error);
      mostrarMensaje("No pudimos guardar tus preferencias.", true);
    }
  };

  if (cargando) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#101a14] px-4 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <LoaderCircle className="animate-spin text-emerald-300" size={30} />
          </div>
          <h2 className="mt-5 text-lg font-bold">Preparando tu perfil</h2>
          <p className="mt-2 text-sm text-gray-500">
            Estamos organizando tu información deportiva...
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#080d0a] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-emerald-100/10 bg-[#1b2920] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <UserRound size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-black">Tu perfil te espera</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            {errorCarga || "Inicia sesión para consultar tu información."}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-black transition hover:bg-emerald-400"
          >
            Iniciar sesión <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d0a] pb-16 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="absolute -right-40 top-[30rem] h-96 w-96 rounded-full bg-lime-400/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Encabezado */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              <Activity size={15} />
              FutZone / Mi perfil
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Tu espacio, <span className="text-emerald-300">tu juego.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              Administra tus datos, revisa tus reservas y mantén tu perfil
              deportivo al día.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarDatos}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-100/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
          >
            <Activity size={16} />
            Actualizar datos
          </button>
        </div>

        {errorCarga && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4 text-sm text-amber-100">
            <Bell size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Información parcialmente disponible</p>
              <p className="mt-1 text-amber-100/70">{errorCarga}</p>
            </div>
          </div>
        )}

        {/* Hero del jugador */}
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-emerald-300/15 bg-gradient-to-br from-[#263c2c] via-[#1b2b20] to-[#18251c]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.13),transparent_48%)]" />
          <div className="absolute -right-16 -top-20 opacity-[0.06]">
            <Trophy size={330} strokeWidth={0.8} />
          </div>

          <div className="relative grid gap-7 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative mx-auto shrink-0 sm:mx-0">
                <div className="h-28 w-28 overflow-hidden rounded-[30px] border-2 border-emerald-300/40 bg-[#1a2a1f] p-1 shadow-[0_0_45px_rgba(74,222,128,0.12)] sm:h-36 sm:w-36">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[25px] bg-gradient-to-br from-emerald-300/20 to-transparent">
                    {fotoPerfil || archivoFoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={archivoFoto || fotoPerfil}
                        alt={`Foto de ${nombreJugador}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-black text-emerald-200">
                        {iniciales(nombreJugador)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Cambiar foto de perfil"
                  onClick={() => inputFotoRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-[#121b15] bg-emerald-400 text-[#07100a] transition hover:scale-105"
                >
                  <Camera size={19} />
                </button>

                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={seleccionarFoto}
                />
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                    <ShieldCheck size={14} />
                    Jugador FutZone
                  </span>
                  {anioRegistro && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                      <CalendarDays size={13} />
                      Desde {anioRegistro}
                    </span>
                  )}
                </div>

                <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {nombreJugador}
                </h2>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400 sm:justify-start">
                  {correoJugador && (
                    <span className="break-all">{correoJugador}</span>
                  )}
                  {telefonoJugador && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {telefonoJugador}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      setFormulario({
                        nombre_completo: nombreJugador,
                        email: correoJugador,
                        telefono: telefonoJugador,
                      });
                      setModalPerfil(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-[#08100a] transition hover:bg-emerald-300"
                  >
                    <Edit3 size={16} />
                    Editar perfil
                  </button>

                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <Camera size={16} />
                    Cambiar foto
                  </button>
                </div>

                {archivoFoto && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="text-xs text-emerald-200">
                      Nueva imagen seleccionada
                    </span>
                    <button
                      type="button"
                      onClick={guardarFotoLocal}
                      disabled={guardandoFoto}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-black disabled:opacity-60"
                    >
                      {guardandoFoto ? (
                        <LoaderCircle size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Guardar foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setArchivoFoto(null)}
                      className="rounded-lg border border-emerald-100/10 px-3 py-2 text-xs text-gray-300"
                    >
                      Descartar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5 lg:min-w-[230px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gray-300">
                  Perfil completado
                </span>
                <Sparkles size={17} className="text-emerald-300" />
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black">
                  {porcentajeContacto}%
                </span>
                <span className="pb-1 text-xs text-gray-500">de tus datos</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-700"
                  style={{ width: `${porcentajeContacto}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Completa tus datos y añade una foto para personalizar tu
                experiencia.
              </p>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/canchas"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#111914] p-4 transition hover:border-emerald-400/30 hover:bg-[#152019]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Target size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">Reservar cancha</p>
              <p className="mt-1 text-xs text-gray-500">
                Encuentra dónde jugar
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
            />
          </Link>

          <Link
            href="/mis-reservas"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#111914] p-4 transition hover:border-emerald-400/30 hover:bg-[#152019]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <CalendarDays size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">Mis reservas</p>
              <p className="mt-1 text-xs text-gray-500">
                Consulta tus partidos
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
            />
          </Link>

          <button
            type="button"
            onClick={() => setModalDeportivo(true)}
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#111914] p-4 text-left transition hover:border-emerald-400/30 hover:bg-[#152019]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Trophy size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">Perfil deportivo</p>
              <p className="mt-1 text-xs text-gray-500">Personaliza tu juego</p>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
            />
          </button>
        </section>

        {/* Estadísticas reales */}
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Tu actividad
              </p>
              <h2 className="mt-2 text-2xl font-black">Tu juego en números</h2>
            </div>
            <span className="text-xs text-gray-500">
              Según los datos de tus reservas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaEstadistica
              icono={CalendarDays}
              titulo="Reservas activas"
              valor={reservasActivas.length}
              descripcion="Pendientes o confirmadas"
              color="green"
            />
            <TarjetaEstadistica
              icono={CheckCircle2}
              titulo="Reservas completadas"
              valor={reservasCompletadas.length}
              descripcion="Partidos registrados como completados"
              color="blue"
            />
            <TarjetaEstadistica
              icono={MapPin}
              titulo="Canchas visitadas"
              valor={canchasVisitadas}
              descripcion="Canchas distintas con reservas completadas"
              color="purple"
            />
            <TarjetaEstadistica
              icono={Award}
              titulo="Miembro desde"
              valor={anioRegistro ?? "—"}
              descripcion={
                anioRegistro
                  ? `Registrado en ${anioRegistro}`
                  : "Fecha de registro no disponible"
              }
              color="amber"
            />
          </div>
        </section>

        {/* Próxima reserva y datos deportivos */}
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111914]">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Próximo encuentro
                </p>
                <h2 className="mt-2 text-xl font-black">Tu próxima reserva</h2>
              </div>
              <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                <Flag size={22} />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {proximaReserva ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-[#1b3021] to-[#101812] p-5 sm:p-6">
                    <div className="absolute -right-8 -top-8 text-emerald-300/[0.06]">
                      <Goal size={150} />
                    </div>

                    <div className="relative">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">
                          <Zap size={14} />
                          Partido programado
                        </span>
                        <EtiquetaEstado
                          estado={estadoReserva(proximaReserva.estado)}
                        />
                      </div>

                      <h3 className="mt-5 text-2xl font-black sm:text-3xl">
                        {obtenerNombreCancha(proximaReserva)}
                      </h3>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-black/20 p-3 text-emerald-200">
                            <CalendarDays size={19} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Fecha</p>
                            <p className="mt-1 text-sm font-bold">
                              {formatearFecha(
                                obtenerFechaReserva(proximaReserva),
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-black/20 p-3 text-emerald-200">
                            <Clock3 size={19} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Horario</p>
                            <p className="mt-1 text-sm font-bold">
                              {formatearHora(proximaReserva.hora_inicio) ||
                                "Por confirmar"}
                              {proximaReserva.hora_fin
                                ? ` – ${formatearHora(proximaReserva.hora_fin)}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/mis-reservas"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100/10 px-4 py-3 text-sm font-bold transition hover:border-emerald-400/30 hover:bg-white/[0.04]"
                  >
                    Ver detalle de mis reservas
                    <ChevronRight size={17} />
                  </Link>
                </>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.07] text-emerald-300">
                    <CalendarDays size={29} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">
                    ¡Es hora de volver a la cancha!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    No encontramos una reserva futura activa. Explora las
                    canchas disponibles y organiza tu próximo partido.
                  </p>
                  <Link
                    href="/canchas"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-300"
                  >
                    Buscar una cancha <ArrowRight size={17} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Perfil deportivo */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#111914]">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Tu identidad deportiva
                </p>
                <h2 className="mt-2 text-xl font-black">Mi estilo de juego</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalDeportivo(true)}
                aria-label="Editar perfil deportivo"
                className="rounded-xl border border-emerald-100/10 p-2.5 text-gray-300 transition hover:border-emerald-300/30 hover:text-emerald-300"
              >
                <Pencil size={17} />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Modalidad favorita</p>
                    <p className="mt-1 font-bold">{perfilDeportivo.deporte}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-400/10 p-3 text-sky-300">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posición habitual</p>
                    <p className="mt-1 font-bold">{perfilDeportivo.posicion}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-400/10 p-3 text-amber-300">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estilo de juego</p>
                    <p className="mt-1 font-bold">{perfilDeportivo.estilo}</p>
                  </div>
                </div>
              </div>

              {perfilDeportivo.objetivo && (
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Mi objetivo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    {perfilDeportivo.objetivo}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Pierna dominante", perfilDeportivo.pierna],
                  ["Horario favorito", perfilDeportivo.horario],
                  ["Tipo de cancha", perfilDeportivo.cancha],
                  ["Zona favorita", perfilDeportivo.zona],
                  ["Nivel deportivo", perfilDeportivo.nivel],
                  ["Modalidad de juego", perfilDeportivo.modalidad],
                  ["Frecuencia de juego", perfilDeportivo.frecuencia],
                ].map(([titulo, valor]) => (
                  <div
                    key={titulo}
                    className="rounded-2xl border border-white/[0.08] bg-[#111914] p-4"
                  >
                    <p className="text-xs font-medium text-gray-500">
                      {titulo}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-300">
                      {valor || "Sin definir"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setModalDeportivo(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/[0.06] px-4 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/10"
              >
                Personalizar perfil deportivo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Historial reciente */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111914]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Tu recorrido
              </p>
              <h2 className="mt-2 text-xl font-black">Actividad reciente</h2>
            </div>

            <Link
              href="/mis-reservas"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300 transition hover:text-emerald-200"
            >
              Ver todas <ArrowUpRight size={16} />
            </Link>
          </div>

          {reservas.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {[...reservas]
                .sort((a, b) => {
                  const fechaA =
                    fechaValida(obtenerFechaReserva(a))?.getTime() || 0;
                  const fechaB =
                    fechaValida(obtenerFechaReserva(b))?.getTime() || 0;
                  return fechaB - fechaA;
                })
                .slice(0, 5)
                .map((reserva, indice) => {
                  const estado = estadoReserva(reserva.estado);

                  return (
                    <div
                      key={
                        reserva.id_reserva ??
                        reserva.id ??
                        `${obtenerFechaReserva(reserva)}-${indice}`
                      }
                      className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-white/[0.02] sm:px-6"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-emerald-300">
                        {estado === "completada" ? (
                          <CheckCircle2 size={21} />
                        ) : estado === "cancelada" ? (
                          <X size={21} />
                        ) : (
                          <CalendarDays size={21} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">
                          {obtenerNombreCancha(reserva)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatearFecha(obtenerFechaReserva(reserva))}
                          {reserva.hora_inicio
                            ? ` · ${formatearHora(reserva.hora_inicio)}`
                            : ""}
                        </p>
                      </div>

                      <EtiquetaEstado estado={estado} />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-gray-400">
                <Activity size={25} />
              </div>
              <h3 className="mt-4 font-bold">Tu historial empieza aquí</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Cuando tengas reservas registradas para tu usuario, aparecerán
                en esta sección.
              </p>
              <Link
                href="/canchas"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-300"
              >
                Explorar canchas <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </section>

        {/* Nota de privacidad y datos */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-300" />
          <p className="text-xs leading-5 text-gray-500">
            Tus estadísticas se calculan a partir de las reservas que devuelve
            la API. Las preferencias deportivas y la foto de perfil de esta
            versión se guardan en este navegador; todavía no se sincronizan
            automáticamente con tu cuenta en Django.
          </p>
        </div>
      </div>

      {/* Notificación */}
      {(mensaje || errorGuardado) && (
        <div
          role="status"
          className={`fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-2xl border p-4 shadow-2xl sm:left-auto sm:right-6 ${
            errorGuardado
              ? "border-red-400/20 bg-[#241311] text-red-100"
              : "border-emerald-400/20 bg-[#102117] text-emerald-100"
          }`}
        >
          {errorGuardado ? (
            <X size={20} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          )}
          <p className="flex-1 text-sm font-semibold">
            {errorGuardado || mensaje}
          </p>
          <button
            type="button"
            onClick={() => {
              setMensaje("");
              setErrorGuardado("");
            }}
            aria-label="Cerrar notificación"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Modal: editar perfil */}
      {modalPerfil && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) setModalPerfil(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-perfil"
            className="my-auto w-full max-w-lg rounded-3xl border border-emerald-100/10 bg-[#111914] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Mi cuenta
                </p>
                <h2
                  id="titulo-editar-perfil"
                  className="mt-2 text-2xl font-black"
                >
                  Editar información
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Actualiza tus datos personales.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalPerfil(false)}
                aria-label="Cerrar modal"
                className="rounded-xl border border-emerald-100/10 p-2 text-gray-400 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarPerfil} className="space-y-5">
              <div>
                <label
                  htmlFor="nombre_completo"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre_completo"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={150}
                  value={formulario.nombre_completo}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombre_completo: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label
                  htmlFor="email_perfil"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Correo electrónico
                </label>
                <input
                  id="email_perfil"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={100}
                  value={formulario.email}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono_perfil"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Teléfono
                </label>
                <input
                  id="telefono_perfil"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={formulario.telefono}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/10"
                  placeholder="Tu número de contacto"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalPerfil(false)}
                  className="flex-1 rounded-xl border border-emerald-100/10 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardando ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal: perfil deportivo */}
      {modalDeportivo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setModalDeportivo(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-perfil-deportivo"
            className="my-auto w-full max-w-lg rounded-3xl border border-emerald-100/10 bg-[#111914] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Personalización
                </p>
                <h2
                  id="titulo-perfil-deportivo"
                  className="mt-2 text-2xl font-black"
                >
                  Tu perfil deportivo
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Cuéntanos cómo te gusta jugar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalDeportivo(false)}
                aria-label="Cerrar modal"
                className="rounded-xl border border-emerald-100/10 p-2 text-gray-400 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarPerfilDeportivo} className="space-y-5">
              <div>
                <label
                  htmlFor="deporte_favorito"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Modalidad favorita
                </label>
                <select
                  id="deporte_favorito"
                  value={perfilDeportivo.deporte}
                  onChange={(e) =>
                    setPerfilDeportivo({
                      ...perfilDeportivo,
                      deporte: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-[#0b100d] px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                >
                  {DEPORTES.map((deporte) => (
                    <option key={deporte} value={deporte}>
                      {deporte}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="posicion_favorita"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Posición habitual
                </label>
                <select
                  id="posicion_favorita"
                  value={perfilDeportivo.posicion}
                  onChange={(e) =>
                    setPerfilDeportivo({
                      ...perfilDeportivo,
                      posicion: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-[#0b100d] px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                >
                  {POSICIONES.map((posicion) => (
                    <option key={posicion} value={posicion}>
                      {posicion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="estilo_juego"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Estilo de juego
                </label>
                <select
                  id="estilo_juego"
                  value={perfilDeportivo.estilo}
                  onChange={(e) =>
                    setPerfilDeportivo({
                      ...perfilDeportivo,
                      estilo: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-emerald-100/10 bg-[#0b100d] px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                >
                  {ESTILOS.map((estilo) => (
                    <option key={estilo} value={estilo}>
                      {estilo}
                    </option>
                  ))}
                </select>
              </div>
              {[
                {
                  campo: "pierna",
                  titulo: "Pierna dominante",
                  opciones: ["Derecha", "Izquierda", "Ambas"],
                },
                {
                  campo: "horario",
                  titulo: "Horario favorito",
                  opciones: [
                    "08:00 AM",
                    "10:00 AM",
                    "02:00 PM",
                    "04:00 PM",
                    "06:00 PM",
                    "08:00 PM",
                  ],
                },
                {
                  campo: "cancha",
                  titulo: "Tipo de cancha",
                  opciones: ["Fútbol 5", "Fútbol 6", "Fútbol 7", "Fútbol 8"],
                },
                {
                  campo: "zona",
                  titulo: "Zona favorita",
                  opciones: ["Norte", "Centro", "Sur", "Occidente", "Oriente"],
                },
                {
                  campo: "nivel",
                  titulo: "Nivel deportivo",
                  opciones: [
                    "Principiante",
                    "Intermedio",
                    "Avanzado",
                    "Profesional",
                  ],
                },
                {
                  campo: "modalidad",
                  titulo: "Modalidad de juego",
                  opciones: ["Amistoso", "Torneo", "Entrenamiento"],
                },
                {
                  campo: "frecuencia",
                  titulo: "Frecuencia de juego",
                  opciones: [
                    "1 vez/semana",
                    "2 veces/semana",
                    "3 veces/semana",
                    "Todos los días",
                  ],
                },
              ].map(({ campo, titulo, opciones }) => (
                <div key={campo}>
                  <label
                    htmlFor={`deportivo_${campo}`}
                    className="mb-2 block text-sm font-semibold text-gray-300"
                  >
                    {titulo}
                  </label>

                  <select
                    id={`deportivo_${campo}`}
                    value={perfilDeportivo[campo]}
                    onChange={(e) =>
                      setPerfilDeportivo({
                        ...perfilDeportivo,
                        [campo]: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-emerald-100/10 bg-[#0b100d] px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                  >
                    {opciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label
                  htmlFor="objetivo_deportivo"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Mi objetivo deportivo{" "}
                  <span className="font-normal text-gray-500">(opcional)</span>
                </label>
                <textarea
                  id="objetivo_deportivo"
                  rows={3}
                  maxLength={300}
                  value={perfilDeportivo.objetivo}
                  onChange={(e) =>
                    setPerfilDeportivo({
                      ...perfilDeportivo,
                      objetivo: e.target.value,
                    })
                  }
                  placeholder="Ej. mejorar mi resistencia y jugar cada semana..."
                  className="w-full resize-none rounded-xl border border-emerald-100/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-emerald-300/50"
                />
                <p className="mt-1 text-right text-xs text-gray-600">
                  {perfilDeportivo.objetivo.length}/300
                </p>
              </div>

              <div className="rounded-xl border border-amber-300/10 bg-amber-300/[0.04] p-3 text-xs leading-5 text-gray-400">
                En esta versión, estas preferencias se guardan en este
                navegador. Más adelante podemos almacenarlas en Django para que
                estén disponibles en todos tus dispositivos.
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalDeportivo(false)}
                  className="flex-1 rounded-xl border border-emerald-100/10 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-black transition hover:bg-emerald-300"
                >
                  <Check size={17} />
                  Guardar preferencias
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
