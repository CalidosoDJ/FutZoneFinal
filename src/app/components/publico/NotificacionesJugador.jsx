
"use client";

import {
    Bell,
    Search,
    CheckCheck,
    Check,
    Clock3,
    CalendarDays,
    Gift,
    Trophy,
    MapPin,
    Info,
    RefreshCw,
    ArrowUpRight,
    Sparkles,
    CircleDot,
    Filter,
    Inbox,
    AlertCircle,
    X,
    ChevronRight,
    LoaderCircle,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const FILTROS = [
    { id: "todas", label: "Todas" },
    { id: "sinLeer", label: "Sin leer" },
    { id: "leidas", label: "Leídas" },
];

const TIPOS = [
    { id: "todos", label: "Todos los tipos" },
    { id: "reserva", label: "Reservas" },
    { id: "recordatorio", label: "Recordatorios" },
    { id: "promocion", label: "Promociones" },
    { id: "novedad", label: "Novedades" },
    { id: "partido", label: "Partidos" },
    { id: "sistema", label: "Sistema" },
];

const ESTILOS_TIPO = {
    reserva: {
        icono: CalendarDays,
        color: "text-emerald-600",
        fondo: "bg-emerald-50",
        borde: "border-emerald-100",
        etiqueta: "Reserva",
    },
    recordatorio: {
        icono: Clock3,
        color: "text-amber-600",
        fondo: "bg-amber-50",
        borde: "border-amber-100",
        etiqueta: "Recordatorio",
    },
    promocion: {
        icono: Gift,
        color: "text-fuchsia-600",
        fondo: "bg-fuchsia-50",
        borde: "border-fuchsia-100",
        etiqueta: "Promoción",
    },
    novedad: {
        icono: Sparkles,
        color: "text-sky-600",
        fondo: "bg-sky-50",
        borde: "border-sky-100",
        etiqueta: "Novedad",
    },
    partido: {
        icono: Trophy,
        color: "text-violet-600",
        fondo: "bg-violet-50",
        borde: "border-violet-100",
        etiqueta: "Partido",
    },
    sistema: {
        icono: Info,
        color: "text-slate-600",
        fondo: "bg-slate-100",
        borde: "border-slate-200",
        etiqueta: "Sistema",
    },
};

function normalizarNotificacion(item) {
    const tipoOriginal = String(item.tipo || "sistema").toLowerCase();

    const equivalencias = {
        confirmada: "reserva",
        cancelada: "reserva",
        calificacion: "partido",
        cancha: "novedad",
    };

    const tipo = equivalencias[tipoOriginal] || tipoOriginal;

    return {
        id: item.id_notificacion ?? item.id,
        titulo: item.titulo || "Notificación de FutZone",
        mensaje: item.mensaje || "",
        tipo: ESTILOS_TIPO[tipo] ? tipo : "sistema",
        leida:
            item.leido === true ||
            Number(item.leido) === 1 ||
            item.leida === true,
        fecha: item.fecha_envio || item.fecha || null,
        referencia: item.id_referencia ?? null,
    };
}

function fechaLegible(fecha) {
    if (!fecha) return "Fecha no disponible";

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return "Fecha no disponible";

    const ahora = new Date();
    const diferencia = Math.max(0, ahora.getTime() - valor.getTime());

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 1) return "Ahora mismo";
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    if (dias === 1) return "Ayer";
    if (dias < 7) return `Hace ${dias} días`;

    return valor.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: valor.getFullYear() !== ahora.getFullYear()
            ? "numeric"
            : undefined,
    });
}

function obtenerIdUsuario() {
    try {
        const datos = localStorage.getItem("usuarioLogueado");
        if (!datos) return null;

        const usuario = JSON.parse(datos);

        return (
            usuario.id_usuario ??
            usuario.usuario?.id_usuario ??
            usuario.id ??
            null
        );
    } catch {
        return null;
    }
}

async function leerRespuesta(response) {
    if (!response.ok) {
        let mensaje = `Error del servidor (${response.status})`;

        try {
            const datos = await response.json();
            mensaje = datos.detail || datos.error || datos.mensaje || mensaje;
        } catch {
            // Conserva el mensaje HTTP si la respuesta no contiene JSON.
        }

        throw new Error(mensaje);
    }

    if (response.status === 204) return null;

    return response.json();
}

