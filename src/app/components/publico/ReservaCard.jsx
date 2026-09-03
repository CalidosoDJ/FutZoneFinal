"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Calendar,
    Clock,
    DollarSign,
    Star,
    MapPin,
} from "lucide-react";

export default function ReservaCard() {



    useEffect(() => {

        const datos = JSON.parse(localStorage.getItem("reservas")) || [];

        setReservas(datos);

    }, []);
    const [editando, setEditando] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [nuevaHora, setNuevaHora] = useState("");
    const [reservas, setReservas] = useState([]);



    const guardarReservas = (nuevasReservas) => {

        localStorage.setItem(
            "reservas",
            JSON.stringify(nuevasReservas)
        );

        setReservas(nuevasReservas);

    };

    const cancelarReserva = (id) => {

        const confirmar = confirm("¿Deseas cancelar esta reserva?");

        if (!confirmar) return;

        const nuevasReservas = reservas.filter(
            (r) => r.id !== id
        );

        guardarReservas(nuevasReservas);

    };
    const editarReserva = () => {

        const nuevasReservas = reservas.map((r) =>

            r.id === editando
                ? {
                    ...r,
                    fecha: nuevaFecha,
                    hora: nuevaHora,
                }
                : r

        );

        guardarReservas(nuevasReservas);

        setEditando(null);

        alert("Reserva actualizada correctamente.");

    };
    const calificarReserva = (id, estrellas) => {

        const nuevasReservas = reservas.map((r) =>

            r.id === id
                ? {
                    ...r,
                    calificacion: estrellas,
                }
                : r

        );

        guardarReservas(nuevasReservas);

    };

    const guardarComentario = (id, comentario) => {

        const nuevasReservas = reservas.map((r) =>

            r.id === id
                ? {
                    ...r,
                    comentario,
                }
                : r

        );

        guardarReservas(nuevasReservas);

    };

    if (reservas.length === 0) {

        return (

            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

                <h2 className="text-3xl font-bold text-gray-700">

                    Aún no tienes reservas

                </h2>

                <p className="text-gray-500 mt-3">

                    Cuando realices una reserva aparecerá aquí.

                </p>

            </div>

        );

    }

    return (

        <div className="grid lg:grid-cols-2 gap-8">

            {reservas.map((r) => (

                <div
                    key={r.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                >

                    <Image
                        src={r.imagen}
                        alt={r.cancha}
                        width={700}
                        height={400}
                        className="w-full h-64 object-cover"
                    />

                    <div className="p-7">

                        <div className="flex justify-between items-center">

                            <h2 className="text-3xl font-bold text-gray-800">

                                {r.cancha}

                            </h2>

                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                                {r.estado}

                            </span>

                        </div>

                        <div className="space-y-4 mt-6 text-gray-600">

                            <div className="flex items-center gap-3">
                                <Calendar size={20} />
                                {r.fecha}
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock size={20} />
                                {r.hora}
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin size={20} />
                                {r.direccion}
                            </div>

                            {/* DESGLOSE DE PRECIOS */}

                            <div className="mt-6 border-t pt-5 space-y-3">

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Precio de cancha
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        ${(Number(r.precio) || 0).toLocaleString("es-CO")}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Árbitro
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {r.requiereArbitro
                                            ? "+$50.000"
                                            : "No incluido"}
                                    </span>
                                </div>

                                {r.requiereArbitro && (
                                    <div className="flex justify-between items-center">

                                        <span className="text-sm text-gray-500">
                                            Tipo de árbitro
                                        </span>

                                        <span className="text-sm font-semibold text-gray-700">
                                            {r.tipoArbitro}
                                        </span>

                                    </div>
                                )}

                                {/* TOTAL */}

                                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">

                                    <span className="text-gray-800">
                                        Total
                                    </span>

                                    <span className="text-green-600">

                                        ${(
                                            (Number(r.precio) || 0) +
                                            (r.requiereArbitro ? 50000 : 0)
                                        ).toLocaleString("es-CO")}

                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* ESTRELLAS */}

                        <div className="flex items-center gap-2 mt-6">

                            {[1, 2, 3, 4, 5].map((item) => (

                                <Star
                                    key={item}
                                    size={26}
                                    onClick={() => calificarReserva(r.id, item)}
                                    className={`cursor-pointer transition hover:scale-125 ${item <= r.calificacion
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />

                            ))}

                        </div>

                        {/* COMENTARIO */}

                        <textarea

                            defaultValue={r.comentario || ""}

                            onBlur={(e) =>
                                guardarComentario(
                                    r.id,
                                    e.target.value
                                )
                            }

                            placeholder="¿Cómo fue tu experiencia?"

                            className="w-full mt-5 border text-gray-700 border-gray-300 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-green-500"

                            rows={4}

                        />

                        {/* BOTONES */}

                        <div className="flex gap-4 mt-8">

                            <Link
                                href={`/reserva/${r.canchaId}`}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-center font-semibold transition"
                            >

                                Ver Reserva

                            </Link>
                            <button
                                onClick={() => {

                                    setEditando(r.id);
                                    setNuevaFecha(r.fecha);
                                    setNuevaHora(r.hora);

                                }}

                                className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition"
                            >

                                Editar

                            </button>

                            <button

                                onClick={() => cancelarReserva(r.id)}

                                className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition"

                            >

                                Cancelar

                            </button>


                        </div>


                    </div>

                    {/* MODAL EDITAR */}

                    {editando === r.id && (

                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                            <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

                                <h2 className="text-2xl text-gray-800 font-bold text-center mb-6">

                                    Editar Reserva

                                </h2>

                                <div className="space-y-5">

                                    <div>

                                        <label className="block text-gray-700 font-semibold mb-2">

                                            Fecha

                                        </label>

                                        <input
                                            type="date"
                                            value={nuevaFecha}
                                            onChange={(e) => setNuevaFecha(e.target.value)}
                                            className="w-full border text-gray-800 rounded-xl p-3"
                                        />

                                    </div>

                                    <div>

                                        <label className="block text-gray-700 font-semibold mb-2">

                                            Hora

                                        </label>

                                        <select
                                            value={nuevaHora}
                                            onChange={(e) => setNuevaHora(e.target.value)}
                                            className="w-full border text-gray-800 rounded-xl p-3"
                                        >

                                            <option>08:00 AM</option>
                                            <option>09:00 AM</option>
                                            <option>10:00 AM</option>
                                            <option>11:00 AM</option>
                                            <option>12:00 PM</option>
                                            <option>01:00 PM</option>
                                            <option>02:00 PM</option>
                                            <option>03:00 PM</option>
                                            <option>04:00 PM</option>
                                            <option>05:00 PM</option>
                                            <option>06:00 PM</option>
                                            <option>07:00 PM</option>
                                            <option>08:00 PM</option>

                                        </select>

                                    </div>

                                </div>

                                <div className="flex gap-4 mt-8">

                                    <button
                                        onClick={editarReserva}
                                        className="flex-1 bg-green-600 hover:bg-green-800 text-white py-3 rounded-xl font-bold transition"
                                    >

                                        Guardar Cambios

                                    </button>

                                    <button
                                        onClick={() => setEditando(null)}
                                        className="flex-1 border text-gray-700 border-gray-300 hover:bg-gray-100 rounded-xl py-3 transition"
                                    >

                                        Cancelar

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            ))
            }

        </div >

    )
        ;

}