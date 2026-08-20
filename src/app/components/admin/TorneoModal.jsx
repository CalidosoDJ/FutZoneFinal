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

        if (editando) {

            const nuevos = torneos.map((t) =>

                t.id === formulario.id ? formulario : t);

            setTorneos(nuevos);
            localStorage.setItem("torneos", JSON.stringify(nuevos));
        }

        else {

            setTorneos([

                ...torneos,

                {

                    ...formulario,

                    id: Date.now(),

                    equiposMaximos: Number(formulario.equipos),

                    equipos: [],

                    resultados: {},

                },

            ]);

        }

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

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold text-gray-800">

                        {editando ? "Editar Torneo" : "Nuevo Torneo"}

                    </h2>

                    <button
                        onClick={() => setMostrarModal(false)}
                    >

                        <FaTimes
                            size={24}
                            className="text-red-600 hover:scale-110 duration-300"
                        />

                    </button>

                </div>

                <div className="p-8 space-y-6 overflow-y-auto max-h-[72vh]"></div>


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

                <div>

                    <label className="font-semibold">

                        Imagen del Torneo

                    </label>

                    <input

                        type="file"

                        accept="image/*"

                        onChange={cargarImagen}

                        className="w-full border rounded-xl p-3 mt-2"

                    />

                </div>
                <div>

                    <label className="font-semibold">

                        Nombre

                    </label>

                    <input

                        type="text"

                        value={formulario.nombre}

                        onChange={(e) =>

                            setFormulario({

                                ...formulario,

                                nombre: e.target.value

                            })

                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    />

                </div>

                <div>

                    <label className="font-semibold">

                        Descripción

                    </label>

                    <textarea

                        rows="4"

                        value={formulario.descripcion}

                        onChange={(e) =>

                            setFormulario({

                                ...formulario,

                                descripcion: e.target.value

                            })

                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    />

                </div>

                <div className="grid grid-cols-2 gap-5">

                    <div>

                        <label className="font-semibold">

                            Tipo

                        </label>

                        <select

                            value={formulario.tipo}

                            onChange={(e) =>

                                setFormulario({

                                    ...formulario,

                                    tipo: e.target.value

                                })

                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        >

                            <option>Fútbol 5</option>

                            <option>Fútbol 7</option>

                            <option>Fútbol 8</option>

                            <option>Fútbol 11</option>

                        </select>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Equipos Máximos

                        </label>

                        <input

                            type="number"

                            value={formulario.equipos}

                            onChange={(e) =>

                                setFormulario({

                                    ...formulario,

                                    equipos: e.target.value

                                })

                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                </div>

                {/* Fechas */}

                <div className="grid grid-cols-2 gap-5">

                    <div>

                        <label className="font-semibold">

                            Fecha Inicio

                        </label>

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

                        <label className="font-semibold">

                            Fecha Fin

                        </label>

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

                <div className="grid grid-cols-2 gap-5">

                    <div>

                        <label className="font-semibold">

                            Valor Inscripción

                        </label>

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

                        <label className="font-semibold">

                            Premio

                        </label>

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

                <div>

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

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option>Activo</option>

                        <option>Próximo</option>

                        <option>En Curso</option>

                        <option>Finalizado</option>

                        <option>Cancelado</option>

                    </select>

                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">

                    <button

                        onClick={() => {

                            setMostrarModal(false);

                            setEditando(false);

                        }}

                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"

                    >

                        Cancelar

                    </button>

                    <button

                        onClick={guardarTorneo}

                        className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"

                    >

                        {editando ? "Actualizar Torneo" : "Guardar Torneo"}

                    </button>

                </div>

            </div>

        </div>

    );
}