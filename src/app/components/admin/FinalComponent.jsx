"use client";

import { FaTimes, FaFutbol, FaTrophy } from "react-icons/fa";
import { useState } from "react";

export default function FinalComponent({

    mostrarFinal,
    setMostrarFinal,
    torneo,
    torneos,
    setTorneos,

}) {

    const [resultado, setResultado] = useState(
        torneo?.resultadoFinal || {}
    );

    if (!mostrarFinal || !torneo) return null;

    const final = torneo.final;

    if (!final) return null;

    const guardarFinal = () => {

        const golesLocal = Number(
            resultado.golesLocal ?? 0
        );

        const golesVisitante = Number(
            resultado.golesVisitante ?? 0
        );

        let ganador = "";

        if (golesLocal > golesVisitante) {

            ganador = final.local;

        } else if (golesVisitante > golesLocal) {

            ganador = final.visitante;

        } else {

            alert(
                "La final terminó empatada. Debes definir un ganador."
            );

            return;
        }

        const nuevoResultado = {

            local: final.local,

            visitante: final.visitante,

            golesLocal,

            golesVisitante,

            ganador,

        };

        setResultado(nuevoResultado);

        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    resultadoFinal: nuevoResultado,
                    campeon: ganador,
                    estado: "Finalizado",
                }
                : t
        );

        setTorneos(nuevosTorneos);

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert(`🏆 Campeón: ${ganador}`);

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">

                            🏆 Final

                        </h2>

                        <p className="text-gray-500">

                            {torneo.nombre}

                        </p>

                    </div>

                    <button
                        onClick={() => setMostrarFinal(false)}
                        className="text-red-600 text-2xl"
                    >

                        <FaTimes />

                    </button>

                </div>

                {/* PARTIDO */}

                <div className="p-8">

                    <div className="border rounded-2xl p-8 shadow-sm">

                        <div className="flex items-center justify-between gap-6">

                            {/* LOCAL */}

                            <div className="flex-1 text-center">

                                <h3 className="text-2xl font-bold">

                                    {final.local}

                                </h3>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        resultado.golesLocal ?? ""
                                    }
                                    onChange={(e) =>
                                        setResultado({
                                            ...resultado,
                                            golesLocal:
                                                e.target.value,
                                        })
                                    }
                                    className="w-20 border rounded-xl p-3 text-center text-2xl font-bold mt-4"
                                />

                            </div>

                            {/* VS */}

                            <div className="text-center">

                                <div className="text-3xl font-bold">

                                    VS

                                </div>

                                <FaFutbol className="mx-auto mt-2 text-green-600" />

                            </div>

                            {/* VISITANTE */}

                            <div className="flex-1 text-center">

                                <h3 className="text-2xl font-bold">

                                    {final.visitante}

                                </h3>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        resultado.golesVisitante ?? ""
                                    }
                                    onChange={(e) =>
                                        setResultado({
                                            ...resultado,
                                            golesVisitante:
                                                e.target.value,
                                        })
                                    }
                                    className="w-20 border rounded-xl p-3 text-center text-2xl font-bold mt-4"
                                />

                            </div>

                        </div>

                        {/* GANADOR */}

                        {resultado.ganador && (

                            <div className="mt-6 bg-yellow-100 text-yellow-700 rounded-xl p-4 text-center font-bold text-xl">

                                <FaTrophy className="inline mr-2" />

                                Campeón: {resultado.ganador}

                            </div>

                        )}

                        {/* BOTÓN */}

                        <div className="flex justify-center mt-6">

                            <button
                                onClick={guardarFinal}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
                            >

                                Guardar resultado final

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}