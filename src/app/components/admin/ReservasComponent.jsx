"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import ReservaModal from "./ReservaModal";

export default function ReservasComponent() {

    const [reservas, setReservas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const [formulario, setFormulario] = useState({

        id: null,
        cliente: "",
        cancha: "",
        fecha: "",
        hora: "",
        duracion: 1,
        precioHora: 0,
        total: 0,
        metodoPago: "Efectivo",
        estado: "Pendiente",

    });

    // Cargar reservas
    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("reservas")) || [];

        setReservas(datos);

    }, []);

    // Guardar nueva reserva
    const guardarReserva = () => {

        const nuevas = [...reservas, formulario];

        setReservas(nuevas);

        localStorage.setItem(
            "reservas",
            JSON.stringify(nuevas)
        );

        setMostrarModal(false);

    };

    // Eliminar
    const eliminarReserva = (id) => {

        if (!confirm("¿Eliminar esta reserva?")) return;

        const nuevas = reservas.filter((r) => r.id !== id);

        setReservas(nuevas);

        localStorage.setItem(
            "reservas",
            JSON.stringify(nuevas)
        );

    };

    // Editar
    const editarReserva = (reserva) => {

        setFormulario(reserva);

        setEditando(true);

        setMostrarModal(true);

    };

    // Actualizar
    const actualizarReserva = () => {

        const nuevas = reservas.map((r) =>
            r.id === formulario.id ? formulario : r
        );

        setReservas(nuevas);

        localStorage.setItem(
            "reservas",
            JSON.stringify(nuevas)
        );

        setMostrarModal(false);

        setEditando(false);

    };

    return (

        <div >

            {/* Encabezado */}

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Gestión de Reservas
                </h1>

                <button

                    onClick={() => {

                        setFormulario({

                            id: Date.now(),

                            cliente: "",

                            cancha: "",

                            fecha: "",

                            hora: "",

                            duracion: 1,

                            precioHora: 0,

                            total: 0,

                            metodoPago: "Efectivo",

                            estado: "Pendiente",

                        });

                        setEditando(false);

                        setMostrarModal(true);

                    }}

                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >

                    <FaPlus />

                    Nueva Reserva

                </button>

            </div>

            {/* Buscar */}

            <div className="relative mb-6 text-gray-700">

                <FaSearch className="absolute left-4 top-4 text-gray-400" />

                <input

                    type="text"

                    placeholder="Buscar reserva..."

                    value={busqueda}

                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }

                    className="w-full border rounded-xl pl-12 p-3"

                />

            </div>

            {/* Tabla */}

            <div className="bg-white rounded-2xl shadow overflow-hidden text-gray-700">

                <table className="w-full text-center">

                    <thead className="bg-green-600 from-green-600 to-green-700 text-white">

                        <tr>

                            <th className="p-4">Cliente</th>

                            <th>Cancha</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {reservas

                            .filter((r) =>

                                r.cliente
                                    .toLowerCase()
                                    .includes(busqueda.toLowerCase())

                            )

                            .map((r) => (

                                <tr
                                    key={r.id}
                                    className="border-b hover:bg-green-50 transition duration-200"
                                >

                                    <td className="p-4">{r.cliente}</td>

                                    <td>{r.cancha}</td>

                                    <td>{r.fecha}</td>

                                    <td>{r.hora}</td>

                                    <td className="font-bold text-green-600">
                                        $
                                        {Number(r.total).toLocaleString()}
                                    </td>

                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold

                                            ${r.estado === "Confirmada"
                                                ? "bg-green-100 text-green-700"

                                                : r.estado === "Pendiente"
                                                    ? "bg-yellow-100 text-yellow-700"

                                                    : "bg-red-100 text-red-700"
                                            }

                                            `}>
                                            {r.estado}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="flex justify-center gap-3">

                                            <button className="text-blue-600 hover:text-blue-800 transition ">
                                                <FaEye />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    editarReserva(r)
                                                }

                                                className="text-yellow-500 hover:text-yellow-600 transition"
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    eliminarReserva(r.id)
                                                }
                                                className="text-red-600 hover:text-red-700 transition"
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

            <ReservaModal

                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                formulario={formulario}
                setFormulario={setFormulario}
                guardarReserva={guardarReserva}
                actualizarReserva={actualizarReserva}
                editando={editando}

            />

        </div>

    );

}