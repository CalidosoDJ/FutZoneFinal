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

export default function ReservaCancha({ cancha }) {
    const router = useRouter();

    const [requiereArbitro, setRequiereArbitro] = useState(false);
    const [tipoArbitro, setTipoArbitro] = useState("Profesional");

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [reservas, setReservas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [reservaCreada, setReservaCreada] = useState(null);
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);

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

    useEffect(() => {
        // Cargar reservas globales
        const datos = JSON.parse(localStorage.getItem("reservas")) || [];
        setReservas(datos);

        // Cargar usuario en sesión
        const sesion = localStorage.getItem("usuarioLogueado");
        if (sesion) {
            setUsuarioLogueado(JSON.parse(sesion));
        }
    }, []);

    const horarioReservado = (horaActual) => {
        return reservas.some(
            (r) =>
                r.canchaId === cancha.id &&
                r.fecha === fecha &&
                r.hora === horaActual
        );
    };

    const reservarAhora = () => {
        if (!fecha || !hora) {
            alert("Selecciona una fecha y una hora.");
            return;
        }

        const existeReserva = reservas.some(
            (r) =>
                r.canchaId === cancha.id &&
                r.fecha === fecha &&
                r.hora === hora
        );

        if (existeReserva) {
            alert("❌ Ese horario ya está reservado.");
            return;
        }

        const precioArbitro = requiereArbitro ? 50000 : 0;
        const total = cancha.precio + precioArbitro;

        // 1. CREAR OBJETO RESERVA VINCULADO AL USUARIO
        const nuevaReserva = {
            id: Date.now(),
            usuarioId: usuarioLogueado?.id || null,
            correo: usuarioLogueado?.correo || "",
            canchaId: cancha.id,
            canchaNombre: cancha.nombre,
            cancha: cancha.nombre,
            fecha,
            hora,
            precio: cancha.precio,
            precioArbitro,
            total,
            requiereArbitro,
            tipoArbitro: requiereArbitro ? tipoArbitro : null,
            direccion: cancha.direccion,
            imagen: cancha.imagen,
            estado: "Confirmada",
        };

        const nuevasReservas = [...reservas, nuevaReserva];
        localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
        setReservas(nuevasReservas);
        setReservaCreada(nuevaReserva);

        // 2. CREAR NOTIFICACIÓN ESPECÍFICA PARA EL JUGADOR EN SESIÓN
        if (usuarioLogueado) {
            const claveNotif = `notificacionesJugador_${usuarioLogueado.id}`;
            const notificacionesPrevias = JSON.parse(localStorage.getItem(claveNotif)) || [];

            const nuevaNotificacionJugador = {
                id: Date.now(),
                titulo: "⚽ ¡Reserva Confirmada!",
                mensaje: `Reservaste ${cancha.nombre} para el ${fecha} a las ${hora}.`,
                fecha: new Date().toLocaleDateString("es-CO"),
                hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
                leida: false,
                detalle: {
                    cancha: cancha.nombre,
                    fecha,
                    hora,
                    total: `$${total.toLocaleString("es-CO")}`,
                    estado: "Confirmada"
                }
            };

            localStorage.setItem(
                claveNotif,
                JSON.stringify([nuevaNotificacionJugador, ...notificacionesPrevias])
            );
        }

        // 3. NOTIFICACIÓN PARA EL ADMIN (OPCIONAL/GENERAL)
        const notificacionesAdmin = JSON.parse(localStorage.getItem("notificaciones")) || [];
        const nuevaNotifAdmin = {
            id: Date.now(),
            tipo: "reserva",
            titulo: "Nueva reserva realizada",
            mensaje: `${usuarioLogueado?.nombre || "Un usuario"} reservó ${cancha.nombre} para el ${fecha} a las ${hora}.`,
            tiempo: "Hace unos segundos",
            icono: "CalendarCheck",
            leida: false
        };
        localStorage.setItem("notificaciones", JSON.stringify([nuevaNotifAdmin, ...notificacionesAdmin]));

        // Disparar evento para actualizar el contador en el Navbar en tiempo real
        window.dispatchEvent(new Event("notificacionesActualizadas"));

        setMostrarModal(true);
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
                                    {cancha.servicios.map((servicio, index) => {
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
                                    className="w-full mt-8 bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl text-lg font-bold cursor-pointer shadow-md hover:shadow-lg"
                                >
                                    Reservar ahora
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