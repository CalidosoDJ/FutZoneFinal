"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Eye,
    Pencil,
    Trash2,
    X,
    CreditCard,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import PagarReservaModal from "./PagarReservaModal";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";
const API_SEDES = "http://127.0.0.1:8000/api/sedes/";
const API = "http://127.0.0.1:8000";

const obtenerImagenCancha = (cancha) => {
    const ruta = cancha?.imagen_url || cancha?.imagen || "";
    if (!ruta) return "/images/cancha1.jpg";
    if (ruta.startsWith("http")) return ruta;
    if (ruta.startsWith("/media/")) return `${API}${ruta}`;
    if (ruta.startsWith("media/")) return `${API}/${ruta}`;
    if (ruta.startsWith("/")) return `${API}${ruta}`;
    return `${API}/media/${ruta.replace(/^media\//, "")}`;
};

export default function ReservaCard() {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [procesando, setProcesando] = useState(false);

    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [reservaEditando, setReservaEditando] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [nuevaHoraInicio, setNuevaHoraInicio] = useState("");
    const [nuevaHoraFin, setNuevaHoraFin] = useState("");

    // Estados para el Modal de Pagos del Jugador
    const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
    const [reservaParaPagar, setReservaParaPagar] = useState(null);

    const cargarReservas = async () => {
        setCargando(true);
        setError("");

        try {
            const usuarioGuardado =
                localStorage.getItem("usuarioLogueado") ||
                sessionStorage.getItem("usuarioLogueado");
            if (!usuarioGuardado) {
                setError("Inicia sesión para consultar tus reservas.");
                return;
            }

            const usuario = JSON.parse(usuarioGuardado);
            const idUsuario = Number(usuario.id_usuario);

            if (!idUsuario) {
                setError("No se pudo identificar tu usuario. Inicia sesión nuevamente.");
                return;
            }

            const [resRes, resCan, resSed] = await Promise.all([
                fetch(API_RESERVAS, { cache: "no-store" }),
                fetch(API_CANCHAS, { cache: "no-store" }),
                fetch(API_SEDES, { cache: "no-store" }),
            ]);

            if (!resRes.ok || !resCan.ok || !resSed.ok) {
                throw new Error("No se pudieron consultar los datos de Django.");
            }

            const [datosRes, datosCan, datosSed] = await Promise.all([
                resRes.json(),
                resCan.json(),
                resSed.json(),
            ]);

            const listaReservas = Array.isArray(datosRes) ? datosRes : datosRes.results || [];
            const listaCanchas = Array.isArray(datosCan) ? datosCan : datosCan.results || [];
            const listaSedes = Array.isArray(datosSed) ? datosSed : datosSed.results || [];

            const misReservas = listaReservas
                .filter((r) => Number(r.id_usuario) === idUsuario)
                .map((r) => {
                    const cancha = listaCanchas.find((c) => Number(c.id_cancha) === Number(r.id_cancha));
                    const sede = listaSedes.find((s) => Number(s.id_sede) === Number(cancha?.id_sede));
                    const imagenCancha = obtenerImagenCancha(cancha);

                    return {
                        ...r,
                        imagen: imagenCancha,
                        nombre_cancha: cancha?.nombre_cancha || cancha?.nombre || "Cancha FutZone",
                        direccion: sede?.direccion || "Dirección no disponible",
                    };
                });
            setReservas(misReservas);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar las reservas. Verifica que Django esté funcionando.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    const abrirEdicion = (r) => {
        setReservaEditando(r);
        setNuevaFecha(r.fecha_reserva);
        setNuevaHoraInicio(String(r.hora_inicio).slice(0, 5));
        setNuevaHoraFin(String(r.hora_fin).slice(0, 5));
        setMensaje("");
    };

    const guardarEdicion = async () => {
        if (!nuevaFecha || !nuevaHoraInicio || !nuevaHoraFin) {
            setMensaje("Selecciona la fecha y las dos horas.");
            return;
        }

        if (nuevaHoraFin <= nuevaHoraInicio) {
            setMensaje("La hora de finalización debe ser posterior a la de inicio.");
            return;
        }

        setProcesando(true);
        setMensaje("");

        try {
            const respuesta = await fetch(`${API_RESERVAS}${reservaEditando.id_reserva}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fecha_reserva: nuevaFecha,
                    hora_inicio: nuevaHoraInicio,
                    hora_fin: nuevaHoraFin,
                }),
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo actualizar la reserva en el servidor.");
            }

            setReservaEditando(null);
            setMensaje("Reserva actualizada correctamente.");
            await cargarReservas();
        } catch (err) {
            setMensaje(err.message || "Error al actualizar.");
        } finally {
            setProcesando(false);
        }
    };

    const eliminarReserva = async (r) => {
        const confirmar = window.confirm(`¿Deseas eliminar la reserva #${r.id_reserva} de ${r.nombre_cancha}?`);
        if (!confirmar) return;

        setProcesando(true);
        setMensaje("");

        try {
            const respuesta = await fetch(`${API_RESERVAS}${r.id_reserva}/`, {
                method: "DELETE",
            });

            if (!respuesta.ok) {
                throw new Error("Error al eliminar la reserva.");
            }

            setReservaSeleccionada(null);
            setMensaje("Reserva eliminada correctamente.");
            await cargarReservas();
        } catch (err) {
            setMensaje(err.message || "No se pudo eliminar.");
        } finally {
            setProcesando(false);
        }
    };

    if (cargando) {
        return (
            <div className="rounded-3xl bg-white p-16 text-center shadow-sm border border-slate-200 text-slate-500 font-medium">
                Cargando tus reservas...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
                <p className="font-semibold text-rose-600 mb-4">{error}</p>
                <button
                    onClick={cargarReservas}
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div>
            {mensaje && (
                <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-emerald-900 border border-emerald-200 shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
                    <p className="text-xs font-bold">{mensaje}</p>
                    <button onClick={() => setMensaje("")} className="cursor-pointer text-emerald-700 hover:text-emerald-900">
                        <X size={18} />
                    </button>
                </div>
            )}

            {reservas.length === 0 ? (
                <div className="rounded-3xl bg-white p-16 text-center shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-black text-slate-800">Aún no tienes reservas activas</h2>
                    <p className="mt-2 text-sm text-slate-400">Cuando reserves una cancha en FutZone, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {reservas.map((r) => (
                        <div
                            key={r.id_reserva}
                            className="overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl transition-all border border-slate-200/80 flex flex-col justify-between group"
                        >
                            <div>
                                {/* Imagen con Overlay Superior */}
                                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={r.imagen}
                                        alt={r.nombre_cancha}
                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/cancha1.jpg";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                    <span className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-slate-800 shadow-sm border border-slate-200/50">
                                        #{r.id_reserva}
                                    </span>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                            {r.nombre_cancha}
                                        </h2>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${r.estado === "Pagado" || r.estado === "Confirmada"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                            {r.estado === "Pagado" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                            {r.estado || "Pendiente"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <Calendar size={15} className="text-emerald-600 shrink-0" />
                                            <span className="font-semibold">{r.fecha_reserva}</span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <Clock size={15} className="text-emerald-600 shrink-0" />
                                            <span className="font-semibold">
                                                {String(r.hora_inicio).slice(0, 5)} - {String(r.hora_fin).slice(0, 5)}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex items-center gap-2.5 pt-2 border-t border-slate-200/60">
                                            <MapPin size={15} className="text-emerald-600 shrink-0" />
                                            <span className="truncate">{r.direccion}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Total</span>
                                        <span className="text-2xl font-black text-emerald-600 tracking-tight">
                                            ${(Number(r.total) || 0).toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción Unificados y Estilizados */}
                            <div className="p-6 pt-0 space-y-3">
                                <button
                                    onClick={() => {
                                        setReservaParaPagar(r);
                                        setModalPagoAbierto(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 font-extrabold text-white text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                                >
                                    <CreditCard size={16} />
                                    Pagar Reserva (Nequi / Efectivo)
                                </button>

                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setReservaSeleccionada(r)}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 font-bold text-slate-700 text-xs transition cursor-pointer"
                                    >
                                        <Eye size={14} /> Detalle
                                    </button>

                                    <button
                                        onClick={() => abrirEdicion(r)}
                                        disabled={procesando}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 py-2.5 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Pencil size={14} /> Editar
                                    </button>

                                    <button
                                        onClick={() => eliminarReserva(r)}
                                        disabled={procesando}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                                    >
                                        <Trash2 size={14} /> Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE PAGOS */}
            <PagarReservaModal
                mostrarModal={modalPagoAbierto}
                setMostrarModal={setModalPagoAbierto}
                reservaSeleccionada={reservaParaPagar}
                onPagoExitoso={() => cargarReservas()}
            />

            {/* MODAL DETALLES */}
            {reservaSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl text-slate-700 border border-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900">Resumen de Reserva</h3>
                            <button
                                onClick={() => setReservaSeleccionada(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="my-5 space-y-3 text-xs">
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-400 font-semibold">ID Reserva</span>
                                <span className="font-bold text-slate-800">#{reservaSeleccionada.id_reserva}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-400 font-semibold">Cancha</span>
                                <span className="font-bold text-slate-800">{reservaSeleccionada.nombre_cancha}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-400 font-semibold">Fecha</span>
                                <span className="font-bold text-slate-800">{reservaSeleccionada.fecha_reserva}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-400 font-semibold">Horario</span>
                                <span className="font-bold text-slate-800">{String(reservaSeleccionada.hora_inicio).slice(0, 5)} - {String(reservaSeleccionada.hora_fin).slice(0, 5)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-400 font-semibold">Sede / Dirección</span>
                                <span className="font-bold text-slate-800 truncate max-w-[200px]">{reservaSeleccionada.direccion}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setReservaSeleccionada(null)}
                            className="w-full rounded-2xl bg-slate-900 py-3 font-bold text-white text-xs hover:bg-slate-800 transition cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL EDICIÓN */}
            {reservaEditando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl text-slate-700 border border-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Modificar Reserva</h3>
                                <p className="text-[11px] text-slate-400">{reservaEditando.nombre_cancha}</p>
                            </div>
                            <button
                                onClick={() => setReservaEditando(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="my-5 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-600 mb-1.5">Nueva Fecha</label>
                                <input
                                    type="date"
                                    value={nuevaFecha}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    onChange={(e) => setNuevaFecha(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 focus:outline-none focus:border-emerald-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1.5">Hora Inicio</label>
                                    <input
                                        type="time"
                                        value={nuevaHoraInicio}
                                        onChange={(e) => setNuevaHoraInicio(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 focus:outline-none focus:border-emerald-600"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1.5">Hora Fin</label>
                                    <input
                                        type="time"
                                        value={nuevaHoraFin}
                                        onChange={(e) => setNuevaHoraFin(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 focus:outline-none focus:border-emerald-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={guardarEdicion}
                                disabled={procesando}
                                className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white text-xs hover:bg-emerald-700 transition cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                {procesando ? "Guardando..." : "Guardar Cambios"}
                            </button>
                            <button
                                onClick={() => setReservaEditando(null)}
                                disabled={procesando}
                                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-600 text-xs hover:bg-slate-200 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}