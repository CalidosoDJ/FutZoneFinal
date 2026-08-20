"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaTrophy } from "react-icons/fa";

export default function FixtureComponent({
    mostrarFixture,
    setMostrarFixture,
    torneo,
    torneos,
    setTorneos,
}) {
    if (!mostrarFixture || !torneo) return null;

    const equipos = torneo.equipos || [];

    const [resultados, setResultados] = useState({});

    useEffect(() => {
        if (torneo) {
            setResultados(torneo.resultados || {});
        }
    }, [torneo]);

    // Generar partidos automáticamente
    const partidos = [];

    for (let i = 0; i < equipos.length; i += 2) {
        if (equipos[i + 1]) {
            partidos.push({
                id: i,
                local: equipos[i].nombre,
                visitante: equipos[i + 1].nombre,
            });
        }
    }

    const guardarResultado = (index) => {

        const partido = partidos[index];

        const golesLocal = Number(resultados[index]?.localMarcador || 0);
        const golesVisitante = Number(resultados[index]?.visitanteMarcador || 0);

        let ganador = "Empate";

        if (golesLocal > golesVisitante) {
            ganador = partido.local;
        } else if (golesVisitante > golesLocal) {
            ganador = partido.visitante;
        }

        setResultados({
            ...resultados,
            [index]: {
                local: partido.local,
                visitante: partido.visitante,
                localMarcador: golesLocal,
                visitanteMarcador: golesVisitante,
                ganador,
            },
        });
    };

    const guardarFixture = () => {
        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    resultados,
                }
                : t
        );

        setTorneos(nuevosTorneos);

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert("Fixture guardado correctamente.");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center p-6 border-b">

                    <div>

                        <h2 className="text-3xl font-bold">
                            Fixture
                        </h2>

                        <p className="text-gray-500">
                            {torneo.nombre}
                        </p>

                    </div>

                    <button onClick={() => setMostrarFixture(false)}>
                        <FaTimes className="text-red-600 text-2xl" />
                    </button>

                </div>

                {/* Partidos */}

                <div className="p-8 grid md:grid-cols-2 gap-6">

                    {partidos.map((partido, index) => (

                        <div
                            key={index}
                            className="border rounded-2xl p-6 shadow hover:shadow-lg"
                        >

                            <div className="flex justify-center mb-4">

                                <FaTrophy
                                    className="text-yellow-500"
                                    size={30}
                                />

                            </div>

                            <h2 className="text-center text-xl font-bold">
                                {partido.local}
                            </h2>

                            <div className="flex justify-center items-center gap-3 my-4">

                                <input
                                    type="number"
                                    min="0"
                                    value={resultados[index]?.localMarcador ?? ""}
                                    onChange={(e) =>
                                        setResultados({
                                            ...resultados,
                                            [index]: {
                                                ...resultados[index],
                                                localMarcador: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-16 border rounded-lg p-2 text-center"
                                />

                                <span className="font-bold text-xl">
                                    VS
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    value={resultados[index]?.visitanteMarcador ?? ""}
                                    onChange={(e) =>
                                        setResultados({
                                            ...resultados,
                                            [index]: {
                                                ...resultados[index],
                                                visitanteMarcador: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-16 border rounded-lg p-2 text-center"
                                />

                            </div>

                            <h2 className="text-center text-xl font-bold">
                                {partido.visitante}
                            </h2>

                            <div className="flex justify-center mt-5">

                                <button
                                    onClick={() => {
                                        const copia = {
                                            ...resultados,
                                            [index]: {
                                                ...resultados[index],
                                                local: resultados[index]?.localMarcador || 0,
                                                visitante: resultados[index]?.visitanteMarcador || 0,
                                            },
                                        };

                                        setResultados(copia);

                                        setTimeout(() => guardarResultado(index), 0);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                                >
                                    Guardar Resultado
                                </button>

                            </div>

                            {resultados[index]?.ganador && (

                                <div className="mt-4 text-center">

                                    <p className="text-gray-500">
                                        Ganador
                                    </p>

                                    <h2 className="text-xl font-bold text-green-600">

                                        🏆 {resultados[index].ganador}

                                    </h2>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

                {/* Footer */}

                <div className="border-t p-6 flex justify-end gap-4">

                    <button
                        onClick={guardarFixture}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >
                        Guardar Fixture
                    </button>

                    <button
                        onClick={() => setMostrarFixture(false)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        </div>
    );
}