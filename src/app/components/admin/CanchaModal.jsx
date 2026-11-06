
"use client";

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
        setPreview(formulario.imagen || "");
    }, [formulario.imagen]);

    const cargarImagen = (e) => {
        const archivo = e.target.files?.[0];

        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona un archivo de imagen válido.");
            e.target.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            alert("La imagen no puede superar los 5 MB.");
            e.target.value = "";
            return;
        }

        setFormulario((anterior) => ({
            ...anterior,
            imagenArchivo: archivo,
        }));

        setPreview(URL.createObjectURL(archivo));
    };

    if (!mostrarModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 text-gray-700">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-green-600 px-8 py-5 text-white">
                    <h2 className="text-2xl font-bold">
                        {editando ? "Editar Cancha" : "Registrar Cancha"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => setMostrarModal(false)}
                        aria-label="Cerrar"
                    >
                        <FaTimes size={22} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-8 flex justify-center">
                        <div className="h-40 w-64 overflow-hidden rounded-2xl border">
                            <img
                                src={preview || "/images/cancha2.jpg"}
                                alt="Vista previa de la cancha"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="font-semibold">
                            Imagen de la cancha
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={cargarImagen}
                            className="mt-2 w-full rounded-xl border p-3"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="font-semibold">Nombre</label>
                        <input
                            type="text"
                            value={formulario.nombre}
                            onChange={(e) =>
                                setFormulario((anterior) => ({
                                    ...anterior,
                                    nombre: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-xl border p-3"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="font-semibold">Tipo</label>
                            <select
                                value={formulario.tipo}
                                onChange={(e) =>
                                    setFormulario((anterior) => ({
                                        ...anterior,
                                        tipo: e.target.value,
                                    }))
                                }
                                className="mt-2 w-full rounded-xl border p-3"
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
                                min="0"
                                value={formulario.precio}
                                onChange={(e) =>
                                    setFormulario((anterior) => ({
                                        ...anterior,
                                        precio: e.target.value,
                                    }))
                                }
                                className="mt-2 w-full rounded-xl border p-3"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="font-semibold">Estado</label>
                        <select
                            value={formulario.estado}
                            onChange={(e) =>
                                setFormulario((anterior) => ({
                                    ...anterior,
                                    estado: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-xl border p-3"
                        >
                            <option>Disponible</option>
                            <option>Ocupada</option>
                            <option>Mantenimiento</option>
                        </select>
                    </div>

                    <div className="mt-10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setMostrarModal(false)}
                            className="rounded-xl bg-gray-300 px-6 py-3 hover:bg-gray-400"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={editando ? actualizarCancha : guardarCancha}
                            className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                        >
                            {editando ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
