
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBullhorn,
} from "react-icons/fa";
import PromocionModal from "./PromocionModal";
import VerPromocionModal from "./VerPromocionModal";

const API_URL = "http://127.0.0.1:8000/api/publicaciones/";

const obtenerImagen = (ruta) => {
  if (!ruta) return "";
  if (ruta.startsWith("data:") || ruta.startsWith("http")) return ruta;
  return `http://127.0.0.1:8000/media/${ruta.replace(/^\/?media\//, "")}`;
};

export default function PromocionesComponent() {
  const [promociones, setPromociones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarPublicaciones = useCallback(async () => {
    try {
      setError("");

      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las publicaciones.");
      }

      const datos = await respuesta.json();

      setPromociones(
        datos.map((p) => ({
          ...p,
          id: p.id_publicacion,
          fecha: p.fecha_publicacion,
          imagen: obtenerImagen(p.imagen_url),
        }))
      );
    } catch (err) {
      setError(err.message || "Error al conectar con Django.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPublicaciones();
  }, [cargarPublicaciones]);

  const eliminarPromocion = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la publicación.");
      }

      setPromociones((actuales) =>
        actuales.filter((p) => p.id_publicacion !== id)
      );
    } catch (err) {
      alert(err.message || "Error al eliminar.");
    }
  };

  const publicacionesFiltradas = promociones.filter((p) =>
    p.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Noticias y Promociones
          </h1>
          <p className="text-gray-500 mt-1">
            Administra las publicaciones que verá el público.
          </p>
        </div>

        <button
          onClick={() => {
            setPromocionSeleccionada(null);
            setEditando(false);
            setMostrarModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Nueva publicación
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8 text-gray-700">
        <div className="flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar publicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
          <button
            onClick={cargarPublicaciones}
            className="ml-3 underline font-semibold"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden text-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-4 text-left">Imagen</th>
                <th className="p-4 text-left">Título</th>
                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-left">Fecha</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {publicacionesFiltradas.map((p) => (
                <tr
                  key={p.id_publicacion}
                  className="border-b hover:bg-gray-50"
                >
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

                  <td className="font-semibold">{p.titulo}</td>
                  <td>{p.tipo}</td>
                  <td>{p.fecha}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.estado === "Publicado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setPromocionSeleccionada(p);
                          setMostrarVer(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver publicación"
                      >
                        <FaEye size={19} />
                      </button>

                      <button
                        onClick={() => {
                          setPromocionSeleccionada(p);
                          setEditando(true);
                          setMostrarModal(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Editar"
                      >
                        <FaEdit size={19} />
                      </button>

                      <button
                        onClick={() => eliminarPromocion(p.id_publicacion)}
                        title="Eliminar publicación"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={19} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!cargando && publicacionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FaBullhorn className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">
                      No hay publicaciones para mostrar.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {cargando && (
            <p className="text-center py-8 text-gray-500">
              Cargando publicaciones...
            </p>
          )}
        </div>
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
        alGuardar={cargarPublicaciones}
      />

      <VerPromocionModal
        mostrarVer={mostrarVer}
        setMostrarVer={setMostrarVer}
        promocion={promocionSeleccionada}
      />
    </div>
  );
}
