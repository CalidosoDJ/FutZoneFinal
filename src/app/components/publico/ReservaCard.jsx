"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Eye,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";
const API_SEDES = "http://127.0.0.1:8000/api/sedes/";

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

    const cargarReservas = async () => {
        setCargando(true);
        setError("");

        try {
            const usuarioGuardado = localStorage.getItem("usuarioLogueado");

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

            const listaReservas = Array.isArray(datosRes)
                ? datosRes
                : datosRes.results || [];

            const listaCanchas = Array.isArray(datosCan)
                ? datosCan
                : datosCan.results || [];

            const listaSedes = Array.isArray(datosSed)
                ? datosSed
                : datosSed.results || [];

            const misReservas = listaReservas
                .filter(
                    (r) => Number(r.id_usuario) === idUsuario
                )
                .map((r) => {
                    const cancha = listaCanchas.find(
                        (c) => Number(c.id_cancha) === Number(r.id_cancha)
                    );

                    const sede = listaSedes.find(
                        (s) => Number(s.id_sede) === Number(cancha?.id_sede)
                    );

                    return {
                        ...r,
                        imagen: cancha?.imagen || "/images/cancha1.jpg",
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
            const respuesta = await fetch(
                `${API_RESERVAS}${reservaEditando.id_reserva}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fecha_reserva: nuevaFecha,
                        hora_inicio: nuevaHoraInicio,
                        hora_fin: nuevaHoraFin,
                    }),
                }
            );

            if (!respuesta.ok) {
                const detalle = await respuesta.text();
                console.error("Respuesta de Django:", detalle);
                throw new Error(
                    "Django no permitió actualizar la reserva. Verifica que el endpoint admita PATCH."
                );
            }

            setReservaEditando(null);
            setMensaje("Reserva actualizada correctamente.");
            await cargarReservas();
        } catch (err) {
            setMensaje(err.message || "No se pudo actualizar la reserva.");
        } finally {
            setProcesando(false);
        }
    };


    const eliminarReserva = async (r) => {
        console.log("Reserva recibida:", r);
        console.log("ID de reserva a eliminar:", r.id_reserva);
        console.log("URL de eliminación:", `${API_RESERVAS}${r.id_reserva}/`);

        const confirmar = window.confirm(
            `¿Deseas eliminar la reserva #${r.id_reserva} de ${r.nombre_cancha}?`
        );

        if (!confirmar) return;

        setProcesando(true);
        setMensaje("");

        try {
            const respuesta = await fetch(
                `${API_RESERVAS}${r.id_reserva}/`,
                {
                    method: "DELETE",
                }
            );

            if (!respuesta.ok) {
                const detalle = await respuesta.text();

                console.error("Estado HTTP:", respuesta.status);
                console.error("Respuesta de Django:", detalle);

                setMensaje(
                    `Error al eliminar la reserva. Código HTTP: ${respuesta.status}`
                );

                return;
            }

            setReservaSeleccionada(null);
            setMensaje("Reserva eliminada correctamente.");

            await cargarReservas();

        } catch (err) {
            console.error("Error de conexión:", err);
            setMensaje(err.message || "No se pudo eliminar la reserva.");
        } finally {
            setProcesando(false);
        }
    };


    if (cargando) {
        return (
            <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
                Cargando tus reservas...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
                <p className="font-semibold text-red-600">{error}</p>
                <button
                    onClick={cargarReservas}
                    className="mt-5 rounded-xl bg-green-600 px-6 py-3 text-white"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div>
            {mensaje && (
                <div className="mb-6 rounded-xl bg-blue-50 p-4 text-blue-800">
                    <div className="flex items-center justify-between gap-3">
                        <p>{mensaje}</p>
                        <button onClick={() => setMensaje("")} aria-label="Cerrar mensaje">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {reservas.length === 0 ? (
                <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-700">
                        Aún no tienes reservas
                    </h2>
                    <p className="mt-3 text-gray-500">
                        Cuando realices una reserva aparecerá aquí.
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {reservas.map((r) => (
                        <div
                            key={r.id_reserva}
                            className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl"
                        >
                            <img
                                src={r.imagen}
                                alt={r.nombre_cancha || "Cancha reservada"}
                                className="h-64 w-full bg-gray-200 object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/cancha1.jpg";
                                }}
                            />

                            <div className="p-7">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {r.nombre_cancha}
                                    </h2>

                                    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                                        {r.estado}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    Reserva #{r.id_reserva}
                                </p>

                                <div className="mt-6 space-y-4 text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} />
                                        <span>{r.fecha_reserva}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock size={20} />
                                        <span>
                                            {String(r.hora_inicio).slice(0, 5)}
                                            {" - "}
                                            {String(r.hora_fin).slice(0, 5)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} />
                                        <span>{r.direccion}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <DollarSign size={20} />
                                        <span className="text-xl font-bold text-green-600">
                                            ${(Number(r.total) || 0).toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        onClick={() => setReservaSeleccionada(r)}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                                    >
                                        <Eye size={18} />
                                        Ver reserva
                                    </button>

                                    <button
                                        onClick={() => abrirEdicion(r)}
                                        disabled={procesando}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-500 py-3 font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                                    >
                                        <Pencil size={18} />
                                        Editar
                                    </button>

                                    <Link
                                        href={`/ reserva / ${r.id_cancha} `}
                                        className="flex items-center justify-center rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
                                    >
                                        Ver cancha
                                    </Link>

                                    <button onClick={() => eliminarReserva(r)}
                                        disabled={procesando}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VENTANA PARA VER LA RESERVA */}
            {reservaSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Detalles de la reserva
                            </h2>
                            <button
                                onClick={() => setReservaSeleccionada(null)}
                                className="text-gray-500 hover:text-gray-800"
                                aria-label="Cerrar"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4 text-gray-700">
                            <p>
                                <strong>Número:</strong> #{reservaSeleccionada.id_reserva}
                            </p>
                            <p>
                                <strong>Cancha:</strong> {reservaSeleccionada.nombre_cancha}
                            </p>
                            <p>
                                <strong>Fecha:</strong> {reservaSeleccionada.fecha_reserva}
                            </p>
                            <p>
                                <strong>Horario:</strong>{" "}
                                {String(reservaSeleccionada.hora_inicio).slice(0, 5)}
                                {" - "}
                                {String(reservaSeleccionada.hora_fin).slice(0, 5)}
                            </p>
                            <p>
                                <strong>Dirección:</strong> {reservaSeleccionada.direccion}
                            </p>
                            <p>
                                <strong>Total:</strong>{" "}
                                ${(Number(reservaSeleccionada.total) || 0).toLocaleString("es-CO")}
                            </p>
                            <p>
                                <strong>Estado:</strong> {reservaSeleccionada.estado}
                            </p>
                        </div>

                        <button
                            onClick={() => setReservaSeleccionada(null)}
                            className="mt-7 w-full rounded-xl bg-gray-800 py-3 font-semibold text-white hover:bg-gray-900"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* VENTANA PARA EDITAR LA RESERVA */}
            {reservaEditando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Editar reserva
                            </h2>
                            <button
                                onClick={() => setReservaEditando(null)}
                                aria-label="Cerrar"
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p className="mt-2 text-gray-500">
                            {reservaEditando.nombre_cancha}
                        </p>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    value={nuevaFecha}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    onChange={(e) => setNuevaFecha(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 p-3 text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Hora de inicio
                                </label>
                                <input
                                    type="time"
                                    value={nuevaHoraInicio}
                                    onChange={(e) => setNuevaHoraInicio(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 p-3 text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Hora de finalización
                                </label>
                                <input
                                    type="time"
                                    value={nuevaHoraFin}
                                    onChange={(e) => setNuevaHoraFin(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 p-3 text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="mt-7 flex gap-3">
                            <button
                                onClick={guardarEdicion}
                                disabled={procesando}
                                className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {procesando ? "Guardando..." : "Guardar cambios"}
                            </button>

                            <button
                                onClick={() => setReservaEditando(null)}
                                disabled={procesando}
                                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
