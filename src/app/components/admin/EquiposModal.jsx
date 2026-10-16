"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUsers, FaPlus, FaTrash } from "react-icons/fa";

export default function EquiposModal({
    mostrarEquipos,
    setMostrarEquipos,
    torneo,
    torneos,
    setTorneos,
}) {
    const [equipo, setEquipo] = useState("");
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        if (!torneo) return;
        setEquipos(torneo.equipos || []);
    }, [torneo]);

    if (!mostrarEquipos || !torneo) return null;

    // Límite de equipos seguro
    const maxEquipos = Number(torneo.equiposMaximos) || 16;
    const porcentaje = Math.min(
        Math.round((equipos.length / maxEquipos) * 100),
        100
    );

    const agregarEquipo = () => {
        if (equipo.trim() === "") return;

        if (equipos.length >= maxEquipos) {
            alert("Ya se alcanzó el máximo de equipos permitidos.");
            return;
        }

        const nuevoEquipo = {
            id: Date.now().toString(),
            nombre: equipo.trim(),
        };

        setEquipos([...equipos, nuevoEquipo]);
        setEquipo("");
    };

    const eliminarEquipo = (id) => {
        setEquipos(equipos.filter((e) => e.id !== id));
    };

    const sortearEquipos = () => {
        if (equipos.length < 2) {
            alert("Necesitas al menos 2 equipos para realizar el sorteo.");
            return;
        }

        if (equipos.length % 2 !== 0) {
            alert("El número de equipos debe ser par para realizar el sorteo.");
            return;
        }

        const equiposMezclados = [...equipos];

        // 🎲 Mezclar aleatoriamente
        for (let i = equiposMezclados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [equiposMezclados[i], equiposMezclados[j]] = [
                equiposMezclados[j],
                equiposMezclados[i],
            ];
        }

        // 🔀 Crear las llaves
        const nuevasLlaves = [];
        for (let i = 0; i < equiposMezclados.length; i += 2) {
            nuevasLlaves.push({
                id: nuevasLlaves.length + 1,
                local: equiposMezclados[i].nombre,
                visitante: equiposMezclados[i + 1].nombre,
                golesLocal: "",
                golesVisitante: "",
                ganador: "",
            });
        }

        setEquipos(equiposMezclados);

        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    equipos: equiposMezclados,
                    llaves: nuevasLlaves,
                    sorteoRealizado: true,
                }
                : t
        );

        setTorneos(nuevosTorneos);
        localStorage.setItem("torneos", JSON.stringify(nuevosTorneos));

        alert("🎲 Sorteo realizado correctamente.");
    };

    const guardarEquipos = () => {
        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    equipos,
                }
                : t
        );

        setTorneos(nuevosTorneos);
        localStorage.setItem("torneos", JSON.stringify(nuevosTorneos));
        setMostrarEquipos(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Equipos del Torneo
                        </h2>
                        <p className="text-gray-500">{torneo.nombre}</p>
                    </div>

                    <button
                        onClick={() => setMostrarEquipos(false)}
                        className="text-red-600 text-2xl hover:scale-110 transition cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* BARRA DE PROGRESO */}
                <div className="p-6">
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold">Equipos Inscritos</span>
                        <span>
                            {equipos.length} / {maxEquipos}
                        </span>
                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="bg-green-600 h-4 rounded-full transition-all duration-300"
                            style={{
                                width: `${porcentaje}%`,
                            }}
                        />
                    </div>
                </div>

                {/* INPUT Y BOTONES DE ACCIÓN */}
                <div className="px-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Nombre del equipo"
                            value={equipo}
                            onChange={(e) => setEquipo(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && agregarEquipo()}
                            className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition cursor-pointer"
                            onClick={agregarEquipo}
                        >
                            <FaPlus />
                            Agregar
                        </button>

                        <button
                            onClick={sortearEquipos}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition cursor-pointer"
                        >
                            🎲 Sortear equipos
                        </button>
                    </div>
                </div>

                {/* LISTA DE EQUIPOS INSCRITOS */}
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                        Lista de Equipos ({equipos.length})
                    </h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {equipos.length > 0 ? (
                            equipos.map((e, index) => (
                                <div
                                    key={e.id || index}
                                    className="flex justify-between items-center bg-gray-100 rounded-xl p-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-green-600" />
                                        <span className="font-medium text-gray-800">
                                            {e.nombre}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => eliminarEquipo(e.id)}
                                        className="text-red-600 hover:text-red-800 p-1 transition cursor-pointer"
                                        title="Eliminar equipo"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-6">
                                Aún no se han agregado equipos a este torneo.
                            </p>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t flex justify-end gap-4">
                    <button
                        onClick={() => setMostrarEquipos(false)}
                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold transition cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardarEquipos}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-pointer"
                    >
                        Guardar Equipos
                    </button>
                </div>
            </div>
        </div>
    );
}