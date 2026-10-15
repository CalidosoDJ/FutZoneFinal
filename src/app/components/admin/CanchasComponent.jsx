
"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import CanchaModal from "./CanchaModal";

const API = "http://127.0.0.1:8000/api/canchas/";

export default function CanchasComponent() {
    const [canchas, setCanchas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [indice, setIndice] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [formulario, setFormulario] = useState({
        nombre: "",
        tipo: "Fútbol 5",
        precio: "",
        estado: "Disponible",
        imagen: "",
    });

    // CONSULTAR CANCHAS EN DJANGO
    const cargarCanchas = async () => {
        try {
            setError("");

            const respuesta = await fetch(API);

            if (!respuesta.ok) {
                throw new Error("No se pudieron consultar las canchas.");
            }

            const datos = await respuesta.json();

            setCanchas(datos.map((cancha) => ({
                id_cancha: cancha.id_cancha,
                nombre: cancha.nombre,
                tipo: Number(cancha.id_tipo) === 1
                    ? "Cancha sintética"
                    : `Tipo ${cancha.id_tipo}`,
                precio: Number(cancha.precio_hora),
                estado: cancha.estado || "Disponible",
                imagen: "",
                id_sede: Number(cancha.id_sede),
                id_tipo: Number(cancha.id_tipo),
            })));
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCanchas();
    }, []);

    // LIMPIAR FORMULARIO
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

    // CREAR CANCHA
    const guardarCancha = async () => {
        try {
            setError("");

            if (!formulario.nombre.trim() || formulario.precio === "") {
                setError("Ingresa el nombre y el precio de la cancha.");
                return;
            }

            const datos = {
                nombre: formulario.nombre.trim(),
                precio_hora: Number(formulario.precio),
                estado: formulario.estado,
                id_sede: 1,
                id_tipo: 1,
            };

            const respuesta = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });

            if (!respuesta.ok) {
                const detalle = await respuesta.json();
                throw new Error(JSON.stringify(detalle));
            }

            await cargarCanchas();
            limpiarFormulario();
        } catch (err) {
            setError("Error al registrar la cancha: " + err.message);
        }
    };

    // ABRIR EDICIÓN
    const editarCancha = (cancha) => {
        setFormulario({
            nombre: cancha.nombre,
            tipo: cancha.tipo,
            precio: String(cancha.precio),
            estado: cancha.estado,
            imagen: cancha.imagen || "",
        });

        setIndice(cancha.id_cancha);
        setEditando(true);
        setMostrarModal(true);
    };

    // ACTUALIZAR CANCHA
    const actualizarCancha = async () => {
        try {
            setError("");

            if (!formulario.nombre.trim() || formulario.precio === "") {
                setError("Ingresa el nombre y el precio de la cancha.");
                return;
            }

            const datos = {
                nombre: formulario.nombre.trim(),
                precio_hora: Number(formulario.precio),
                estado: formulario.estado,
                id_sede: 1,
                id_tipo: 1,
            };

            const respuesta = await fetch(`${API}${indice}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });

            if (!respuesta.ok) {
                const detalle = await respuesta.json();
                throw new Error(JSON.stringify(detalle));
            }

            await cargarCanchas();
            limpiarFormulario();
        } catch (err) {
            setError("Error al actualizar la cancha: " + err.message);
        }
    };

    // ELIMINAR CANCHA
    const eliminarCancha = async (id) => {
        if (!confirm("¿Eliminar esta cancha de la base de datos?")) {
            return;
        }

        try {
            setError("");

            const respuesta = await fetch(`${API}${id}/`, {
                method: "DELETE",
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo eliminar la cancha.");
            }

            await cargarCanchas();
        } catch (err) {
            setError("Error al eliminar la cancha: " + err.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Gestión de Canchas
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Administra las canchas registradas en FutZone.
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

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5 break-words">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow p-5 mb-8 text-gray-700">
                <div className="flex items-center gap-3">
                    <FaSearch className="text-gray-400" />

                    <input
                        type="text"
                        placeholder="Buscar cancha..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto text-gray-700">
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
                        {cargando ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center">
                                    Cargando canchas...
                                </td>
                            </tr>
                        ) : canchas.filter((cancha) =>
                            cancha.nombre.toLowerCase().includes(
                                busqueda.toLowerCase()
                            )
                        ).length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center">
                                    No hay canchas para mostrar.
                                </td>
                            </tr>
                        ) : (
                            canchas
                                .filter((cancha) =>
                                    cancha.nombre.toLowerCase().includes(
                                        busqueda.toLowerCase()
                                    )
                                )
                                .map((cancha) => (
                                    <tr
                                        key={cancha.id_cancha}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            <img
                                                src={
                                                    cancha.imagen ||
                                                    "/images/cancha-default.jpg"
                                                }
                                                alt={cancha.nombre}
                                                className="w-20 h-14 rounded-lg object-cover"
                                            />
                                        </td>

                                        <td className="pr-3">{cancha.nombre}</td>
                                        <td className="pr-3">{cancha.tipo}</td>

                                        <td className="pr-3">
                                            ${cancha.precio.toLocaleString("es-CO")}
                                        </td>

                                        <td className="pr-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                cancha.estado === "Disponible"
                                                    ? "bg-green-100 text-green-700"
                                                    : cancha.estado === "Ocupada"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {cancha.estado}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex justify-center gap-3 p-3">
                                                <button
                                                    onClick={() => editarCancha(cancha)}
                                                    title="Editar cancha"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => eliminarCancha(cancha.id_cancha)}
                                                    title="Eliminar cancha"
                                                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>

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
