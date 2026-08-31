"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaBullhorn } from "react-icons/fa";
import PromocionModal from "./PromocionModal";
import VerPromocionModal from "./VerPromocionModal";

export default function PromocionesComponent() {

    const [promociones, setPromociones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
    const [mostrarVer, setMostrarVer] = useState(false);
    const [editando, setEditando] = useState(false);

    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("promociones")) || [];

        setPromociones(datos);

    }, []);

    const eliminarPromocion = (id) => {

        const confirmar = window.confirm(
            "¿Seguro que quieres eliminar esta publicación?"
        );

        if (!confirmar) return;

        const nuevasPromociones = promociones.filter(
            (p) => p.id !== id
        );

        setPromociones(nuevasPromociones);

        localStorage.setItem(
            "promociones",
            JSON.stringify(nuevasPromociones)
        );
    };

    return (

        <div>

            {/* ENCABEZADO */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-4xl font-bold text-gray-800">
                        Noticias y Promociones
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Administra las publicaciones que verá el público.
                    </p>

                </div>

                <button onClick={() => setMostrarModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >

                    <FaPlus />

                    Nueva publicación

                </button>

            </div>

            {/* BUSCADOR */}

            <div className="bg-white rounded-xl shadow p-5 mb-8 text-gray-700">

                <div className="flex items-center gap-3">

                    <FaSearch className="text-gray-400" />

                    <input
                        type="text"
                        placeholder="Buscar publicación..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                        className="w-full outline-none"
                    />

                </div>

            </div>

            {/* TABLA */}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-gray-700 text-justify-center">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-600 text-white text-justify-center">

                                <th className="p-4 text-left">
                                    Imagen
                                </th>

                                <th className="text-left">
                                    Título
                                </th>

                                <th className="text-left">
                                    Tipo
                                </th>

                                <th className="text-left">
                                    Fecha
                                </th>

                                <th className="text-left">
                                    Estado
                                </th>

                                <th className="text-center">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {promociones
                                .filter((p) =>
                                    p.titulo
                                        ?.toLowerCase()
                                        .includes(
                                            busqueda.toLowerCase()
                                        )
                                )
                                .map((p, index) => (

                                    <tr
                                        key={p.id || index}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        {/* IMAGEN */}

                                        <td className="p-4">

                                            {p.imagen ? (

                                                <img
                                                    src={p.imagen}
                                                    alt={p.titulo}
                                                    className="w-20 h-14 object-cover rounded-lg"
                                                />

                                            ) : (

                                                <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center">

                                                    <FaBullhorn className="text-gray-400" />

                                                </div>

                                            )}

                                        </td>

                                        {/* TITULO */}

                                        <td className="font-semibold">

                                            {p.titulo}

                                        </td>

                                        {/* TIPO */}

                                        <td>

                                            {p.tipo}

                                        </td>

                                        {/* FECHA */}

                                        <td>

                                            {p.fecha}

                                        </td>

                                        {/* ESTADO */}

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${p.estado === "Publicado"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >

                                                {p.estado}

                                            </span>

                                        </td>

                                        {/* ACCIONES */}

                                        <td>

                                            <div className="flex justify-center gap-4">

                                                <button onClick={() => {
                                                    setPromocionSeleccionada(p);
                                                    setMostrarVer(true);
                                                }} className="text-blue-600 hover:text-blue-800"
                                                    title="Ver publicacion"
                                                >

                                                    <FaEye size={19} />

                                                </button>

                                                <button onClick={() => {
                                                    setPromocionSeleccionada(p);
                                                    setEditando(true);
                                                    setMostrarModal(true);
                                                }} className="text-yellow-500 hover:text-yellow-700"
                                                    title="Editar"
                                                >

                                                    <FaEdit size={19} />

                                                </button>

                                                <button onClick={() => eliminarPromocion(p.id)}
                                                    title="Eliminar publicación"
                                                    className="text-red-600 hover:text-red-800">

                                                    <FaTrash size={19} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                        </tbody>

                    </table>

                </div>

                {/* SIN PUBLICACIONES */}

                {promociones.length === 0 && (

                    <div className="text-center py-12">

                        <FaBullhorn className="text-gray-300 text-5xl mx-auto mb-4" />

                        <p className="text-gray-500">

                            No hay publicaciones todavía.

                        </p>

                    </div>

                )}

            </div>

            <PromocionModal
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                promociones={promociones}
                setPromociones={setPromociones}
                promocionSeleccionada={promocionSeleccionada}
                setPromocionSeleccionada={setPromocionSeleccionada}
                editando={editando}
                setEditando={setEditando}
            />
            <VerPromocionModal
                mostrarVer={mostrarVer}
                setMostrarVer={setMostrarVer}
                promocion={promocionSeleccionada}
            />

        </div>

    );
}