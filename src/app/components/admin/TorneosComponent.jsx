"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaTrophy, FaUsers, FaFutbol, FaMoneyBillWave, FaChartBar } from "react-icons/fa";
import TorneoModal from "./TorneoModal";
import EquiposModal from "./EquiposModal";
import FixtureComponent from "./FixtureComponent";
import TablaPosiciones from "./TablaPosiciones";
import SemifinalComponent from "./SemifinalComponent";
import FinalComponent from "./FinalComponent";
import LlavesComponent from "./LlavesComponent";

export default function TorneosComponent() {

    const [torneos, setTorneos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarEquipos, setMostrarEquipos] = useState(false);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
    const [mostrarFixture, setMostrarFixture] = useState(false);
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [mostrarSemifinal, setMostrarSemifinal] = useState(false);
    const [mostrarFinal, setMostrarFinal] = useState(false);
    const [mostrarLlaves, setMostrarLlaves] = useState(false);

    const [formulario, setFormulario] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        tipo: "Fútbol 5",
        fechaInicio: "",
        fechaFin: "",
        equipos: "",
        inscripcion: "",
        premio: "",
        estado: "Activo"

    });

    useEffect(() => {

        const datos = JSON.parse(localStorage.getItem("torneos")) || [];

        setTorneos(datos);

    }, []);

    const torneosActivos = torneos.filter(
        t => t.estado === "Activo"
    ).length;

    const totalEquipos = torneos.reduce(
        (acc, t) => acc + Number(t.equipos || 0),
        0
    );

    const totalRecaudado = torneos.reduce(
        (acc, t) => acc + Number(t.inscripcion || 0),
        0
    );

    const partidos = torneos.length * 4;

    const eliminarTorneo = (id) => {

        if (!confirm("¿Eliminar este torneo?")) return;

        const nuevos = torneos.filter((t) => t.id !== id);

        setTorneos(nuevos);

        localStorage.setItem("torneos", JSON.stringify(nuevos));
    };

    return (

        <div>
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold text-gray-800">

                        Gestión de Torneos

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Administra los torneos de FutZone.

                    </p>

                </div>

                <button

                    onClick={() => {

                        setFormulario({
                            id: "",
                            nombre: "",
                            descripcion: "",
                            imagen: "",
                            tipo: "Fútbol 5",
                            fechaInicio: "",
                            fechaFin: "",
                            equipos: "",
                            inscripcion: "",
                            premio: "",
                            estado: "Activo"
                        });

                        setEditando(false);
                        setMostrarModal(true);

                    }}

                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

                >

                    <FaPlus />

                    Nuevo Torneo

                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">

                    <FaTrophy size={35} />

                    <h2 className="text-3xl font-bold mt-3">

                        {torneosActivos}

                    </h2>

                    <p>Torneos Activos</p>

                </div>

                <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">

                    <FaUsers size={35} />

                    <h2 className="text-3xl font-bold mt-3">

                        {totalEquipos}

                    </h2>

                    <p>Equipos Inscritos</p>

                </div>

                <div className="bg-yellow-500 text-white rounded-2xl p-6 shadow-lg">

                    <FaFutbol size={35} />

                    <h2 className="text-3xl font-bold mt-3">

                        {partidos}

                    </h2>

                    <p>Partidos</p>

                </div>

                <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg">

                    <FaMoneyBillWave size={35} />

                    <h2 className="text-3xl font-bold mt-3">

                        ${totalRecaudado.toLocaleString()}

                    </h2>

                    <p>Recaudación</p>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 mb-6 text-gray-700">

                <div className="relative">

                    <FaSearch className="absolute left-4 top-4 text-gray-400" />

                    <input

                        type="text"

                        placeholder="Buscar torneo..."

                        value={busqueda}

                        onChange={(e) => setBusqueda(e.target.value)}

                        className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"

                    />

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center text-gray-700">

                <table className="w-full">

                    <thead className="bg-green-600 text-white">

                        <tr>

                            <th className="p-4">Imagen</th>

                            <th>Nombre</th>

                            <th>Tipo</th>

                            <th>Equipos</th>

                            <th>Inicio</th>

                            <th>Estado</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {torneos
                            .filter((t) =>
                                t.nombre.toLowerCase().includes(busqueda.toLowerCase())
                            )
                            .map((t, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    {/* Imagen */}

                                    <td className="p-4">

                                        {t.imagen ? (

                                            <img

                                                src={t.imagen}

                                                alt="Torneo"

                                                className="w-20 h-14 object-cover rounded-lg"

                                            />

                                        ) : (

                                            <div className="w-20 h-14 rounded-lg bg-gray-200 flex justify-center items-center">

                                                <FaTrophy className="text-gray-400" />

                                            </div>

                                        )}

                                    </td>

                                    {/* Nombre */}

                                    <td className="font-semibold">

                                        {t.nombre}

                                    </td>

                                    {/* Tipo */}

                                    <td>

                                        {t.tipo}

                                    </td>

                                    {/* Equipos */}

                                    <td>

                                        {t.equiposMaximos}

                                    </td>

                                    {/* Fecha */}

                                    <td>

                                        {t.fechaInicio}

                                    </td>

                                    {/* Estado */}

                                    <td>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                                ${t.estado === "Activo"
                                                    ? "bg-green-100 text-green-700"

                                                    : t.estado === "En curso"
                                                        ? "bg-blue-100 text-blue-700"

                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >

                                            {t.estado}

                                        </span>

                                    </td>

                                    {/* Acciones */}

                                    <td>

                                        <div className="flex gap-4 justify-center">

                                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                onClick={() => {
                                                    setTorneoSeleccionado(t);
                                                    setMostrarEquipos(true); // o el modal que quieras abrir
                                                }}>

                                                <FaEye size={20} />

                                            </button>

                                            <button
                                                className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                                                onClick={() => {
                                                    setFormulario(t);
                                                    setEditando(true);
                                                    setMostrarModal(true);
                                                }}
                                            >

                                                <FaEdit size={20} />

                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                onClick={() => eliminarTorneo(t.id)}
                                            >

                                                <FaTrash size={20} />

                                            </button>

                                            <button
                                                onClick={() => {
                                                    setTorneoSeleccionado(t);
                                                    setMostrarEquipos(true);
                                                }}
                                                className="text-green-600 hover:text-green-700 cursor-pointer"
                                            >
                                                <FaUsers size={20} />
                                            </button>

                                            <button
                                                onClick={() => {

                                                    setTorneoSeleccionado(t);
                                                    setMostrarFixture(true);

                                                }}

                                                className="text-purple-600 hover:text-purple-700 cursor-pointer"
                                            >
                                                <FaFutbol size={20} />
                                            </button>

                                            <button onClick={() => { setTorneoSeleccionado(t); setMostrarTabla(true); }}
                                                className="text-indigo-600 hover:text-indigo-800 cursor-pointer">

                                                <FaChartBar size={20} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setTorneoSeleccionado(t);
                                                    setMostrarSemifinal(true);
                                                }}
                                                className="text-orange-600 hover:text-orange-700 cursor-pointer"
                                                title="Semifinales"
                                            >
                                                🥇
                                            </button>

                                            <button
                                                onClick={() => {

                                                    setTorneoSeleccionado(t);
                                                    setMostrarFinal(true);

                                                }}
                                                className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                                                title="Final"
                                            >
                                                <FaTrophy size={20} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setTorneoSeleccionado(t);
                                                    setMostrarLlaves(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                title="Ver llaves"
                                            >
                                                Ver LLaves
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

            <TorneoModal

                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                formulario={formulario}
                setFormulario={setFormulario}
                torneos={torneos}
                setTorneos={setTorneos}
                editando={editando}
                setEditando={setEditando}

            />

            <EquiposModal

                mostrarEquipos={mostrarEquipos}
                setMostrarEquipos={setMostrarEquipos}
                torneo={torneoSeleccionado}
                torneos={torneos}
                setTorneos={setTorneos}

            />
            <FixtureComponent

                mostrarFixture={mostrarFixture}
                setMostrarFixture={setMostrarFixture}
                torneo={torneoSeleccionado}
                torneos={torneos}
                setTorneos={setTorneos}

            />
            <TablaPosiciones
                mostrarTabla={mostrarTabla}
                setMostrarTabla={setMostrarTabla}
                torneo={torneoSeleccionado}
                torneos={torneos}
                setTorneos={setTorneos}

            />

            <SemifinalComponent
                mostrarSemifinal={mostrarSemifinal}
                setMostrarSemifinal={setMostrarSemifinal}
                torneo={torneoSeleccionado}
                torneos={torneos}
                setTorneos={setTorneos}
            />

            <FinalComponent
                mostrarFinal={mostrarFinal}
                setMostrarFinal={setMostrarFinal}
                torneo={torneoSeleccionado}
                torneos={torneos}
                setTorneos={setTorneos}
            />

            <LlavesComponent
                mostrarLlaves={mostrarLlaves}
                setMostrarLlaves={setMostrarLlaves}
                torneo={torneoSeleccionado}
            />

        </div>

    );
}