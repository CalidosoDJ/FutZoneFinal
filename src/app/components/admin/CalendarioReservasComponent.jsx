"use client";

import { useEffect, useState, useCallback } from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaCalendarDay,
    FaCalendarWeek,
    FaClock,
    FaTimes,
    FaSyncAlt,
} from "react-icons/fa";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";

// Franjas horarias de 07:00 a 22:00 (cubre hasta las 23:00)
const HORAS_DIA = Array.from({ length: 16 }, (_, i) => i + 7);
const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatearFechaISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function obtenerLunesDeSemana(fechaISO) {
    const [y, m, d] = fechaISO.split("-").map(Number);
    const fecha = new Date(y, m - 1, d);
    const dia = fecha.getDay(); // 0 = Dom, 1 = Lun ...
    const diff = dia === 0 ? -6 : 1 - dia;
    fecha.setDate(fecha.getDate() + diff);
    return fecha;
}

function horaAMinutos(horaStr) {
    if (!horaStr) return 0;
    const [h, m] = String(horaStr).slice(0, 5).split(":").map(Number);
    return h * 60 + (m || 0);
}

export default function CalendarioReservasComponent() {
    const [vista, setVista] = useState("dia"); // "dia" | "semana"
    const [fechaBase, setFechaBase] = useState(() => formatearFechaISO(new Date()));
    const [canchaFiltro, setCanchaFiltro] = useState("todas");
    const [reservas, setReservas] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [reservaDetalle, setReservaDetalle] = useState(null);

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        try {
            const [resRes, resCan] = await Promise.all([
                fetch(API_RESERVAS),
                fetch(API_CANCHAS),
            ]);

            const datosRes = resRes.ok ? await resRes.json() : [];
            const datosCan = resCan.ok ? await resCan.json() : [];

            setReservas(Array.isArray(datosRes) ? datosRes : datosRes.results || []);
            setCanchas(Array.isArray(datosCan) ? datosCan : datosCan.results || []);
        } catch (error) {
            console.error("Error cargando calendario:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Navegar fechas
    const moverFecha = (dias) => {
        const [y, m, d] = fechaBase.split("-").map(Number);
        const nueva = new Date(y, m - 1, d);
        nueva.setDate(nueva.getDate() + dias);
        setFechaBase(formatearFechaISO(nueva));
    };

    // Días de la semana actual (Lunes a Domingo)
    const diasSemanaActual = (() => {
        const lunes = obtenerLunesDeSemana(fechaBase);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(lunes);
            d.setDate(lunes.getDate() + i);
            return {
                iso: formatearFechaISO(d),
                etiqueta: DIAS_SEMANA[i],
                numero: d.getDate(),
                mes: d.toLocaleDateString("es-CO", { month: "short" }),
            };
        });
    })();

    // Filtrar reservas activas (excluye canceladas/anuladas)
    const reservasActivas = reservas.filter((r) => {
        const est = String(r.estado || "").toLowerCase();
        return !["cancelada", "cancelado", "anulada", "rechazada"].includes(est);
    });

    // Buscar si una cancha tiene reserva en una fecha y hora específica (ej: 18 -> 18:00 a 19:00)
    const buscarReservaEnBloque = (idCancha, fechaISO, horaEntera) => {
        const inicioBloque = horaEntera * 60;
        const finBloque = (horaEntera + 1) * 60;

        return reservasActivas.find((r) => {
            const canchaIdReserva =
                typeof r.id_cancha === "object"
                    ? r.id_cancha?.id_cancha ?? r.id_cancha?.id
                    : r.id_cancha;

            if (Number(canchaIdReserva) !== Number(idCancha)) return false;
            if (r.fecha_reserva !== fechaISO) return false;

            const rInicio = horaAMinutos(r.hora_inicio);
            const rFin = horaAMinutos(r.hora_fin);
            return rInicio < finBloque && rFin > inicioBloque;
        });
    };

    // En vista semana cuando está "todas", devuelve todas las reservas de ese día y hora
    const buscarReservasSemanaBloque = (fechaISO, horaEntera) => {
        const inicioBloque = horaEntera * 60;
        const finBloque = (horaEntera + 1) * 60;

        return reservasActivas.filter((r) => {
            if (r.fecha_reserva !== fechaISO) return false;

            if (canchaFiltro !== "todas") {
                const canchaIdReserva =
                    typeof r.id_cancha === "object"
                        ? r.id_cancha?.id_cancha ?? r.id_cancha?.id
                        : r.id_cancha;
                if (Number(canchaIdReserva) !== Number(canchaFiltro)) return false;
            }

            const rInicio = horaAMinutos(r.hora_inicio);
            const rFin = horaAMinutos(r.hora_fin);
            return rInicio < finBloque && rFin > inicioBloque;
        });
    };

    const estiloEstado = (estado) => {
        const est = String(estado || "").toLowerCase();
        if (est === "confirmada" || est === "pagado") {
            return {
                bloque: "bg-green-100 border-green-500 text-green-900 hover:bg-green-200",
                badge: "bg-green-600 text-white",
                texto: "Confirmada",
            };
        }
        return {
            bloque: "bg-yellow-100 border-yellow-500 text-yellow-900 hover:bg-yellow-200",
            badge: "bg-yellow-500 text-white",
            texto: "Pendiente",
        };
    };

    const canchasVisibles =
        canchaFiltro === "todas"
            ? canchas
            : canchas.filter(
                (c) => Number(c.id_cancha ?? c.id) === Number(canchaFiltro)
            );

    return (
        <div className="space-y-6 text-gray-800">
            {/* Encabezado */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Calendario de Disponibilidad
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Visualiza los horarios bloqueados y libres por día o por semana.
                    </p>
                </div>

                {/* Selector Vista Día / Semana */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow border">
                    <button
                        onClick={() => setVista("dia")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition cursor-pointer ${vista === "dia"
                                ? "bg-green-600 text-white shadow-xs"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <FaCalendarDay /> Por Día
                    </button>

                    <button
                        onClick={() => setVista("semana")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition cursor-pointer ${vista === "semana"
                                ? "bg-green-600 text-white shadow-xs"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <FaCalendarWeek /> Por Semana
                    </button>
                </div>
            </div>

            {/* Barra de controles y leyenda */}
            <div className="bg-white p-4 rounded-2xl shadow flex flex-wrap items-center justify-between gap-4">
                {/* Navegación de fecha */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => moverFecha(vista === "dia" ? -1 : -7)}
                        className="p-2.5 rounded-xl border hover:bg-gray-100 cursor-pointer"
                        title="Anterior"
                    >
                        <FaChevronLeft />
                    </button>

                    <input
                        type="date"
                        value={fechaBase}
                        onChange={(e) => setFechaBase(e.target.value)}
                        className="border rounded-xl px-3 py-2 text-sm font-semibold text-gray-700"
                    />

                    <button
                        onClick={() => moverFecha(vista === "dia" ? 1 : 7)}
                        className="p-2.5 rounded-xl border hover:bg-gray-100 cursor-pointer"
                        title="Siguiente"
                    >
                        <FaChevronRight />
                    </button>

                    <button
                        onClick={() => setFechaBase(formatearFechaISO(new Date()))}
                        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
                    >
                        Hoy
                    </button>
                </div>

                {/* Filtro por cancha */}
                <div className="flex items-center gap-3">
                    <select
                        value={canchaFiltro}
                        onChange={(e) => setCanchaFiltro(e.target.value)}
                        className="border rounded-xl px-3 py-2 text-sm font-medium text-gray-700"
                    >
                        <option value="todas">Todas las canchas</option>
                        {canchas.map((c) => {
                            const id = c.id_cancha ?? c.id;
                            return (
                                <option key={id} value={id}>
                                    {c.nombre || c.nombre_cancha}
                                </option>
                            );
                        })}
                    </select>

                    <button
                        onClick={cargarDatos}
                        className="p-2.5 rounded-xl border hover:bg-green-50 text-green-600 cursor-pointer"
                        title="Actualizar calendario"
                    >
                        <FaSyncAlt />
                    </button>
                </div>

                {/* Leyenda de estados */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded bg-yellow-400 inline-block"></span>
                        Pendiente (Bloqueada)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded bg-green-500 inline-block"></span>
                        Confirmada (Bloqueada)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-gray-300 bg-white inline-block"></span>
                        Disponible
                    </span>
                </div>
            </div>

            {/* Tabla de Calendario */}
            <div className="bg-white rounded-2xl shadow overflow-x-auto">
                {cargando ? (
                    <p className="py-12 text-center text-gray-500">
                        Cargando horarios del calendario...
                    </p>
                ) : vista === "dia" ? (
                    /* ================= VISTA POR DÍA ================= */
                    <table className="w-full min-w-[700px] border-collapse text-sm">
                        <thead>
                            <tr className="bg-green-600 text-white">
                                <th className="p-3 w-28 border-r border-green-500 text-center">
                                    <FaClock className="inline mr-1" /> Hora
                                </th>
                                {canchasVisibles.map((c) => (
                                    <th
                                        key={c.id_cancha ?? c.id}
                                        className="p-3 border-r border-green-500 text-center font-bold"
                                    >
                                        {c.nombre || c.nombre_cancha}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {HORAS_DIA.map((hora) => {
                                const etiquetaHora = `${String(hora).padStart(2, "0")}:00 - ${String(
                                    hora + 1
                                ).padStart(2, "0")}:00`;

                                return (
                                    <tr key={hora} className="border-b hover:bg-gray-50/60">
                                        <td className="p-3 font-bold text-gray-600 text-center border-r bg-gray-50">
                                            {etiquetaHora}
                                        </td>

                                        {canchasVisibles.map((c) => {
                                            const idCancha = c.id_cancha ?? c.id;
                                            const reserva = buscarReservaEnBloque(
                                                idCancha,
                                                fechaBase,
                                                hora
                                            );

                                            if (!reserva) {
                                                return (
                                                    <td
                                                        key={idCancha}
                                                        className="p-2 border-r text-center text-xs text-gray-400"
                                                    >
                                                        Libre
                                                    </td>
                                                );
                                            }

                                            const estilo = estiloEstado(reserva.estado);

                                            return (
                                                <td key={idCancha} className="p-1.5 border-r">
                                                    <button
                                                        onClick={() => setReservaDetalle(reserva)}
                                                        className={`w-full text-left p-2.5 rounded-xl border-l-4 transition cursor-pointer ${estilo.bloque}`}
                                                    >
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="font-bold text-xs truncate">
                                                                {reserva.nombre_usuario || "Cliente"}
                                                            </span>
                                                            <span
                                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${estilo.badge}`}
                                                            >
                                                                {estilo.texto}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] opacity-80 mt-0.5">
                                                            {String(reserva.hora_inicio).slice(0, 5)} -{" "}
                                                            {String(reserva.hora_fin).slice(0, 5)}
                                                        </p>
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    /* ================= VISTA POR SEMANA ================= */
                    <table className="w-full min-w-[950px] border-collapse text-sm">
                        <thead>
                            <tr className="bg-green-600 text-white">
                                <th className="p-3 w-28 border-r border-green-500 text-center">
                                    Hora
                                </th>
                                {diasSemanaActual.map((dia) => {
                                    const esHoy = dia.iso === formatearFechaISO(new Date());
                                    return (
                                        <th
                                            key={dia.iso}
                                            className={`p-3 border-r border-green-500 text-center ${esHoy ? "bg-green-700" : ""
                                                }`}
                                        >
                                            <div className="text-xs uppercase opacity-90">
                                                {dia.etiqueta}
                                            </div>
                                            <div className="text-base font-extrabold">
                                                {dia.numero} {dia.mes}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {HORAS_DIA.map((hora) => {
                                const etiquetaHora = `${String(hora).padStart(2, "0")}:00`;

                                return (
                                    <tr key={hora} className="border-b">
                                        <td className="p-3 font-bold text-gray-600 text-center border-r bg-gray-50">
                                            {etiquetaHora}
                                        </td>

                                        {diasSemanaActual.map((dia) => {
                                            const bloqueadas = buscarReservasSemanaBloque(
                                                dia.iso,
                                                hora
                                            );

                                            if (bloqueadas.length === 0) {
                                                return (
                                                    <td
                                                        key={dia.iso}
                                                        className="p-2 border-r text-center text-[11px] text-gray-300"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={dia.iso} className="p-1.5 border-r align-top space-y-1">
                                                    {bloqueadas.map((res) => {
                                                        const estilo = estiloEstado(res.estado);
                                                        return (
                                                            <button
                                                                key={res.id_reserva}
                                                                onClick={() => setReservaDetalle(res)}
                                                                className={`w-full text-left p-2 rounded-lg border-l-4 text-xs transition cursor-pointer ${estilo.bloque}`}
                                                            >
                                                                <p className="font-bold truncate">
                                                                    {res.nombre_cancha || "Cancha"}
                                                                </p>
                                                                <p className="text-[11px] truncate">
                                                                    {res.nombre_usuario || "Cliente"}
                                                                </p>
                                                            </button>
                                                        );
                                                    })}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Detalle de Reserva Bloqueada */}
            {reservaDetalle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between border-b pb-3">
                            <h2 className="text-xl font-bold">
                                Reserva #{reservaDetalle.id_reserva}
                            </h2>
                            <button
                                onClick={() => setReservaDetalle(null)}
                                className="text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Cliente:</strong>{" "}
                                {reservaDetalle.nombre_usuario || "Usuario"}
                            </p>
                            <p>
                                <strong>Cancha:</strong>{" "}
                                {reservaDetalle.nombre_cancha || "Cancha"}
                            </p>
                            <p>
                                <strong>Fecha:</strong> {reservaDetalle.fecha_reserva}
                            </p>
                            <p>
                                <strong>Horario:</strong>{" "}
                                {String(reservaDetalle.hora_inicio).slice(0, 5)} -{" "}
                                {String(reservaDetalle.hora_fin).slice(0, 5)}
                            </p>
                            <p>
                                <strong>Total:</strong> $
                                {Number(reservaDetalle.total || 0).toLocaleString("es-CO")}
                            </p>
                            <p className="flex items-center gap-2">
                                <strong>Estado:</strong>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${String(reservaDetalle.estado || "").toLowerCase() ===
                                            "confirmada"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {reservaDetalle.estado}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={() => setReservaDetalle(null)}
                            className="mt-6 w-full rounded-xl bg-gray-900 hover:bg-gray-800 px-4 py-3 text-white font-semibold cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}