"use client";

import { FaStar } from "react-icons/fa";

export default function PanelObservaciones({

  observaciones,
  setObservaciones,

  calificacion,
  setCalificacion

}) {

  return (

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      <label className="block text-base font-black text-slate-950 mb-2">

        📝 Observaciones y Novedades

      </label>

      <textarea

        rows="4"

        value={observaciones}

        onChange={(e) => setObservaciones(e.target.value)}

        placeholder="Reporta tarjetas directas, incidentes o conducta aquí..."

        className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-950 placeholder-slate-400 bg-slate-50 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none transition-all"

      />

      <label className="block text-base font-black text-slate-950 mt-5 mb-2">

        ⭐ Calificación del encuentro

      </label>

      <div className="flex gap-2 text-3xl">

        {[1, 2, 3, 4, 5].map((estrella) => (

          <button

            key={estrella}

            type="button"

            onClick={() => setCalificacion(estrella)}

            className="focus:outline-none transition transform hover:scale-110"

          >

            <FaStar

              className={

                estrella <= calificacion

                  ? "text-yellow-500"

                  : "text-slate-200"

              }

            />

          </button>

        ))}

      </div>

    </div>

  );

}