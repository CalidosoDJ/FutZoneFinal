"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function CanchaModal({

    mostrarModal,
    setMostrarModal,

    formulario,
    setFormulario,

    guardarCancha,
    actualizarCancha,

    editando,

}) {

    const [preview, setPreview] = useState("");

     useEffect(() => {
        setPreview(formulario.imagen);
    }, [formulario.imagen]);

    const cargarImagen = (e) => {

        const archivo = e.target.files[0];

        if (!archivo) return;

        const reader = new FileReader();

        reader.onload = () => {

            setPreview(reader.result);

            setFormulario({
                ...formulario,
                imagen: reader.result,
            });

        };

        reader.readAsDataURL(archivo);

    };

    if (!mostrarModal) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">

                {/* Header */}

                <div className="bg-green-600 text-white px-8 py-5 flex justify-between items-center">

                    <h2 className="text-2xl font-bold">

                        {editando ? "Editar Cancha" : "Registrar Cancha"}

                    </h2>

                    <button
                        onClick={() => setMostrarModal(false)}
                    >
                        <FaTimes size={22} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-8">

                    {/* Vista previa */}

                    <div className="flex justify-center mb-8">

                        <div className="relative w-64 h-40 rounded-2xl overflow-hidden border">

                            <img
                                src={preview || "/images/cancha2.jpg"
                                }
                                alt="Cancha"
                               
                                className="object-cover rounded-x1"
                            />

                        </div>

                    </div>

                    {/* Imagen */}

                    <div className="mb-5">

                        <label className="font-semibold">

                            URL Imagen

                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            value={cargarImagen}
                            onChange={cargarImagen}
                            className="w-full mt-2 border rounded-xl p-3"

                        />

                    </div>

                    {/* Nombre */}

                    <div className="mb-5">

                        <label className="font-semibold">

                            Nombre

                        </label>

                        <input

                            type="text"

                            value={formulario.nombre}

                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    nombre: e.target.value,
                                })
                            }

                            className="w-full mt-2 border rounded-xl p-3"

                        />

                    </div>

                    {/* Tipo y Precio */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-semibold">

                                Tipo

                            </label>

                            <select

                                value={formulario.tipo}

                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        tipo: e.target.value,
                                    })
                                }

                                className="w-full mt-2 border rounded-xl p-3"

                            >

                                <option>Fútbol 5</option>

                                <option>Fútbol 8</option>

                                <option>Fútbol 11</option>

                            </select>

                        </div>

                        <div>

                            <label className="font-semibold">

                                Precio por hora

                            </label>

                            <input

                                type="number"

                                value={formulario.precio}

                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        precio: e.target.value,
                                    })
                                }

                                className="w-full mt-2 border rounded-xl p-3"

                            />

                        </div>

                    </div>

                    {/* Estado */}

                    <div className="mt-5">

                        <label className="font-semibold">

                            Estado

                        </label>

                        <select

                            value={formulario.estado}

                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    estado: e.target.value,
                                })
                            }

                            className="w-full mt-2 border rounded-xl p-3"

                        >

                            <option>Disponible</option>

                            <option>Ocupada</option>

                            <option>Mantenimiento</option>

                        </select>

                    </div>

                    {/* Botones */}

                    <div className="flex justify-end gap-4 mt-10">

                        <button

                            onClick={() =>
                                setMostrarModal(false)
                            }

                            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"

                        >

                            Cancelar

                        </button>

                        <button

                            onClick={
                                editando
                                    ? actualizarCancha
                                    : guardarCancha
                            }

                            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"

                        >

                            {editando
                                ? "Actualizar"
                                : "Guardar"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}