"use client";

import { FaTimes, FaFutbol } from "react-icons/fa";
import { useState } from "react";

export default function SemifinalComponent({
    mostrarSemifinal,
    setMostrarSemifinal,
    torneo,
    torneos,
    setTorneos,
}) {

    if (!mostrarSemifinal || !torneo) return null;

    const semifinales = torneo.semifinales || [];

    const [resultados, setResultados] = useState(
        torneo.resultadosSemifinales || {}
    );

    const guardarResultado = (index, partido) => {

        const golesLocal = Number(
            resultados[index]?.golesLocal ?? 0
        );

        const golesVisitante = Number(
            resultados[index]?.golesVisitante ?? 0
        );

        let ganador = "";

        if (golesLocal > golesVisitante) {
            ganador = partido.local;
        } else if (golesVisitante > golesLocal) {
            ganador = partido.visitante;
        } else {
            alert("El partido terminó empatado. Debes definir un ganador.");
            return;
        }

        const nuevosResultados = {
            ...resultados,
            [index]: {
                ...resultados[index],
                local: partido.local,
                visitante: partido.visitante,
                golesLocal,
                golesVisitante,
                ganador,
            },
        };

        setResultados(nuevosResultados);

        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    resultadosSemifinales: nuevosResultados,
                }
                : t
        );

        setTorneos(nuevosTorneos);

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert(`Ganador: ${ganador}`);
    };

    const generarFinal = () => {

        const semifinal1 = resultados[0];
        const semifinal2 = resultados[1];

        if (!semifinal1?.ganador || !semifinal2?.ganador) {
            alert("Primero debes guardar los dos resultados de las semifinales.");
            return;
        }

        const ganador1 = semifinal1.ganador;
        const ganador2 = semifinal2.ganador;

        const nuevaFinal = {
            local: ganador1,
            visitante: ganador2,
            golesLocal: "",
            golesVisitante: "",
            ganador: ""
        };

        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    final: nuevaFinal
                }
                : t
        );

        setTorneos(nuevosTorneos);

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert(`Final generada: ${ganador1} vs ${ganador2}`);

        setMostrarSemifinal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Semifinales
                        </h2>

                        <p className="text-gray-500">
                            {torneo.nombre}
                        </p>
                    </div>

                    <button
                        onClick={() => setMostrarSemifinal(false)}
                        className="text-red-600 text-2xl"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* PARTIDOS */}

                <div className="p-8 space-y-6">

                    {semifinales.map((partido, index) => {

                        const resultado = resultados[index] || {};

                        return (
                            <div
                                key={partido.id}
                                className="border rounded-2xl p-6 shadow-sm"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    {/* LOCAL */}

                                    <div className="flex-1 text-center">

                                        <h3 className="text-xl font-bold">
                                            {partido.local}
                                        </h3>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                resultado.golesLocal ?? ""
                                            }
                                            onChange={(e) =>
                                                setResultados({
                                                    ...resultados,
                                                    [index]: {
                                                        ...resultado,
                                                        golesLocal:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-20 border rounded-xl p-3 text-center text-2xl font-bold mt-3"
                                        />

                                    </div>

                                    {/* VS */}

                                    <div className="text-center">

                                        <div className="text-2xl font-bold">
                                            VS
                                        </div>

                                        <FaFutbol className="mx-auto mt-2 text-green-600" />

                                    </div>

                                    {/* VISITANTE */}

                                    <div className="flex-1 text-center">

                                        <h3 className="text-xl font-bold">
                                            {partido.visitante}
                                        </h3>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                resultado.golesVisitante ?? ""
                                            }
                                            onChange={(e) =>
                                                setResultados({
                                                    ...resultados,
                                                    [index]: {
                                                        ...resultado,
                                                        golesVisitante:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            className="w-20 border rounded-xl p-3 text-center text-2xl font-bold mt-3"
                                        />

                                    </div>

                                </div>

                                {/* GANADOR */}

                                {resultado.ganador && (
                                    <div className="mt-5 text-center bg-green-100 text-green-700 rounded-xl p-3 font-bold">
                                        🏆 Ganador: {resultado.ganador}
                                    </div>
                                )}

                                {/* BOTÓN */}

                                <div className="flex justify-center mt-5">

                                    <button
                                        onClick={() =>
                                            guardarResultado(
                                                index,
                                                partido
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                                    >
                                        Guardar resultado
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                    <div className="flex justify-center mt-6">

                        <button
                            onClick={generarFinal}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold"
                        >
                            🏆 Generar Final
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}