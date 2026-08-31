"use client";

import { FaTimes } from "react-icons/fa";

export default function VerPromocionModal({
    mostrarVer,
    setMostrarVer,
    promocion,
}) {

    if (!mostrarVer || !promocion) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">
                            {promocion.titulo}
                        </h2>

                        <p className="text-gray-500">
                            {promocion.tipo} · {promocion.fecha}
                        </p>

                    </div>

                    <button
                        onClick={() => setMostrarVer(false)}
                        className="text-red-600 text-2xl"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* CONTENIDO */}

                <div className="p-6">

                    {promocion.imagen && (

                        <img
                            src={promocion.imagen}
                            alt={promocion.titulo}
                            className="w-full h-64 object-cover rounded-2xl mb-6"
                        />

                    )}

                    <div className="mb-4">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${promocion.estado === "Publicado"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {promocion.estado}
                        </span>

                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {promocion.descripcion}
                    </p>

                </div>

                {/* FOOTER */}

                <div className="border-t p-6 flex justify-end">

                    <button
                        onClick={() => setMostrarVer(false)}
                        className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl"
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        </div>
    );
}