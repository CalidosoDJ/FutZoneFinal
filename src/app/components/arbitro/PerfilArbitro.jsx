"use client";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaStar,
  FaMedal,
  FaCalendarAlt,
  FaFutbol,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { useState } from "react";

import InfoItem from "./InfoItem";
import CardDato from "./CardDato";
import { useArbitro } from "@/app/context/ArbitroContext";

export default function PerfilArbitro() {

  const { arbitro, actualizarArbitro } = useArbitro();

  const [editando, setEditando] = useState(false);

  const [datos, setDatos] = useState(arbitro);


  const abrirEdicion = () => {

    setDatos(arbitro);

    setEditando(true);

  };


  const manejarCambio = (e) => {

    const { name, value } = e.target;

    setDatos((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));

  };


  const guardarCambios = (e) => {

    e.preventDefault();

    actualizarArbitro(datos);

    setEditando(false);

  };


  return (

    <>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
        

        {/* Encabezado */}

        <div className="h-40 bg-gradient-to-r from-green-600 to-emerald-500"></div>


        <div className="px-8 pb-8">

          {/* Foto */}

          <div className="-mt-16 flex flex-col items-center">

            <img
              src={arbitro.foto}
              alt={arbitro.nombre}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />


            <h2 className="text-3xl font-bold mt-4 text-slate-800">

              {arbitro.nombre}

            </h2>


            <p className="text-gray-500">

              {arbitro.categoria}

            </p>


            {/* BOTÓN EDITAR */}

            <button
              type="button"
              onClick={abrirEdicion}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >

              <FaEdit />

              Editar Perfil

            </button>

          </div>


          {/* Información */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            <InfoItem
              icon={<FaEnvelope />}
              titulo="Correo Electrónico"
              valor={arbitro.correo}
            />

            <InfoItem
              icon={<FaPhoneAlt />}
              titulo="Teléfono"
              valor={arbitro.telefono}
            />

            <InfoItem
              icon={<FaMapMarkerAlt />}
              titulo="Ciudad"
              valor={arbitro.ciudad}
            />

            <InfoItem
              icon={<FaCalendarAlt />}
              titulo="Fecha de ingreso"
              valor={arbitro.ingreso}
            />

          </div>


          {/* Estadísticas */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <CardDato
              icon={<FaFutbol />}
              titulo="Partidos Arbitrados"
              valor={arbitro.partidosDirigidos}
              color="text-green-600"
            />

            <CardDato
              icon={<FaStar />}
              titulo="Calificación"
              valor={arbitro.calificacion}
              color="text-yellow-500"
            />

            <CardDato
              icon={<FaMedal />}
              titulo="Categoría"
              valor={arbitro.categoria}
              color="text-blue-600"
            />

          </div>

        </div>

      </section>


      {/* ================= MODAL EDITAR PERFIL ================= */}

      {editando && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

            {/* Encabezado del modal */}

            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6 flex justify-between items-center">

              <div>

                <h2 className="text-2xl md:text-3xl font-black text-white">

                  Editar perfil

                </h2>

                <p className="text-green-100 mt-1">

                  Actualiza tu información personal.

                </p>

              </div>


              <button
                type="button"
                onClick={() => setEditando(false)}
                className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-500 flex items-center justify-center transition"
              >

                <FaTimes />

              </button>

            </div>


            {/* Formulario */}

            <form
              onSubmit={guardarCambios}
              className="p-6 md:p-8"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* Nombre */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-bold text-gray-700 mb-2">

                    Nombre completo

                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={datos.nombre || ""}
                    onChange={manejarCambio}
                    className="w-full border text-gray-700 border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>


                {/* Correo */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">

                    Correo electrónico

                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={datos.correo || ""}
                    onChange={manejarCambio}
                    className="w-full border text-gray-700 border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>


                {/* Teléfono */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">

                    Teléfono

                  </label>

                  <input
                    type="text"
                    name="telefono"
                    value={datos.telefono || ""}
                    onChange={manejarCambio}
                    className="w-full border text-gray-700 border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>


                {/* Ciudad */}

                <div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">

                    Ciudad

                  </label>

                  <input
                    type="text"
                    name="ciudad"
                    value={datos.ciudad || ""}
                    onChange={manejarCambio}
                    className="w-full text-gray-700 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>


                


              </div>


              {/* Botones */}

              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-200">

                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >

                  Cancelar

                </button>


                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                >

                  <FaSave />

                  Guardar cambios

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>

  );

}