
"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaImage } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/publicaciones/";

const FORMULARIO_INICIAL = {
  titulo: "",
  descripcion: "",
  imagen: null,
  tipo: "Promoción",
  fecha: "",
  estado: "Publicado",
};

export default function PromocionModal({
  mostrarModal,
  setMostrarModal,
  promocionSeleccionada,
  editando,
  setEditando,
  alGuardar,
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [preview, setPreview] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mostrarModal) return;

    if (editando && promocionSeleccionada) {
      setFormulario({
        titulo: promocionSeleccionada.titulo || "",
        descripcion: promocionSeleccionada.descripcion || "",
        imagen: null,
        tipo: promocionSeleccionada.tipo || "Promoción",
        fecha:
          promocionSeleccionada.fecha_publicacion ||
          promocionSeleccionada.fecha ||
          "",
        estado: promocionSeleccionada.estado || "Publicado",
      });

      setPreview(
        promocionSeleccionada.imagen ||
          (promocionSeleccionada.imagen_url
            ? promocionSeleccionada.imagen_url.startsWith("http")
              ? promocionSeleccionada.imagen_url
              : `http://127.0.0.1:8000/media/${promocionSeleccionada.imagen_url.replace(/^\/?media\//, "")}`
            : "")
      );
    } else {
      setFormulario(FORMULARIO_INICIAL);
      setPreview("");
    }

    setError("");
  }, [mostrarModal, editando, promocionSeleccionada]);

  const cambiarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setFormulario((actual) => ({ ...actual, imagen: archivo }));
    setPreview(URL.createObjectURL(archivo));
  };

  const guardarPublicacion = async () => {
    if (!formulario.titulo.trim()) {
      setError("Escribe un título.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      setError("Escribe una descripción.");
      return;
    }

    if (!formulario.fecha) {
      setError("Selecciona una fecha.");
      return;
    }

    const datos = new FormData();
    datos.append("titulo", formulario.titulo.trim());
    datos.append("descripcion", formulario.descripcion.trim());
    datos.append("tipo", formulario.tipo);
    datos.append("fecha_publicacion", formulario.fecha);
    datos.append("estado", formulario.estado);

    if (formulario.imagen) {
      datos.append("imagen", formulario.imagen);
    } else if (
      editando &&
      promocionSeleccionada?.imagen_url
    ) {
      datos.append("imagen_url", promocionSeleccionada.imagen_url);
    }

    try {
      setGuardando(true);
      setError("");

      const url = editando
        ? `${API_URL}${promocionSeleccionada.id_publicacion || promocionSeleccionada.id}/`
        : API_URL;

      const respuesta = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        body: datos,
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(
          `Django respondió ${respuesta.status}: ${detalle.slice(0, 500)}`
        );
      }

      await respuesta.json();

      await alGuardar?.();

      setFormulario(FORMULARIO_INICIAL);
      setPreview("");
      setMostrarModal(false);
      setEditando(false);
    } catch (err) {
      setError(err.message || "No se pudo guardar la publicación.");
    } finally {
      setGuardando(false);
    }
  };

  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editando ? "Editar publicación" : "Nueva publicación"}
            </h2>
            <p className="text-gray-500">
              Crea una noticia o promoción para el público.
            </p>
          </div>

          <button
            onClick={() => setMostrarModal(false)}
            className="text-red-600 text-2xl"
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-red-700 break-words">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={formulario.titulo}
              onChange={cambiarCampo}
              placeholder="Ej: ¡20% de descuento en tu reserva!"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={cambiarCampo}
              rows={4}
              placeholder="Escribe el contenido de la publicación..."
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-semibold mb-2">Tipo</label>
              <select
                name="tipo"
                value={formulario.tipo}
                onChange={cambiarCampo}
                className="w-full border rounded-xl p-3"
              >
                <option value="Promoción">Promoción</option>
                <option value="Noticia">Noticia</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={cambiarCampo}
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Estado</label>
            <select
              name="estado"
              value={formulario.estado}
              onChange={cambiarCampo}
              className="w-full border rounded-xl p-3"
            >
              <option value="Publicado">Publicado</option>
              <option value="Borrador">Borrador</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Imagen</label>
            <label className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <FaImage className="text-gray-400 text-3xl mb-2" />
              <span className="text-gray-500">Seleccionar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={seleccionarImagen}
                className="hidden"
              />
            </label>

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

        <div className="border-t p-6 flex justify-end gap-4">
          <button
            onClick={() => setMostrarModal(false)}
            disabled={guardando}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={guardarPublicacion}
            disabled={guardando}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : editando
                ? "Guardar cambios"
                : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
