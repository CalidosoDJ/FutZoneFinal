
"use client";

import {
    Calendar,
    Clock,
    MapPin,
    Car,
    Wifi,
    Coffee,
    Lightbulb,
    ShowerHead,
    Star,
    Phone,
    ArrowLeft
} from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function convertirHora24(hora12) {
    const [horaTexto, periodo] = hora12.split(" ");
    let [horas, minutos] = horaTexto.split(":").map(Number);

    if (periodo === "PM" && horas !== 12) horas += 12;
    if (periodo === "AM" && horas === 12) horas = 0;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:00`;
}

export default function ReservaCancha({ cancha }) {
    const router = useRouter();

    const [reservaCreada, setReservaCreada] = useState(null);
    const [cargandoReserva, setCargandoReserva] = useState(false);
    const [requiereArbitro, setRequiereArbitro] = useState(false);
    const [tipoArbitro, setTipoArbitro] = useState("Profesional");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [reservas, setReservas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const horarios = [
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM",
        "08:00 PM",
        "09:00 PM",
    ];

    // Consultar las reservas guardadas en Django.
    useEffect(() => {
        const cargarReservas = async () => {
            try {
                const respuesta = await fetch("http://127.0.0.1:8000/api/reservas/");

                if (!respuesta.ok) {
                    throw new Error("No se pudieron consultar las reservas.");
                }

                const datos = await respuesta.json();
                const lista = Array.isArray(datos) ? datos : (datos.results || []);

                const reservasFormateadas = lista.map((reserva) => {
                    const horaInicio = String(reserva.hora_inicio || "00:00:00");
                    const [horas, minutos] = horaInicio.split(":").map(Number);
                    const periodo = horas >= 12 ? "PM" : "AM";
                    const hora12 = horas % 12 || 12;

                    return {
                        id: reserva.id_reserva,
                        canchaId: Number(reserva.id_cancha?.id_cancha ?? reserva.id_cancha?.id ?? reserva.id_cancha),
                        cancha: reserva.nombre_cancha || reserva.cancha?.nombre || "",
                        fecha: String(reserva.fecha_reserva || "").slice(0, 10),
                        hora: `${String(hora12).padStart(2, "0")}:${String(minutos).padStart(2, "0")} ${periodo}`,
                        horaInicio,
                        horaFin: reserva.hora_fin,
                        precio: Number(reserva.total ?? reserva.precio ?? cancha?.precio ?? 0),
                        total: Number(reserva.total ?? reserva.precio ?? cancha?.precio ?? 0),
                        requiereArbitro: false,
                        tipoArbitro: null,
                        estado: reserva.estado,
                    };
                });

                setReservas(reservasFormateadas);
            } catch (error) {
                console.error("Error al cargar las reservas:", error);
            }
        };

        cargarReservas();
    }, [cancha?.id, cancha?.precio]);

    const horarioReservado = (horaActual) => {
        const fechaSeleccionada = fecha;
        const horaSeleccionada = convertirHora24(horaActual).slice(0, 5);

        return reservas.some((reserva) => {
            const horaReserva = String(reserva.horaInicio || convertirHora24(reserva.hora || "12:00 AM")).slice(0, 5);
            return Number(reserva.canchaId) === Number(cancha?.id)
                && String(reserva.fecha).slice(0, 10) === fechaSeleccionada
                && horaReserva === horaSeleccionada
                && String(reserva.estado || "").toLowerCase() !== "cancelada";
        });
    };

    const reservarAhora = async () => {
        if (!fecha || !hora) {
            alert("Selecciona una fecha y una hora.");
            return;
        }

        if (cargandoReserva) return;

        // Evitar reservas en fechas pasadas.
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaElegida = new Date(`${fecha}T00:00:00`);
        if (fechaElegida < hoy) {
            alert("No puedes reservar una fecha que ya pasó.");
            return;
        }

        let usuarioLogueado;
        try {
            usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
        } catch {
            alert("No se pudo leer la sesión. Inicia sesión nuevamente.");
            router.push("/login");
            return;
        }

        if (!usuarioLogueado?.id_usuario) {
            alert("Debes iniciar sesión para reservar.");
            router.push("/login");
            return;
        }

        if (Number(usuarioLogueado.id_rol) !== 2) {
            alert("Debes ingresar con una cuenta de jugador.");
            return;
        }

        if (!cancha?.id) {
            alert("No se encontró el identificador de la cancha.");
            return;
        }

        if (requiereArbitro) {
            alert("El servicio de árbitro todavía no está integrado con la base de datos. Por ahora, reserva la cancha sin ese servicio.");
            return;
        }

        if (horarioReservado(hora)) {
            alert("Ese horario ya está reservado. Selecciona otro.");
            return;
        }

        const horaInicio = convertirHora24(hora);
        const [horasInicio, minutosInicio] = horaInicio.split(":").map(Number);
        const minutosFin = horasInicio * 60 + minutosInicio + 60;
        const horasFin = Math.floor(minutosFin / 60);
        const minutosFinReloj = minutosFin % 60;
        const horaFin = `${String(horasFin).padStart(2, "0")}:${String(minutosFinReloj).padStart(2, "0")}:00`;

        setCargandoReserva(true);

        try {
            const respuesta = await fetch("http://127.0.0.1:8000/api/reservas/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: usuarioLogueado.id_usuario,
                    id_cancha: cancha.id,
                    fecha_reserva: fecha,
                    hora_inicio: horaInicio,
                    hora_fin: horaFin,
                }),
            });

            const datos = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                const errores = Object.entries(datos)
                    .map(([campo, mensajes]) => {
                        const texto = Array.isArray(mensajes)
                            ? mensajes.join(", ")
                            : typeof mensajes === "string"
                                ? mensajes
                                : JSON.stringify(mensajes);
                        return `${campo}: ${texto}`;
                    })
                    .join("\\n");

                alert(errores || "No fue posible registrar la reserva. Verifica la fecha y el horario.");
                return;
            }

            const totalServidor = Number(datos.total ?? cancha.precio);
            const nuevaReserva = {
                id: datos.id_reserva ?? datos.id ?? Date.now(),
                canchaId: Number(datos.id_cancha?.id_cancha ?? datos.id_cancha?.id ?? datos.id_cancha ?? cancha.id),
                cancha: datos.nombre_cancha || cancha.nombre,
                fecha: String(datos.fecha_reserva || fecha).slice(0, 10),
                hora,
                horaInicio: datos.hora_inicio || horaInicio,
                horaFin: datos.hora_fin || horaFin,
                precio: Number(cancha.precio || totalServidor),
                total: Number.isFinite(totalServidor) ? totalServidor : Number(cancha.precio || 0),
                requiereArbitro: false,
                tipoArbitro: null,
                direccion: cancha.direccion,
                imagen: cancha.imagen,
                estado: datos.estado || "Confirmada",
            };

            setReservas((reservasActuales) => [...reservasActuales, nuevaReserva]);
            setReservaCreada(nuevaReserva);
            setMostrarModal(true);

            // Guardar notificación solo cuando Django confirme la reserva.
            try {
                const notificaciones = JSON.parse(localStorage.getItem("notificaciones") || "[]");
                const nuevaNotificacion = {
                    id: Date.now(),
                    tipo: "reserva",
                    titulo: "Nueva reserva",
                    mensaje: `Se ha realizado una nueva reserva de cancha: ${cancha.nombre}.`,
                    tiempo: "Hace unos segundos",
                    icono: "CalendarCheck",
                    leida: false,
                };
                localStorage.setItem("notificaciones", JSON.stringify([nuevaNotificacion, ...notificaciones]));
                window.dispatchEvent(new Event("notificacionesActualizadas"));
            } catch (error) {
                console.error("No se pudo guardar la notificación:", error);
            }
        } catch (error) {
            console.error("Error al crear la reserva:", error);
            alert("No fue posible conectar con el servidor. Verifica que el backend de Django esté funcionando.");
        } finally {
            setCargandoReserva(false);
        }
    };

    return (
        <>
            <section className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Botón volver */}
                    <Link
                        href="/canchas"
                        className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 mb-8 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                        Volver a las canchas
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Columna izquierda */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Imagen */}
                            <div className="overflow-hidden rounded-3xl shadow-xl bg-white">
                                <img
                                    src={cancha.imagen}
                                    alt={cancha.nombre}
                                    className="w-full h-[430px] object-cover hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* Información */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div>
                                        <h1 className="text-4xl font-black text-gray-800">
                                            {cancha.nombre}
                                        </h1>
                                        <div className="flex items-center gap-2 mt-3">
                                            <Star className="fill-yellow-400 text-yellow-400" size={20} />
                                            <span className="font-semibold">{cancha.calificacion}</span>
                                            <span className="text-gray-500">Excelente cancha</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                                            Disponible
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin className="text-green-600" size={20} />
                                        <span>{cancha.direccion}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone className="text-green-600" size={20} />
                                        <span>{cancha.telefono}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-2xl text-gray-800 font-bold mb-4">Descripción</h2>
                                    <p className="text-gray-600 leading-8">{cancha.descripcion}</p>
                                </div>
                            </div>

                            {/* Seleccionar fecha */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-2xl text-gray-800 font-bold flex items-center gap-2 mb-6">
                                    <Calendar className="text-green-600" />
                                    Selecciona la fecha
                                </h2>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="w-full text-gray-800 border border-gray-300 rounded-xl p-4 text-gray-800 outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            {/* Horarios */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-2xl text-gray-800 font-bold flex items-center gap-2 mb-6">
                                    <Clock className="text-green-600" />
                                    Horarios disponibles
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {horarios.map((item) => {
                                        const ocupado = horarioReservado(item);
                                        return (
                                            <button
                                                key={item}
                                                disabled={ocupado}
                                                onClick={() => setHora(item)}
                                                className={`rounded-xl py-3 text-gray-700 font-semibold transition duration-300 cursor-pointer ${ocupado
                                                    ? "bg-red-500 text-white cursor-not-allowed opacity-80"
                                                    : hora === item
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-100 hover:bg-green-100 hover:text-green-700"
                                                    }`}
                                            >
                                                {ocupado ? "🔒 " : ""}
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Servicios */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-2xl text-gray-800 font-bold mb-8">Servicios incluidos</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(cancha.servicios || []).map((servicio, index) => {
                                        let icono = "⚽";
                                        if (servicio === "Iluminación LED") icono = <Lightbulb className="text-yellow-500" size={22} />;
                                        else if (servicio === "Parqueadero") icono = <Car className="text-blue-500" size={22} />;
                                        else if (servicio === "WiFi") icono = <Wifi className="text-green-600" size={22} />;
                                        else if (servicio === "Cafetería") icono = <Coffee className="text-orange-500" size={22} />;
                                        else if (servicio === "Camerinos") icono = <ShowerHead className="text-cyan-500" size={22} />;

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition"
                                            >
                                                {icono}
                                                <span className="font-medium text-gray-700">{servicio}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha - Resumen */}
                        <div>
                            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-28">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Resumen de la Reserva</h2>

                                <h3 className="text-xl text-gray-800 font-bold mb-2">Servicio de árbitro</h3>
                                <p className="text-gray-500 text-sm mb-6">¿Deseas contratar un árbitro para tu partido?</p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    {/* NO */}
                                    <button
                                        type="button"
                                        onClick={() => setRequiereArbitro(false)}
                                        className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${!requiereArbitro
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:border-green-400"
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">⚽</div>
                                        <h4 className="font-bold text-gray-800 text-sm">No necesito</h4>
                                        <p className="text-xs text-gray-500 mt-1">Solo la cancha.</p>
                                    </button>

                                    {/* SÍ */}
                                    <button
                                        type="button"
                                        onClick={() => setRequiereArbitro(true)}
                                        className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${requiereArbitro
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:border-green-400"
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">🧑‍⚖️</div>
                                        <h4 className="font-bold text-gray-800 text-sm">Sí, necesito</h4>
                                        <p className="text-xs text-gray-500 mt-1">Con árbitro.</p>
                                    </button>
                                </div>

                                {/* OPCIONES ÁRBITRO */}
                                {requiereArbitro && (
                                    <div className="mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de árbitro</label>
                                        <select
                                            value={tipoArbitro}
                                            onChange={(e) => setTipoArbitro(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 bg-white outline-none focus:ring-2 focus:ring-green-600"
                                        >
                                            <option value="Profesional">Árbitro profesional</option>
                                            <option value="Amateur">Árbitro amateur</option>
                                        </select>
                                        <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Adicional árbitro</span>
                                            <span className="text-base font-bold text-green-600">+ $50.000</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 border-t pt-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Cancha</span>
                                        <span className="font-semibold text-gray-800">{cancha.nombre}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Fecha</span>
                                        <span className="font-semibold text-gray-800">
                                            {fecha
                                                ? (() => {
                                                    const [año, mes, dia] = fecha.split("-");
                                                    return `${dia}/${mes}/${año}`;
                                                })()
                                                : "No seleccionada"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Hora</span>
                                        <span className="font-semibold text-gray-800">{hora || "No seleccionada"}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Precio cancha</span>
                                        <span className="font-bold text-green-600">${cancha.precio.toLocaleString("es-CO")}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-800 items-center text-xl font-bold pt-4 border-t">
                                        <span>Total</span>
                                        <span className="text-green-600">
                                            ${(cancha.precio + (requiereArbitro ? 50000 : 0)).toLocaleString("es-CO")}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={reservarAhora}
                                    disabled={cargandoReserva}
                                    className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:opacity-60 transition text-white py-4 rounded-xl text-lg font-bold cursor-pointer shadow-md hover:shadow-lg"
                                >
                                    {cargandoReserva ? "Procesando reserva..." : "Reservar ahora"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL CONFIRMACIÓN */}
            {mostrarModal && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-[fadeIn_.25s_ease]">
                        <div className="text-center">
                            <div className="text-5xl mb-3">✅</div>
                            <h2 className="text-2xl font-bold text-green-600">¡Reserva Confirmada!</h2>
                            <p className="text-gray-500 text-sm mt-1">Tu reserva fue realizada exitosamente.</p>
                        </div>

                        <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                            <div className="flex justify-between text-gray-700">
                                <span>Cancha:</span>
                                <strong>{reservaCreada?.cancha}</strong>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Fecha:</span>
                                <strong>{reservaCreada?.fecha}</strong>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Hora:</span>
                                <strong>{reservaCreada?.hora}</strong>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Árbitro:</span>
                                <strong>{reservaCreada?.requiereArbitro ? reservaCreada?.tipoArbitro : "No incluido"}</strong>
                            </div>
                            <div className="flex justify-between text-gray-700 pt-2 border-t font-bold">
                                <span>Total:</span>
                                <strong className="text-green-600">${reservaCreada?.total?.toLocaleString("es-CO")}</strong>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => router.push("/mis-reservas")}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm cursor-pointer"
                            >
                                Mis Reservas
                            </button>
                            <button
                                onClick={() => setMostrarModal(false)}
                                className="flex-1 text-gray-700 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 font-semibold text-sm cursor-pointer"
                            >
                                Seguir Reservando
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}