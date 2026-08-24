"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaMedal,
  FaCamera,
} from "react-icons/fa";
import InputPerfil from "./InputPerfil";

export default function ModalEditarPerfil({
  isOpen,
  onClose,
  arbitro,
  onGuardar,
}) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    ciudad: "",
    categoria: "",
    foto: "",
  });

  useEffect(() => {
    if (arbitro) {
      setFormulario(arbitro);
    }
  }, [arbitro]);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = (e) => {
    e.preventDefault();
    onGuardar(formulario);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn">
        {/* HEADER */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Editar Perfil</h2>

            <p className="text-green-100">Actualiza tu información personal.</p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-2xl hover:rotate-90 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* FORMULARIO */}

        <form onSubmit={guardar} className="p-8 space-y-6">
          {/* FOTO */}

          <div className="flex flex-col items-center">
            <img
              src={formulario.foto}
              alt="Perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
            />

            <button
              type="button"
              className="mt-4 bg-slate-800 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-900"
            >
              <FaCamera />
              Cambiar Foto
            </button>
          </div>

          {/* INPUTS */}

          <div className="grid md:grid-cols-2 gap-6">
            <InputPerfil
              icon={<FaUser />}
              label="Nombre Completo"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
            />

            <InputPerfil
              icon={<FaEnvelope />}
              label="Correo"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
            />

           <InputPerfil
              icon={<FaPhone />}
              label="Teléfono"
              name="telefono"
              value={formulario.telefono}
              onChange={handleChange}
            />

           <InputPerfil
              icon={<FaMapMarkerAlt />}
              label="Ciudad"
              name="ciudad"
              value={formulario.ciudad}
              onChange={handleChange}
            />

          <InputPerfil
              icon={<FaMedal />}
              label="Categoría"
              name="categoria"
              value={formulario.categoria}
              onChange={handleChange}
            />
          </div>

          {/* BOTONES */}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <FaSave />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

