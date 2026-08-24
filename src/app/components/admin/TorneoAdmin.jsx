
"use client";

import { useEffect, useState } from "react";

export default function TorneoAdmin() {
    // =========================
    // ESTADOS
    // =========================

    const [nombreTorneo, setNombreTorneo] =
        useState("Champions FutZone");

    const [equipos, setEquipos] = useState([
        "Real Madrid",
        "Barcelona",
        "Manchester City",
        "Liverpool",
        "PSG",
        "Juventus",
        "Bayern Munich",
        "Milan",
    ]);

    const [nuevoEquipo, setNuevoEquipo] = useState("");

    const [editando, setEditando] = useState(null);

    const [nuevoNombre, setNuevoNombre] = useState("");

    const [busqueda, setBusqueda] = useState("");

    const [cuartos, setCuartos] = useState({});
    const [semis, setSemis] = useState({});
    const [final, setFinal] = useState("");

    const [mensaje, setMensaje] = useState("");

    // =========================
    // LOCAL STORAGE
    // =========================

    useEffect(() => {
        const datosGuardados =
            localStorage.getItem("torneo-futzone");

        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);

            setEquipos(datos.equipos || []);
            setCuartos(datos.cuartos || {});
            setSemis(datos.semis || {});
            setFinal(datos.final || "");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "torneo-futzone",
            JSON.stringify({
                equipos,
                cuartos,
                semis,
                final,
            })
        );
    }, [equipos, cuartos, semis, final]);

    // =========================
    // FUNCIONES
    // =========================

    const mostrarMensaje = (texto) => {
        setMensaje(texto);

        setTimeout(() => {
            setMensaje("");
        }, 2500);
    };

    // AGREGAR EQUIPO
    const agregarEquipo = () => {
        if (nuevoEquipo.trim() === "") {
            mostrarMensaje("⚠️ Ingresa un nombre");
            return;
        }

        if (equipos.includes(nuevoEquipo)) {
            mostrarMensaje("⚠️ Equipo repetido");
            return;
        }

        setEquipos([...equipos, nuevoEquipo]);

        setNuevoEquipo("");

        mostrarMensaje("✅ Equipo agregado");
    };

    // ELIMINAR EQUIPO
    const eliminarEquipo = (index) => {
        const confirmar = confirm(
            "¿Eliminar este equipo?"
        );

        if (!confirmar) return;

        const copia = equipos.filter((_, i) => i !== index);

        setEquipos(copia);

        mostrarMensaje("🗑️ Equipo eliminado");
    };

    // EDITAR EQUIPO
    const guardarEdicion = (index) => {
        if (nuevoNombre.trim() === "") return;

        const copia = [...equipos];

        copia[index] = nuevoNombre;

        setEquipos(copia);

        setEditando(null);

        setNuevoNombre("");

        mostrarMensaje("✏️ Equipo actualizado");
    };

    // REINICIAR TORNEO
    const reiniciarTorneo = () => {
        const confirmar = confirm(
            "¿Reiniciar torneo completo?"
        );

        if (!confirmar) return;

        setCuartos({});
        setSemis({});
        setFinal("");

        mostrarMensaje("🔄 Torneo reiniciado");
    };

    // =========================
    // GANADORES
    // =========================

    const semifinalistas = Object.values(cuartos);

    const finalistas = Object.values(semis);

    // =========================
    // FILTRO BUSQUEDA
    // =========================

    const equiposFiltrados = equipos.filter((equipo) =>
        equipo
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    // =========================
    // UI
    // =========================

    return (
        <main className="max-w-7xl mx-auto p-6">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-3xl p-8 text-white shadow-2xl mb-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black mb-3">
                            🏆 {nombreTorneo}
                        </h1>

                        <p className="text-green-100 text-lg">
                            Sistema avanzado de torneos FutZone
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={reiniciarTorneo}
                            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-bold transition"
                        >
                            Reiniciar Torneo
                        </button>
                    </div>
                </div>
            </div>

            {/* ALERTA */}
            {mensaje && (
                <div className="bg-green-500 text-white px-6 py-4 rounded-2xl mb-8 shadow-lg font-semibold">
                    {mensaje}
                </div>
            )}

            {/* AGREGAR EQUIPOS */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="text-3xl font-bold text-gray-700">
                        ⚽ Administración de Equipos
                    </h2>

                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
                        {equipos.length} Equipos
                    </div>
                </div>

                {/* INPUTS */}
                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Nombre del equipo"
                        value={nuevoEquipo}
                        onChange={(e) =>
                            setNuevoEquipo(e.target.value)
                        }
                        className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Buscar equipo..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                        className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={agregarEquipo}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition py-4"
                    >
                        ➕ Agregar Equipo
                    </button>
                </div>

                {/* LISTA EQUIPOS */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {equiposFiltrados.map((equipo, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-3xl p-5 hover:shadow-xl transition"
                        >
                            {editando === index ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={nuevoNombre}
                                        onChange={(e) =>
                                            setNuevoNombre(e.target.value)
                                        }
                                        className="border rounded-2xl px-4 py-3"
                                    />

                                    <button
                                        onClick={() =>
                                            guardarEdicion(index)
                                        }
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-black text-xl text-gray-700">
                                            ⚽ {equipo}
                                        </h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditando(index);
                                                setNuevoNombre(equipo);
                                            }}
                                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-2xl font-bold transition"
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                eliminarEquipo(index)
                                            }
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold transition"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* VALIDACION */}
            {equipos.length < 8 && (
                <div className="bg-yellow-100 text-yellow-700 border border-yellow-300 p-5 rounded-3xl mb-10 font-semibold">
                    ⚠️ Debes tener mínimo 8 equipos para
                    generar el torneo.
                </div>
            )}

            {/* LLAVES */}
            {equipos.length >= 8 && (
                <div className="grid xl:grid-cols-3 gap-8">
                    {/* CUARTOS */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-4xl font-black text-center text-green-700 mb-8">
                            🏆 Cuartos
                        </h2>

                        {[0, 2, 4, 6].map((i, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-3xl p-5 mb-5 border"
                            >
                                <p className="font-black text-lg mb-4">
                                    {equipos[i]} vs {equipos[i + 1]}
                                </p>

                                <select
                                    onChange={(e) =>
                                        setCuartos({
                                            ...cuartos,
                                            [`partido${index}`]:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-2xl p-4"
                                >
                                    <option>
                                        Selecciona ganador
                                    </option>

                                    <option value={equipos[i]}>
                                        {equipos[i]}
                                    </option>

                                    <option value={equipos[i + 1]}>
                                        {equipos[i + 1]}
                                    </option>
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* SEMIS */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-4xl font-black text-center text-blue-700 mb-8">
                            🔥 Semifinal
                        </h2>

                        {[0, 2].map((i, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-3xl p-5 mb-5 border"
                            >
                                <p className="font-black text-lg mb-4">
                                    {semifinalistas[i] ||
                                        "Ganador"}{" "}
                                    vs{" "}
                                    {semifinalistas[i + 1] ||
                                        "Ganador"}
                                </p>

                                <select
                                    onChange={(e) =>
                                        setSemis({
                                            ...semis,
                                            [`semi${index}`]:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-2xl p-4"
                                >
                                    <option>
                                        Selecciona ganador
                                    </option>

                                    <option
                                        value={semifinalistas[i]}
                                    >
                                        {semifinalistas[i]}
                                    </option>

                                    <option
                                        value={
                                            semifinalistas[i + 1]
                                        }
                                    >
                                        {semifinalistas[i + 1]}
                                    </option>
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* FINAL */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-4xl font-black text-center text-yellow-600 mb-8">
                            👑 Final
                        </h2>

                        <div className="bg-gray-50 rounded-3xl p-5 border mb-6">
                            <p className="font-black text-lg mb-4">
                                {finalistas[0] ||
                                    "Finalista"}{" "}
                                vs{" "}
                                {finalistas[1] ||
                                    "Finalista"}
                            </p>

                            <select
                                onChange={(e) =>
                                    setFinal(e.target.value)
                                }
                                className="w-full border rounded-2xl p-4"
                            >
                                <option>
                                    Selecciona campeón
                                </option>

                                <option value={finalistas[0]}>
                                    {finalistas[0]}
                                </option>

                                <option value={finalistas[1]}>
                                    {finalistas[1]}
                                </option>
                            </select>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl p-10 text-white text-center shadow-2xl">
                            <h3 className="text-4xl font-black mb-4">
                                🏆 Campeón
                            </h3>

                            <p className="text-3xl font-black">
                                {final || "Sin definir"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

