"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaImage } from "react-icons/fa";

export default function PromocionModal({
    mostrarModal,
    setMostrarModal,
    promociones,
    setPromociones,
    promocionSeleccionada,
    editando,
    setEditando,
}) {
    useEffect(() => {

        if (editando && promocionSeleccionada) {
            setFormulario(promocionSeleccionada);
            setPreview(promocionSeleccionada.imagen || "");
        }

    }, [editando, promocionSeleccionada]);

    const [formulario, setFormulario] = useState({
        id: "",
        titulo: "",
        descripcion: "",
        imagen: "",
        tipo: "Promoción",
        fecha: "",
        estado: "Publicado",
    });

    const [preview, setPreview] = useState("");

    const cambiarCampo = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value,
        });

    };

    const seleccionarImagen = (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;
        const lector = new FileReader();
        lector.onloadend = () => {
            setFormulario({
                ...formulario,
                imagen: lector.result,
            });
            setPreview(lector.result);
        };

        lector.readAsDataURL(archivo);

    };

    const guardarPublicacion = () => {

        if (!formulario.titulo.trim()) {
            alert("Escribe un título.");
            return;

        }

        if (!formulario.descripcion.trim()) {
            alert("Escribe una descripción.");
            return;

        }

        if (!formulario.fecha) {
            alert("Selecciona una fecha.");
            return;

        }

        let nuevasPromociones;

        if (editando) {

            nuevasPromociones = promociones.map((p) =>
                p.id === formulario.id
                    ? formulario
                    : p
            );

        } else {

            const nuevaPublicacion = {

                ...formulario,
                id: Date.now(),

            };

            nuevasPromociones = [
                ...promociones,
                nuevaPublicacion,
            ];

        }


        setPromociones(nuevasPromociones);

        localStorage.setItem(
            "promociones",
            JSON.stringify(nuevasPromociones)
        );

        setFormulario({

            id: "",
            titulo: "",
            descripcion: "",
            imagen: "",
            tipo: "Promoción",
            fecha: "",
            estado: "Publicado",

        });

        setPreview("");
        setMostrarModal(false);

    };

    if (!mostrarModal) return null;

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            {editando
                                ? "Editar Publicación"
                                : "Nueva Publicación"}

                        </h2>

                        <p className="text-gray-500">

                            Crea una noticia o promoción para el público.

                        </p>

                    </div>

                    <button
                        onClick={() => setMostrarModal(false)}
                        className="text-red-600 text-2xl"
                    >

                        <FaTimes />

                    </button>

                </div>

                {/* FORMULARIO */}

                <div className="p-6 space-y-5">

                    {/* TITULO */}

                    <div>

                        <label className="block font-semibold mb-2">

                            Título

                        </label>

                        <input
                            type="text"
                            name="titulo"
                            value={formulario.titulo}
                            onChange={cambiarCampo}
                            placeholder="Ej: ¡20% de descuento en tu reserva!"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                    </div>

                    {/* DESCRIPCIÓN */}

                    <div>

                        <label className="block font-semibold mb-2">

                            Descripción

                        </label>

                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={cambiarCampo}
                            rows="4"
                            placeholder="Escribe el contenido de la publicación..."
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                    </div>

                    {/* TIPO Y FECHA */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="block font-semibold mb-2">

                                Tipo

                            </label>

                            <select
                                name="tipo"
                                value={formulario.tipo}
                                onChange={cambiarCampo}
                                className="w-full border rounded-xl p-3"
                            >

                                <option value="Promoción">
                                    Promoción
                                </option>

                                <option value="Noticia">
                                    Noticia
                                </option>

                                <option value="Anuncio">
                                    Anuncio
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="block font-semibold mb-2">

                                Fecha

                            </label>

                            <input
                                type="date"
                                name="fecha"
                                value={formulario.fecha}
                                onChange={cambiarCampo}
                                className="w-full border rounded-xl p-3"
                            />

                        </div>

                    </div>

                    {/* ESTADO */}

                    <div>

                        <label className="block font-semibold mb-2">

                            Estado

                        </label>

                        <select
                            name="estado"
                            value={formulario.estado}
                            onChange={cambiarCampo}
                            className="w-full border rounded-xl p-3"
                        >

                            <option value="Publicado">
                                Publicado
                            </option>

                            <option value="Borrador">
                                Borrador
                            </option>

                        </select>

                    </div>

                    {/* IMAGEN */}

                    <div>

                        <label className="block font-semibold mb-2">

                            Imagen

                        </label>

                        <label className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

                            <FaImage className="text-gray-400 text-3xl mb-2" />

                            <span className="text-gray-500">

                                Seleccionar imagen

                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={seleccionarImagen}
                                className="hidden"
                            />

                        </label>

                        {/* PREVISUALIZACIÓN */}

                        {preview && (

                            <div className="mt-4">

                                <img
                                    src={preview}
                                    alt="Vista previa"
                                    className="w-full h-48 object-cover rounded-xl"
                                />

                            </div>

                        )}

                    </div>

                </div>

                {/* FOOTER */}

                <div className="border-t p-6 flex justify-end gap-4">

                    <button
                        onClick={() => setMostrarModal(false)}
                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
                    >

                        Cancelar

                    </button>

                    <button
                        onClick={guardarPublicacion}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >

                        {editando ? "Guardar cambios" : "Publicar"}

                    </button>

                </div>

            </div>

        </div>

    );
}