export default function NotificacionesJugador() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [filtro, setFiltro] = useState("todas");
    const [tipoFiltro, setTipoFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [error, setError] = useState("");
    const [idUsuario, setIdUsuario] = useState(null);
    const [accionId, setAccionId] = useState(null);
    const [marcandoTodas, setMarcandoTodas] = useState(false);
    const [detalle, setDetalle] = useState(null);

    const cargarNotificaciones = useCallback(async (silencioso = false) => {
        const usuarioId = obtenerIdUsuario();

        setIdUsuario(usuarioId);

        if (!usuarioId) {
            setNotificaciones([]);
            setError(
                "No encontramos tu sesión. Inicia sesión nuevamente para consultar tus notificaciones."
            );
            setCargando(false);
            setActualizando(false);
            return;
        }

        if (silencioso) {
            setActualizando(true);
        } else {
            setCargando(true);
        }

        setError("");

        try {
            const response = await fetch(
                `${API_URL}/notificaciones/?id_usuario=${encodeURIComponent(usuarioId)}`,
                {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                }
            );

            const datos = await leerRespuesta(response);

            console.log("API_URL:", API_URL);
            console.log("USUARIO ID:", usuarioId);
            console.log("RESPUESTA HTTP:", response.status);
            console.log("DATOS RECIBIDOS:", datos);

            // Compatible con respuestas paginadas de Django REST Framework.
            const lista = Array.isArray(datos)
                ? datos
                : Array.isArray(datos?.results)
                    ? datos.results
                    : [];

            setNotificaciones(
                lista
                    .map(normalizarNotificacion)
                    .filter((item) => item.id !== null && item.id !== undefined)
            );
        } catch (err) {
            setError(
                err.message ||
                "No fue posible cargar las notificaciones. Revisa tu conexión."
            );
        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, []);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const total = notificaciones.length;
    const sinLeer = notificaciones.filter((item) => !item.leida).length;
    const leidas = total - sinLeer;

    const listaFiltrada = useMemo(() => {
        const termino = busqueda.trim().toLocaleLowerCase("es-CO");

        return notificaciones.filter((item) => {
            const coincideFiltro =
                filtro === "todas" ||
                (filtro === "sinLeer" && !item.leida) ||
                (filtro === "leidas" && item.leida);

            const coincideTipo =
                tipoFiltro === "todos" || item.tipo === tipoFiltro;

            const coincideBusqueda =
                !termino ||
                item.titulo.toLocaleLowerCase("es-CO").includes(termino) ||
                item.mensaje.toLocaleLowerCase("es-CO").includes(termino) ||
                ESTILOS_TIPO[item.tipo].etiqueta
                    .toLocaleLowerCase("es-CO")
                    .includes(termino);

            return coincideFiltro && coincideTipo && coincideBusqueda;
        });
    }, [notificaciones, filtro, tipoFiltro, busqueda]);

    const marcarComoLeida = async (item) => {
        if (item.leida || accionId !== null) return;

        if (!idUsuario) {
            setError("Tu sesión no está disponible. Inicia sesión nuevamente.");
            return;
        }

        setAccionId(item.id);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/notificaciones/${item.id}/leida/?id_usuario=${encodeURIComponent(idUsuario)}`,
                {
                    method: "PATCH",
                    headers: { Accept: "application/json" },
                }
            );

            await leerRespuesta(response);

            setNotificaciones((actuales) =>
                actuales.map((notificacion) =>
                    notificacion.id === item.id
                        ? { ...notificacion, leida: true }
                        : notificacion
                )
            );

            setDetalle((actual) =>
                actual?.id === item.id
                    ? { ...actual, leida: true }
                    : actual
            );
        } catch (err) {
            setError(
                err.message ||
                "No se pudo marcar la notificación como leída."
            );
        } finally {
            setAccionId(null);
        }
    };

    const marcarTodasComoLeidas = async () => {
        if (!sinLeer || marcandoTodas) return;

        if (!idUsuario) {
            setError("Tu sesión no está disponible. Inicia sesión nuevamente.");
            return;
        }

        setMarcandoTodas(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/notificaciones/marcar_todas_leidas/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ id_usuario: idUsuario }),
                }
            );

            await leerRespuesta(response);

            setNotificaciones((actuales) =>
                actuales.map((item) => ({ ...item, leida: true }))
            );

            setDetalle((actual) =>
                actual ? { ...actual, leida: true } : actual
            );
        } catch (err) {
            setError(
                err.message ||
                "No se pudieron marcar todas como leídas."
            );
        } finally {
            setMarcandoTodas(false);
        }
    };

    const abrirDetalle = (item) => {
        setDetalle(item);

        if (!item.leida) {
            marcarComoLeida(item);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f7fb] px-3 py-5 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* CABECERA PREMIUM */}
                <section className="relative isolate overflow-hidden rounded-[28px] bg-[#071b14] p-6 text-white shadow-xl shadow-emerald-950/10 sm:rounded-[34px] sm:p-9 lg:p-11">
                    <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-72 w-72 rounded-full bg-lime-400/10 blur-[90px]" />

                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                                <Sparkles size={14} />
                                Tu centro de actividad
                            </div>

                            <div className="flex items-start gap-4 sm:gap-5">
                                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] sm:h-[72px] sm:w-[72px] sm:rounded-3xl">
                                    <Bell size={30} className="text-emerald-300 sm:h-9 sm:w-9" />
                                    {sinLeer > 0 && (
                                        <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#071b14] bg-lime-400 px-1 text-xs font-black text-[#102016]">
                                            {sinLeer > 99 ? "99+" : sinLeer}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                        Notificaciones
                                    </h1>
                                    <p className="mt-2 text-sm text-yellow-300">
                                        Prueba de componente NotificacionesJugador
                                    </p>
                                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                                        Todo lo que sucede con tus reservas,
                                        partidos y novedades, en un solo lugar.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300 sm:text-sm">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Actividad de tu cuenta
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
                                    <CircleDot size={13} className="text-emerald-300" />
                                    Actualizado desde FutZone
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[390px] lg:shrink-0">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:rounded-3xl sm:p-5">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300 sm:h-10 sm:w-10">
                                    <Inbox size={19} />
                                </div>
                                <p className="text-[11px] font-semibold text-slate-400 sm:text-xs">
                                    Total
                                </p>
                                <p className="mt-1 text-2xl font-black sm:text-3xl">
                                    {total}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.10] p-3 sm:rounded-3xl sm:p-5">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/15 text-lime-300 sm:h-10 sm:w-10">
                                    <Bell size={19} />
                                </div>
                                <p className="text-[11px] font-semibold text-lime-100/70 sm:text-xs">
                                    Sin leer
                                </p>
                                <p className="mt-1 text-2xl font-black text-lime-300 sm:text-3xl">
                                    {sinLeer}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:rounded-3xl sm:p-5">
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-300/15 text-sky-300 sm:h-10 sm:w-10">
                                    <CheckCheck size={19} />
                                </div>
                                <p className="text-[11px] font-semibold text-slate-400 sm:text-xs">
                                    Leídas
                                </p>
                                <p className="mt-1 text-2xl font-black sm:text-3xl">
                                    {leidas}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MENSAJES DE ESTADO */}
                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                    >
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-bold">No pudimos completar la operación</p>
                            <p className="mt-1 leading-6">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Cerrar mensaje"
                            className="rounded-lg p-1 hover:bg-rose-100"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* BÚSQUEDA Y FILTROS */}
                <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="buscar-notificacion" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
                                Buscar actividad
                            </label>
                            <div className="relative">
                                <Search
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="buscar-notificacion"
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Busca reservas, partidos, promociones..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-sm font-medium outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                />
                                {busqueda && (
                                    <button
                                        type="button"
                                        onClick={() => setBusqueda("")}
                                        aria-label="Limpiar búsqueda"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="min-w-0 flex-1 sm:min-w-[175px]">
                                <label htmlFor="tipo-notificacion" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
                                    Categoría
                                </label>
                                <div className="relative">
                                    <Filter
                                        size={16}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <select
                                        id="tipo-notificacion"
                                        value={tipoFiltro}
                                        onChange={(e) => setTipoFiltro(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3.5 pl-10 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    >
                                        {TIPOS.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronRight
                                        size={16}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => cargarNotificaciones(true)}
                                disabled={actualizando || cargando}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={actualizando ? "animate-spin" : ""}
                                />
                                Actualizar
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap gap-2">
                            {FILTROS.map((opcion) => {
                                const activo = filtro === opcion.id;
                                const cantidad =
                                    opcion.id === "todas"
                                        ? total
                                        : opcion.id === "sinLeer"
                                            ? sinLeer
                                            : leidas;

                                return (
                                    <button
                                        key={opcion.id}
                                        type="button"
                                        onClick={() => setFiltro(opcion.id)}
                                        aria-pressed={activo}
                                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activo
                                            ? "bg-[#10271d] text-white shadow-md shadow-emerald-950/10"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                                            }`}
                                    >
                                        {opcion.label}
                                        <span
                                            className={`rounded-lg px-2 py-0.5 text-xs ${activo
                                                ? "bg-white/15 text-white"
                                                : "bg-white text-slate-500"
                                                }`}
                                        >
                                            {cantidad}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={marcarTodasComoLeidas}
                            disabled={sinLeer === 0 || marcandoTodas || cargando}
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                            {marcandoTodas ? (
                                <LoaderCircle size={17} className="animate-spin" />
                            ) : (
                                <CheckCheck size={17} />
                            )}
                            Marcar todas como leídas
                        </button>
                    </div>
                </section>

                {/* LISTADO */}
                <section>
                    <div className="mb-4 flex items-center justify-between gap-3 px-1">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-slate-800 sm:text-xl">
                                Tu actividad
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {cargando
                                    ? "Consultando notificaciones..."
                                    : `${listaFiltrada.length} ${listaFiltrada.length === 1
                                        ? "notificación encontrada"
                                        : "notificaciones encontradas"
                                    }`}
                            </p>
                        </div>
                        <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 sm:inline-flex">
                            <MapPin size={14} className="text-emerald-600" />
                            FutZone
                        </span>
                    </div>

                    {cargando ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6"
                                >
                                    <div className="flex gap-4">
                                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />
                                        <div className="flex-1 space-y-3 pt-1">
                                            <div className="h-4 w-2/5 rounded bg-slate-200" />
                                            <div className="h-3 w-full max-w-xl rounded bg-slate-100" />
                                            <div className="h-3 w-1/4 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : listaFiltrada.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-14 text-center sm:py-20">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-emerald-50 text-emerald-600">
                                <Inbox size={36} strokeWidth={1.6} />
                            </div>
                            <h3 className="mt-5 text-xl font-black text-slate-800">
                                {error
                                    ? "No se pudo cargar la actividad"
                                    : busqueda || tipoFiltro !== "todos" || filtro !== "todas"
                                        ? "No encontramos resultados"
                                        : "Tu bandeja está tranquila"}
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {error
                                    ? "Comprueba que Django esté funcionando y que la API de notificaciones esté configurada."
                                    : busqueda || tipoFiltro !== "todos" || filtro !== "todas"
                                        ? "Prueba otra búsqueda o cambia los filtros para ver más notificaciones."
                                        : "Cuando haya novedades sobre tus reservas, partidos o promociones, aparecerán aquí."}
                            </p>
                            {error ? (
                                <button
                                    type="button"
                                    onClick={() => cargarNotificaciones()}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10271d] px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                                >
                                    <RefreshCw size={16} />
                                    Intentar de nuevo
                                </button>
                            ) : (busqueda || tipoFiltro !== "todos" || filtro !== "todas") ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBusqueda("");
                                        setTipoFiltro("todos");
                                        setFiltro("todas");
                                    }}
                                    className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                >
                                    Limpiar filtros
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {listaFiltrada.map((item) => {
                                const estilo =
                                    ESTILOS_TIPO[item.tipo] || ESTILOS_TIPO.sistema;
                                const Icono = estilo.icono;
                                const procesando = accionId === item.id;

                                return (
                                    <article
                                        key={item.id}
                                        className={`group relative overflow-hidden rounded-[23px] border bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 sm:rounded-[26px] ${item.leida
                                            ? "border-slate-200/80"
                                            : "border-emerald-200 shadow-sm shadow-emerald-950/[0.03]"
                                            }`}
                                    >
                                        {!item.leida && (
                                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-emerald-500" />
                                        )}

                                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                                            <div className="relative shrink-0">
                                                <div
                                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${estilo.fondo} ${estilo.borde} ${estilo.color} transition group-hover:scale-105 sm:h-[62px] sm:w-[62px] sm:rounded-[20px]`}
                                                >
                                                    <Icono size={26} strokeWidth={1.9} />
                                                </div>
                                                {!item.leida && (
                                                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-500" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.09em] ${estilo.fondo} ${estilo.color}`}>
                                                        {estilo.etiqueta}
                                                    </span>

                                                    {!item.leida && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Nueva
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`mt-3 text-base leading-snug sm:text-lg ${item.leida ? "font-bold text-slate-700" : "font-extrabold text-slate-900"}`}>
                                                    {item.titulo}
                                                </h3>

                                                <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-500">
                                                    {item.mensaje}
                                                </p>

                                                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock3 size={14} />
                                                        {fechaLegible(item.fecha)}
                                                    </span>
                                                    {item.referencia !== null && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CircleDot size={13} />
                                                            Referencia #{item.referencia}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                                                <button
                                                    type="button"
                                                    onClick={() => abrirDetalle(item)}
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:flex-none sm:px-4 sm:text-sm"
                                                >
                                                    Ver detalle
                                                    <ArrowUpRight size={15} />
                                                </button>

                                                {!item.leida ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => marcarComoLeida(item)}
                                                        disabled={procesando || marcandoTodas}
                                                        aria-label="Marcar como leída"
                                                        title="Marcar como leída"
                                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10271d] text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                                                    >
                                                        {procesando ? (
                                                            <LoaderCircle size={17} className="animate-spin" />
                                                        ) : (
                                                            <Check size={18} />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span
                                                        title="Ya leída"
                                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"
                                                    >
                                                        <CheckCheck size={18} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* PIE */}
                <footer className="flex flex-col items-center justify-between gap-3 px-2 pb-4 text-center sm:flex-row sm:text-left">
                    <p className="text-xs font-medium text-slate-400">
                        FutZone · Tu pasión, tu cancha, tu juego.
                    </p>
                    <button
                        type="button"
                        onClick={() => cargarNotificaciones(true)}
                        disabled={actualizando || cargando}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-700 disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={actualizando ? "animate-spin" : ""} />
                        Sincronizar notificaciones
                    </button>
                </footer>
            </div>

            {/* MODAL DE DETALLE */}
            {detalle && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() => setDetalle(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="detalle-notificacion-titulo"
                        className="my-auto w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative overflow-hidden bg-[#071b14] p-6 text-white sm:p-8">
                            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

                            <div className="relative flex items-start justify-between gap-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 ${ESTILOS_TIPO[detalle.tipo].fondo} ${ESTILOS_TIPO[detalle.tipo].color}`}>
                                    {(() => {
                                        const Icono = ESTILOS_TIPO[detalle.tipo].icono;
                                        return <Icono size={27} />;
                                    })()}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setDetalle(null)}
                                    aria-label="Cerrar detalle"
                                    className="rounded-xl border border-white/10 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                                {ESTILOS_TIPO[detalle.tipo].etiqueta}
                            </p>

                            <h2
                                id="detalle-notificacion-titulo"
                                className="relative mt-2 text-2xl font-black leading-tight"
                            >
                                {detalle.titulo}
                            </h2>

                            <p className="relative mt-3 text-sm text-slate-300">
                                {fechaLegible(detalle.fecha)}
                            </p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                {detalle.mensaje}
                            </p>

                            {detalle.referencia !== null && (
                                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                        <CalendarDays size={19} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400">
                                            Número de referencia
                                        </p>
                                        <p className="mt-1 font-bold text-slate-800">
                                            #{detalle.referencia}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                {!detalle.leida && (
                                    <button
                                        type="button"
                                        onClick={() => marcarComoLeida(detalle)}
                                        disabled={accionId !== null}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {accionId === detalle.id ? (
                                            <LoaderCircle size={17} className="animate-spin" />
                                        ) : (
                                            <Check size={17} />
                                        )}
                                        Marcar como leída
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setDetalle(null)}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
