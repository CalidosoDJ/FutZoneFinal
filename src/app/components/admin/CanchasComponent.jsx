"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, } from "react-icons/fa";

import CanchaModal from "./CanchaModal";

export default function CanchasComponent() {

    const [canchas, setCanchas] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [indice, setIndice] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: "",
        tipo: "Fútbol 5",
        precio: "",
        estado: "Disponible",
        imagen: "",
    });

    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("canchas")) || [];

        setCanchas(datos);

    }, []);

    // CREAR

    const guardarCancha = () => {

        const nuevas = [...canchas, formulario];

        setCanchas(nuevas);

        localStorage.setItem(
            "canchas",
            JSON.stringify(nuevas)
        );

        limpiarFormulario();

    };

    // EDITAR

    const editarCancha = (cancha, index) => {

        setFormulario(cancha);

        setIndice(index);

        setEditando(true);

        setMostrarModal(true);

    };

    // ACTUALIZAR

    const actualizarCancha = () => {

        const copia = [...canchas];

        copia[indice] = formulario;

        setCanchas(copia);

        localStorage.setItem(
            "canchas",
            JSON.stringify(copia)
        );

        limpiarFormulario();

    };

    // ELIMINAR

    const eliminarCancha = (index) => {

        if (!confirm("¿Eliminar esta cancha?"))
            return;

        const nuevas =
            canchas.filter((_, i) => i !== index);

        setCanchas(nuevas);

        localStorage.setItem(
            "canchas",
            JSON.stringify(nuevas)
        );

    };

    // LIMPIAR

    const limpiarFormulario = () => {

        setFormulario({
            nombre: "",
            tipo: "Fútbol 5",
            precio: "",
            estado: "Disponible",
            imagen: "",
        });

        setIndice(null);

        setEditando(false);

        setMostrarModal(false);

    };

    return (

        <div>

            {/* ENCABEZADO */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold text-gray-800">

                        Gestión de Canchas

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Administra todas las canchas deportivas.

                    </p>

                </div>

                <button

                    onClick={() => {

                        limpiarFormulario();

                        setMostrarModal(true);

                    }}

                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

                >

                    <FaPlus />

                    Nueva Cancha

                </button>

            </div>

            {/* BUSCADOR */}

            <div className="bg-white rounded-xl shadow p-5 mb-8 text-gray-700">

                <div className="flex items-center gap-3">

                    <FaSearch className="text-gray-400" />

                    <input

                        type="text"
                        placeholder="Buscar cancha..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }

                        className="w-full outline-none"

                    />

                </div>

            </div>

            {/* TABLA */}

            <div className="bg-white rounded-xl shadow overflow-hidden text-gray-700">

                <table className="w-full">

                    <thead className="bg-green-600 text-white">

                        <tr>

                            <th className="p-4 text-left">Imagen</th>

                            <th className="text-left">Nombre</th>

                            <th className="text-left">Tipo</th>

                            <th className="text-left">Precio</th>

                            <th className="text-left">Estado</th>

                            <th className="text-center">Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {canchas

                            .filter((c) =>

                                c.nombre
                                    .toLowerCase()
                                    .includes(busqueda.toLowerCase())

                            )

                            .map((cancha, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4">

                                        <img
                                            src={
                                                cancha.imagen ||
                                                "/images/cancha-default.jpg"
                                            }
                                            className="w-20 h-14 rounded-lg object-cover"
                                        />

                                    </td>

                                    <td>{cancha.nombre}</td>

                                    <td>{cancha.tipo}</td>

                                    <td>

                                        ${Number(cancha.precio).toLocaleString()}

                                    </td>

                                    <td>

                                        <span

                                            className={`px-3 py-1 rounded-full text-sm font-semibold

                                            ${cancha.estado === "Disponible"
                                                    ? "bg-green-100 text-green-700"

                                                    : cancha.estado === "Ocupada"

                                                        ? "bg-red-100 text-red-700"

                                                        : "bg-yellow-100 text-yellow-700"

                                                }

                                            `}

                                        >

                                            {cancha.estado}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="flex justify-center gap-3">

                                            <button

                                                onClick={() =>
                                                    editarCancha(
                                                        cancha,
                                                        index
                                                    )
                                                }

                                                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"

                                            >

                                                <FaEdit />

                                            </button>

                                            <button

                                                onClick={() =>
                                                    eliminarCancha(index)
                                                }

                                                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"

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

            {/* MODAL */}

            <CanchaModal

                mostrarModal={mostrarModal}

                setMostrarModal={setMostrarModal}

                formulario={formulario}

                setFormulario={setFormulario}

                guardarCancha={guardarCancha}

                actualizarCancha={actualizarCancha}

                editando={editando}

            />

        </div>

    );

}