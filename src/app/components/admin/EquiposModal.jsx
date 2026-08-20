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

    const sortearEquipos = () => {

        if (equipos.length < 2) {
            alert("Necesitas al menos 2 equipos para realizar el sorteo.");
            return;
        }

        if (equipos.length % 2 !== 0) {
            alert("El número de equipos debe ser par para realizar el sorteo.");
            return;
        }

        // Copiamos los equipos
        const equiposMezclados = [...equipos];

        // 🎲 Mezclar aleatoriamente
        for (let i = equiposMezclados.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [
                equiposMezclados[i],
                equiposMezclados[j]
            ] = [
                    equiposMezclados[j],
                    equiposMezclados[i]
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
                ganador: ""

            });

        }

        // Actualizamos los equipos visualmente
        setEquipos(equiposMezclados);

        // Actualizamos el torneo
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

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert("🎲 Sorteo realizado correctamente.");
    };

    useEffect(() => {

        if (!torneo) return;
        setEquipos(torneo.equipos || []);
    }, [torneo]);

    if (!mostrarEquipos || !torneo) return null;
    const porcentaje = (equipos.length / Number(torneo.equiposMaximos || 1)) * 100;

    const agregarEquipo = () => {

        if (equipo.trim() === "") return;

        if (equipos.length >= Number(torneo.equiposMaximos)) {

            alert("Ya se alcanzó el máximo de equipos.");

            return;

        }

        const nuevoEquipo = {

            id: Date.now(),

            nombre: equipo,

        };

        setEquipos([...equipos, nuevoEquipo]);

        setEquipo("");

    };

    const eliminarEquipo = (id) => {

        setEquipos(

            equipos.filter((e) => e.id !== id)

        );

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

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );
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

                        <p className="text-gray-500">

                            {torneo.nombre}

                        </p>

                    </div>

                    <button

                        onClick={() => setMostrarEquipos(false)}

                        className="text-red-600 text-2xl"

                    >

                        <FaTimes />

                    </button>

                </div>
                <div className="p-6">

                    <div className="flex justify-between mb-2">

                        <span className="font-semibold">

                            Equipos Inscritos

                        </span>

                        <span>

                            {equipos.length} / {torneo.equiposMaximos}

                        </span>

                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-full">

                        <div

                            className="bg-green-600 h-4 rounded-full transition-all"

                            style={{

                                width: `${porcentaje}%`

                            }}

                        />

                    </div>

                </div>
                <div className="px-6">

                    <div className="flex gap-4">

                        <input

                            type="text"

                            placeholder="Nombre del equipo"

                            value={equipo}

                            onChange={(e) => setEquipo(e.target.value)}

                            className="flex-1 border rounded-xl p-3"

                        />

                        <button

                            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl flex items-center gap-2"
                            onClick={agregarEquipo}
                        >

                            <FaPlus />

                            Agregar

                        </button>

                        <button
                            onClick={sortearEquipos}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                        >
                            🎲 Sortear equipos
                        </button>

                    </div>

                </div>

                <div className="p-6">

                    <h3 className="text-xl font-bold mb-4">

                        Equipos Inscritos

                    </h3>

                    <div className="space-y-3">

                        {

                            equipos.map((e) => (

                                <div

                                    key={e.id}

                                    className="flex justify-between items-center bg-gray-100 rounded-xl p-4 shadow-sm"

                                >

                                    <div className="flex items-center gap-3">

                                        <FaUsers className="text-green-600" />

                                        <span className="font-medium">

                                            {e.nombre}

                                        </span>

                                    </div>

                                    <button

                                        onClick={() => eliminarEquipo(e.id)}

                                        className="text-red-600 hover:text-red-700"

                                    >

                                        <FaTrash />

                                    </button>

                                </div>

                            ))

                        }

                    </div>

                    <div className="p-6 border-t flex justify-end gap-4">

                        <button

                            onClick={() => setMostrarEquipos(false)}

                            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"

                        >

                            Cancelar

                        </button>

                        <button

                            onClick={guardarEquipos}

                            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"

                        >

                            Guardar Equipos

                        </button>

                    </div>

                </div>

            </div>
        </div>

    );
}
