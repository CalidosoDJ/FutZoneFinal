"use client";

import {
    Bell,
    Search,
    CheckCheck,
    Clock3,
    CalendarDays,
    Gift,
    Trophy,
    MapPin,
    Info,
    RefreshCw,
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
    const tipo = ESTILOS_TIPO[tipoOriginal] ? tipoOriginal : "sistema";

    return {
        id: item.id_notificacion ?? item.id,
        titulo: item.titulo || "Notificación de FutZone",
        mensaje: item.mensaje || "",
        tipo: tipo,
        leida: item.leido === true || Number(item.leido) === 1 || item.leida === true,
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
    });
}

function obtenerIdUsuario() {
    try {
        const datos = sessionStorage.getItem("usuarioLogueado");
        if (!datos) return null;
        const usuario = JSON.parse(datos);
        return usuario.id_usuario ?? usuario.usuario?.id_usuario ?? usuario.id ?? null;
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
        } catch {}
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
            setError("No encontramos tu sesión. Inicia sesión nuevamente.");
            setCargando(false);
            setActualizando(false);
            return;
        }

        if (silencioso) setActualizando(true);
        else setCargando(true);

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
            const lista = Array.isArray(datos) ? datos : Array.isArray(datos?.results) ? datos.results : [];

            setNotificaciones(
                lista.map(normalizarNotificacion).filter((item) => item.id !== null && item.id !== undefined)
            );
        } catch (err) {
            setError(err.message || "No fue posible cargar las notificaciones.");
        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, []);

    // Cargar al iniciar y configurar polling en tiempo real cada 6 segundos
    useEffect(() => {
        cargarNotificaciones();
        const intervalo = setInterval(() => {
            cargarNotificaciones(true);
        }, 6000);
        return () => clearInterval(intervalo);
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

            const coincideTipo = tipoFiltro === "todos" || item.tipo === tipoFiltro;

            const coincideBusqueda =
                !termino ||
                item.titulo.toLocaleLowerCase("es-CO").includes(termino) ||
                item.mensaje.toLocaleLowerCase("es-CO").includes(termino);

            return coincideFiltro && coincideTipo && coincideBusqueda;
        });
    }, [notificaciones, filtro, tipoFiltro, busqueda]);

    const marcarComoLeida = async (item) => {
        if (item.leida || accionId !== null) return;
        if (!idUsuario) return;

        setAccionId(item.id);
        try {
            const response = await fetch(
                `${API_URL}/notificaciones/${item.id}/leida/`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ id_usuario: idUsuario })
                }
            );
            await leerRespuesta(response);

            setNotificaciones((actuales) =>
                actuales.map((n) => (n.id === item.id ? { ...n, leida: true } : n))
            );
            if (detalle?.id === item.id) setDetalle((d) => ({ ...d, leida: true }));
        } catch (err) {
            console.error("Error al marcar como leída:", err);
        } finally {
            setAccionId(null);
        }
    };

    const marcarTodasComoLeidas = async () => {
        if (!sinLeer || marcandoTodas || !idUsuario) return;

        setMarcandoTodas(true);
        try {
            const response = await fetch(`${API_URL}/notificaciones/marcar_todas_leidas/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ id_usuario: idUsuario }),
            });
            await leerRespuesta(response);

            setNotificaciones((actuales) => actuales.map((item) => ({ ...item, leida: true })));
            if (detalle) setDetalle((d) => ({ ...d, leida: true }));
        } catch (err) {
            setError(err.message || "No se pudieron marcar todas como leídas.");
        } finally {
            setMarcandoTodas(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f7fb] px-3 py-5 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* CABECERA */}
                <section className="relative isolate overflow-hidden rounded-[28px] bg-[#071b14] p-6 text-white shadow-xl shadow-emerald-950/10 sm:rounded-[34px] sm:p-9 lg:p-11">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                                <Sparkles size={14} />
                                Centro de Alertas FutZone
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
                                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                                        Entérate en tiempo real de tus reservas, recordatorios de partidos y promociones exclusivas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[390px] lg:shrink-0">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:rounded-3xl sm:p-5">
                                <p className="text-[11px] font-semibold text-slate-400">Total</p>
                                <p className="mt-1 text-2xl font-black sm:text-3xl">{total}</p>
                            </div>
                            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.10] p-3 sm:rounded-3xl sm:p-5">
                                <p className="text-[11px] font-semibold text-lime-300">Sin leer</p>
                                <p className="mt-1 text-2xl font-black text-lime-300">{sinLeer}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:rounded-3xl sm:p-5">
                                <p className="text-[11px] font-semibold text-slate-400">Leídas</p>
                                <p className="mt-1 text-2xl font-black sm:text-3xl">{leidas}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MENSAJES DE ERROR */}
                {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xs">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-bold">Aviso del sistema</p>
                            <p className="mt-1">{error}</p>
                        </div>
                        <button onClick={() => setError("")} className="rounded-lg p-1 hover:bg-rose-100 cursor-pointer">
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* FILTROS Y BUSCADOR */}
                <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar en tus notificaciones..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-sm font-medium outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                />
                                {busqueda && (
                                    <button onClick={() => setBusqueda("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg cursor-pointer">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="min-w-0 flex-1 sm:min-w-[180px]">
                                <select
                                    value={tipoFiltro}
                                    onChange={(e) => setTipoFiltro(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3.5 pl-4 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                    {TIPOS.map((t) => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => cargarNotificaciones(true)}
                                disabled={actualizando || cargando}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw size={17} className={actualizando ? "animate-spin" : ""} />
                                Actualizar
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap gap-2">
                            {FILTROS.map((opcion) => {
                                const activo = filtro === opcion.id;
                                const cantidad = opcion.id === "todas" ? total : opcion.id === "sinLeer" ? sinLeer : leidas;
                                return (
                                    <button
                                        key={opcion.id}
                                        onClick={() => setFiltro(opcion.id)}
                                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                            activo ? "bg-[#10271d] text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                        }`}
                                    >
                                        {opcion.label}
                                        <span className={`rounded-lg px-2 py-0.5 text-xs ${activo ? "bg-white/15 text-white" : "bg-white text-slate-500"}`}>
                                            {cantidad}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={marcarTodasComoLeidas}
                            disabled={sinLeer === 0 || marcandoTodas}
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 cursor-pointer disabled:opacity-40"
                        >
                            {marcandoTodas ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCheck size={17} />}
                            Marcar todas como leídas
                        </button>
                    </div>
                </section>

                {/* LISTADO DE NOTIFICACIONES */}
                <section>
                    {cargando ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse rounded-2xl bg-white p-6 border border-slate-200 h-24" />
                            ))}
                        </div>
                    ) : listaFiltrada.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                            <Inbox size={40} className="mx-auto text-slate-300 mb-3" />
                            <h3 className="text-lg font-black text-slate-700">Sin notificaciones nuevas</h3>
                            <p className="text-xs text-slate-400 mt-1">Te avisaremos cuando haya novedades en tus reservas o partidos.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {listaFiltrada.map((item) => {
                                const estilo = ESTILOS_TIPO[item.tipo] || ESTILOS_TIPO.sistema;
                                const IconoComponente = estilo.icono;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setDetalle(item);
                                            if (!item.leida) marcarComoLeida(item);
                                        }}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                                            item.leida
                                                ? "bg-white border-slate-200/80 opacity-85 hover:opacity-100"
                                                : "bg-emerald-50/40 border-emerald-200/80 ring-1 ring-emerald-500/20"
                                        }`}
                                    >
                                        <div className={`p-3 rounded-2xl ${estilo.fondo} ${estilo.color} ${estilo.borde} shrink-0`}>
                                            <IconoComponente size={20} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${estilo.fondo} ${estilo.color} ${estilo.borde}`}>
                                                        {estilo.etiqueta}
                                                    </span>
                                                    {!item.leida && (
                                                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">{fechaLegible(item.fecha)}</span>
                                            </div>

                                            <h3 className={`text-sm font-bold ${item.leida ? "text-slate-800" : "text-slate-900 font-black"}`}>
                                                {item.titulo}
                                            </h3>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                                {item.mensaje}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* MODAL DE DETALLE DE NOTIFICACIÓN */}
                {detalle && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    {ESTILOS_TIPO[detalle.tipo]?.etiqueta || "Alerta"}
                                </span>
                                <button
                                    onClick={() => setDetalle(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{detalle.titulo}</h3>
                                <p className="text-xs text-slate-500 mb-4">{fechaLegible(detalle.fecha)}</p>
                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {detalle.mensaje}
                                </p>
                            </div>

                            <button
                                onClick={() => setDetalle(null)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs cursor-pointer transition"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}