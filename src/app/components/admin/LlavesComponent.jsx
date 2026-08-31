"use client";

import { FaTimes, FaTrophy } from "react-icons/fa";

export default function LlavesComponent({
    mostrarLlaves,
    setMostrarLlaves,
    torneo,
}) {

    if (!mostrarLlaves || !torneo) return null;

    const llaves = torneo.llaves || [];

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">
                            Llaves del Torneo
                        </h2>

                        <p className="text-gray-500">
                            {torneo.nombre}
                        </p>

                    </div>

                    <button
                        onClick={() => setMostrarLlaves(false)}
                        className="text-red-600 text-2xl"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* CONTENIDO */}

                <div className="p-8">

                    {llaves.length === 0 ? (

                        <div className="text-center py-10">

                            <FaTrophy className="text-gray-300 text-5xl mx-auto mb-4" />

                            <p className="text-gray-500">
                                Este torneo todavía no tiene llaves.
                            </p>

                            <p className="text-gray-400 text-sm mt-2">
                                Primero realiza el sorteo de los equipos.
                            </p>

                        </div>

                    ) : (

                        <>

                            <h3 className="text-2xl font-bold mb-6">
                                🏆 Primera Ronda
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">

                                {llaves.map((llave, index) => (

                                    <div
                                        key={llave.id}
                                        className="border rounded-2xl shadow-sm overflow-hidden"
                                    >

                                        {/* TITULO */}

                                        <div className="bg-slate-800 text-white p-4">

                                            <h4 className="font-bold">
                                                Llave {index + 1}
                                            </h4>

                                        </div>

                                        {/* EQUIPOS */}

                                        <div className="p-5">

                                            <div className="flex justify-between items-center border-b pb-4">

                                                <span className="font-semibold">
                                                    {llave.local}
                                                </span>

                                                <span className="bg-gray-100 px-4 py-2 rounded-lg font-bold">
                                                    {llave.golesLocal || "-"}
                                                </span>

                                            </div>

                                            <div className="flex justify-between items-center pt-4">

                                                <span className="font-semibold">
                                                    {llave.visitante}
                                                </span>

                                                <span className="bg-gray-100 px-4 py-2 rounded-lg font-bold">
                                                    {llave.golesVisitante || "-"}
                                                </span>

                                            </div>

                                            {/* GANADOR */}

                                            {llave.ganador && (

                                                <div className="mt-5 bg-green-100 text-green-700 rounded-xl p-3 text-center font-bold">

                                                    🏆 Ganador: {llave.ganador}

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </>

                    )}

                </div>

                {/* FOOTER */}

                <div className="border-t p-6 flex justify-end">

                    <button
                        onClick={() => setMostrarLlaves(false)}
                        className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl"
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        </div>
    );
}