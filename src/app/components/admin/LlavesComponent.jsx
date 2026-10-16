"use client";

import { FaTimes, FaTrophy, FaChevronRight } from "react-icons/fa";

export default function LlavesComponent({
    mostrarLlaves,
    setMostrarLlaves,
    torneo,
}) {
    if (!mostrarLlaves || !torneo) return null;

    const llaves = torneo.llaves || [];
    const resultados = torneo.resultados || {};
    const semifinales = torneo.semifinales || [];
    const resultadosSemifinales = torneo.resultadosSemifinales || {};
    const final = torneo.final;
    const resultadoFinal = torneo.resultadoFinal || {};

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Llaves del Torneo
                        </h2>
                        <p className="text-gray-500">{torneo.nombre}</p>
                    </div>

                    <button
                        onClick={() => setMostrarLlaves(false)}
                        className="text-red-600 text-2xl hover:scale-110 transition cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="p-8 overflow-x-auto flex-1">
                    {llaves.length === 0 ? (
                        <div className="text-center py-12">
                            <FaTrophy className="text-gray-300 text-5xl mx-auto mb-4" />
                            <p className="text-gray-500 font-semibold">
                                Este torneo todavía no tiene llaves generadas.
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Realiza el sorteo de equipos desde el modal de Equipos.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-w-[800px]">
                            {/* COLUMNA 1: PRIMERA RONDA */}
                            <div className="flex-1 space-y-4 w-full">
                                <h3 className="text-lg font-bold text-center bg-slate-800 text-white py-2 rounded-xl">
                                    Primera Ronda
                                </h3>
                                {llaves.map((llave, index) => {
                                    const res = resultados[index] || {};
                                    const tieneGanador = Boolean(res.ganador);
                                    const esLocalGanador = res.ganador === llave.local;
                                    const esVisitanteGanador = res.ganador === llave.visitante;

                                    return (
                                        <div
                                            key={llave.id || index}
                                            className="border rounded-2xl shadow-sm overflow-hidden bg-gray-50"
                                        >
                                            <div className="p-4 space-y-3">
                                                {/* LOCAL */}
                                                <div
                                                    className={`flex justify-between items-center p-2 rounded-lg transition ${tieneGanador
                                                            ? esLocalGanador
                                                                ? "bg-green-100 font-bold text-green-800 border-l-4 border-green-600"
                                                                : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                            : "bg-white"
                                                        }`}
                                                >
                                                    <span>{llave.local}</span>
                                                    <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                        {res.localMarcador ?? "-"}
                                                    </span>
                                                </div>

                                                {/* VISITANTE */}
                                                <div
                                                    className={`flex justify-between items-center p-2 rounded-lg transition ${tieneGanador
                                                            ? esVisitanteGanador
                                                                ? "bg-green-100 font-bold text-green-800 border-l-4 border-green-600"
                                                                : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                            : "bg-white"
                                                        }`}
                                                >
                                                    <span>{llave.visitante}</span>
                                                    <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                        {res.visitanteMarcador ?? "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <FaChevronRight className="hidden lg:block text-gray-300 size-8 self-center" />

                            {/* COLUMNA 2: SEMIFINALES */}
                            <div className="flex-1 space-y-4 w-full">
                                <h3 className="text-lg font-bold text-center bg-blue-700 text-white py-2 rounded-xl">
                                    Semifinales
                                </h3>
                                {semifinales.length > 0 ? (
                                    semifinales.map((partido, index) => {
                                        const resSemi = resultadosSemifinales[index] || {};
                                        const tieneGanador = Boolean(resSemi.ganador);
                                        const esLocalGanador = resSemi.ganador === partido.local;
                                        const esVisitanteGanador = resSemi.ganador === partido.visitante;

                                        return (
                                            <div
                                                key={partido.id || index}
                                                className="border rounded-2xl shadow-sm overflow-hidden bg-gray-50"
                                            >
                                                <div className="p-4 space-y-3">
                                                    {/* LOCAL */}
                                                    <div
                                                        className={`flex justify-between items-center p-2 rounded-lg transition ${tieneGanador
                                                                ? esLocalGanador
                                                                    ? "bg-green-100 font-bold text-green-800 border-l-4 border-green-600"
                                                                    : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                                : "bg-white"
                                                            }`}
                                                    >
                                                        <span>{partido.local}</span>
                                                        <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                            {resSemi.golesLocal ?? "-"}
                                                        </span>
                                                    </div>

                                                    {/* VISITANTE */}
                                                    <div
                                                        className={`flex justify-between items-center p-2 rounded-lg transition ${tieneGanador
                                                                ? esVisitanteGanador
                                                                    ? "bg-green-100 font-bold text-green-800 border-l-4 border-green-600"
                                                                    : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                                : "bg-white"
                                                            }`}
                                                    >
                                                        <span>{partido.visitante}</span>
                                                        <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                            {resSemi.golesVisitante ?? "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-gray-400 border border-dashed rounded-2xl">
                                        Pendiente de definir por tabla de posiciones.
                                    </div>
                                )}
                            </div>

                            <FaChevronRight className="hidden lg:block text-gray-300 size-8 self-center" />

                            {/* COLUMNA 3: FINAL Y CAMPEÓN */}
                            <div className="flex-1 space-y-4 w-full">
                                <h3 className="text-lg font-bold text-center bg-yellow-500 text-white py-2 rounded-xl">
                                    Gran Final
                                </h3>
                                {final ? (
                                    <div className="border-2 border-yellow-400 rounded-2xl shadow-md overflow-hidden bg-amber-50/30">
                                        <div className="p-4 space-y-3">
                                            {/* LOCAL */}
                                            <div
                                                className={`flex justify-between items-center p-2 rounded-lg transition ${resultadoFinal.ganador
                                                        ? resultadoFinal.ganador === final.local
                                                            ? "bg-yellow-200 font-bold text-yellow-900 border-l-4 border-yellow-600"
                                                            : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                        : "bg-white"
                                                    }`}
                                            >
                                                <span>{final.local}</span>
                                                <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                    {resultadoFinal.golesLocal ?? "-"}
                                                </span>
                                            </div>

                                            {/* VISITANTE */}
                                            <div
                                                className={`flex justify-between items-center p-2 rounded-lg transition ${resultadoFinal.ganador
                                                        ? resultadoFinal.ganador === final.visitante
                                                            ? "bg-yellow-200 font-bold text-yellow-900 border-l-4 border-yellow-600"
                                                            : "bg-gray-200 text-gray-400 opacity-60 line-through"
                                                        : "bg-white"
                                                    }`}
                                            >
                                                <span>{final.visitante}</span>
                                                <span className="font-bold px-3 py-1 bg-white rounded-md shadow-inner text-gray-800">
                                                    {resultadoFinal.golesVisitante ?? "-"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CAMPEÓN */}
                                        {resultadoFinal.ganador && (
                                            <div className="bg-yellow-400 text-yellow-950 p-4 text-center font-extrabold flex items-center justify-center gap-2">
                                                <FaTrophy className="size-5 text-amber-800" />
                                                <span>CAMPEÓN: {resultadoFinal.ganador}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-gray-400 border border-dashed rounded-2xl">
                                        Pendiente de definir semifinalistas.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="border-t p-6 flex justify-end">
                    <button
                        onClick={() => setMostrarLlaves(false)}
                        className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}