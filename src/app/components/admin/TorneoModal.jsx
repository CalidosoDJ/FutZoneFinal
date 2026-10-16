"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes, FaImage } from "react-icons/fa";

export default function TorneoModal({
    mostrarModal,
    setMostrarModal,
    formulario,
    setFormulario,
    torneos,
    setTorneos,
    editando,
    setEditando,
}) {
    const [preview, setPreview] = useState("");

    useEffect(() => {
        setPreview(formulario.imagen || "");
    }, [formulario.imagen]);

    if (!mostrarModal) return null;

    const cargarImagen = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setFormulario({
                ...formulario,
                imagen: reader.result,
            });
        };
        reader.readAsDataURL(archivo);
    };

    const guardarTorneo = () => {
        if (!formulario.nombre.trim()) {
            alert("Por favor ingresa un nombre para el torneo");
            return;
        }

        let nuevosTorneos = [];

        if (editando) {
            nuevosTorneos = torneos.map((t) =>
                t.id === formulario.id ? formulario : t
            );
        } else {
            const nuevoTorneo = {
                ...formulario,
                id: formulario.id || Date.now().toString(),
                equiposMaximos: Number(formulario.equipos) || 0,
                equipos: Array.isArray(formulario.equipos) ? formulario.equipos : [],
                resultados: {},
            };
            nuevosTorneos = [...torneos, nuevoTorneo];
        }

        setTorneos(nuevosTorneos);
        localStorage.setItem("torneos", JSON.stringify(nuevosTorneos));

        // Limpiar formulario y cerrar modal
        setFormulario({
            id: "",
            nombre: "",
            descripcion: "",
            imagen: "",
            tipo: "Fútbol 5",
            fechaInicio: "",
            fechaFin: "",
            equipos: "",
            inscripcion: "",
            premio: "",
            estado: "Activo",
        });

        setPreview("");
        setEditando(false);
        setMostrarModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-gray-700 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {editando ? "Editar Torneo" : "Nuevo Torneo"}
                    </h2>
                    <button onClick={() => setMostrarModal(false)}>
                        <FaTimes
                            size={24}
                            className="text-red-600 hover:scale-110 duration-300 cursor-pointer"
                        />
                    </button>
                </div>

                {/* Body scrollable */}
                <div className="p-8 space-y-6 overflow-y-auto max-h-[72vh]">
                    {/* Previsualización de Imagen */}
                    <div className="flex justify-center mb-6">
                        <div className="w-72 h-44 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex justify-center items-center bg-gray-100">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    width={400}
                                    height={250}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <FaImage
                                        size={45}
                                        className="mx-auto text-gray-400"
                                    />
                                    <p className="text-gray-500 mt-2">
                                        Vista previa
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Imagen */}
                    <div>
                        <label className="font-semibold block">Imagen del Torneo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={cargarImagen}
                            className="w-full border rounded-xl p-3 mt-2"
                        />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="font-semibold block">Nombre</label>
                        <input
                            type="text"
                            value={formulario.nombre}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    nombre: e.target.value,
                                })
                            }
                            className="w-full border rounded-xl p-3 mt-2"
                            placeholder="Ej: Torneo Relámpago FutZone"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="font-semibold block">Descripción</label>
                        <textarea
                            rows="3"
                            value={formulario.descripcion}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    descripcion: e.target.value,
                                })
                            }
                            className="w-full border rounded-xl p-3 mt-2"
                            placeholder="Detalles sobre las reglas y formato"
                        />
                    </div>

                    {/* Tipo y Equipos Máximos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="font-semibold block">Tipo</label>
                            <select
                                value={formulario.tipo}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        tipo: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2 bg-white"
                            >
                                <option>Fútbol 5</option>
                                <option>Fútbol 7</option>
                                <option>Fútbol 8</option>
                                <option>Fútbol 11</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-semibold block">Equipos Máximos</label>
                            <input
                                type="number"
                                value={formulario.equipos}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        equipos: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2"
                                placeholder="16"
                            />
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="font-semibold block">Fecha Inicio</label>
                            <input
                                type="date"
                                value={formulario.fechaInicio}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        fechaInicio: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold block">Fecha Fin</label>
                            <input
                                type="date"
                                value={formulario.fechaFin}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        fechaFin: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2"
                            />
                        </div>
                    </div>

                    {/* Inscripción y Premio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="font-semibold block">Valor Inscripción ($)</label>
                            <input
                                type="number"
                                placeholder="70000"
                                value={formulario.inscripcion}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        inscripcion: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold block">Premio</label>
                            <input
                                type="text"
                                placeholder="$1.000.000 + Trofeo"
                                value={formulario.premio}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        premio: e.target.value,
                                    })
                                }
                                className="w-full border rounded-xl p-3 mt-2"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="font-semibold block">Estado</label>
                        <select
                            value={formulario.estado}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    estado: e.target.value,
                                })
                            }
                            className="w-full border rounded-xl p-3 mt-2 bg-white"
                        >
                            <option>Activo</option>
                            <option>Próximo</option>
                            <option>En Curso</option>
                            <option>Finalizado</option>
                            <option>Cancelado</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button
                            onClick={() => {
                                setMostrarModal(false);
                                setEditando(false);
                            }}
                            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={guardarTorneo}
                            className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-pointer"
                        >
                            {editando ? "Actualizar Torneo" : "Guardar Torneo"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}