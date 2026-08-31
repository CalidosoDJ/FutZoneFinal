"use client";

import { useEffect, useState } from "react";

import DetallePagoModal from "./DetallePagoModal";
import FacturaModal from "./FacturaModal";

import {
    FaSearch,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaEye,
    FaTrash,
    FaPlus,
} from "react-icons/fa";

import PagoModal from "./PagoModal";

export default function PagosComponent() {

    const [pagos, setPagos] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [busqueda, setBusqueda] = useState("");

    const [editando, setEditando] = useState(false);

    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

    const [mostrarFactura, setMostrarFactura] = useState(false);

    const [formulario, setFormulario] = useState({

        id: Date.now(),

        cliente: "",

        cancha: "",

        valor: 0,

        metodo: "Efectivo",

        referenciaSistema: "",

        referenciaNequi: "",

        comprobante: "",

        estado: "Pendiente",

        fecha: "",

    });

    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("pagos")) || [];

        setPagos(datos);

    }, []);

    // Estadísticas

    const ingresos = pagos
        .filter((p) => p.estado === "Pagado")
        .reduce((a, b) => a + Number(b.valor), 0);

    const pagados = pagos.filter(
        (p) => p.estado === "Pagado"
    ).length;

    const pendientes = pagos.filter(
        (p) => p.estado === "Pendiente"
    ).length;

    const rechazados = pagos.filter(
        (p) => p.estado === "Rechazado"
    ).length;


    const aprobarPago = (id) => {

        const nuevosPagos = pagos.map((p) =>

            p.id === id

                ? {
                    ...p,
                    estado: "Pagado"
                }

                : p

        );

        setPagos(nuevosPagos);

        localStorage.setItem(

            "pagos",

            JSON.stringify(nuevosPagos)

        );

    }

    const rechazarPago = (id) => {

        const nuevosPagos = pagos.map((p) =>

            p.id === id

                ? {

                    ...p,

                    estado: "Rechazado"

                }

                : p

        );

        setPagos(nuevosPagos);

        localStorage.setItem(

            "pagos",

            JSON.stringify(nuevosPagos)

        );

    }

    const eliminarPago = (id) => {

        if (!confirm("¿Eliminar este pago?")) return;

        const nuevos = pagos.filter(
            (p) => p.id !== id
        );

        setPagos(nuevos);

        localStorage.setItem(
            "pagos",
            JSON.stringify(nuevos)
        );

    };


    return (

        <div>

            {/* Título */}

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold text-gray-800">

                    Gestión de Pagos

                </h1>

                <button

                    onClick={() => {

                        setFormulario({

                            id: Date.now(),

                            cliente: "",

                            cancha: "",

                            valor: 0,

                            metodo: "Efectivo",

                            referenciaSistema: "",

                            referenciaNequi: "",

                            comprobante: "",

                            estado: "Pendiente",

                            fecha: "",

                        });

                        setEditando(false);

                        setMostrarModal(true);

                    }}

                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

                >

                    <FaPlus />

                    Registrar Pago

                </button>

            </div>

            {/* Tarjetas */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-gray-700">

                <div className="bg-white rounded-2xl shadow p-6">

                    <FaMoneyBillWave className="text-green-600 text-3xl mb-3" />

                    <p className="text-gray-500">
                        Ingresos
                    </p>

                    <h2 className="text-3xl font-bold">

                        ${ingresos.toLocaleString()}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <FaCheckCircle className="text-green-600 text-3xl mb-3" />

                    <p>Pagados</p>

                    <h2 className="text-3xl font-bold">

                        {pagados}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <FaClock className="text-yellow-500 text-3xl mb-3" />

                    <p>Pendientes</p>

                    <h2 className="text-3xl font-bold">

                        {pendientes}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <FaTimesCircle className="text-red-500 text-3xl mb-3" />

                    <p>Rechazados</p>

                    <h2 className="text-3xl font-bold">

                        {rechazados}

                    </h2>

                </div>

            </div>

            {/* Buscar */}

            <div className="relative mb-8 text-gray-700">

                <FaSearch className="absolute top-4 left-4 text-gray-400" />

                <input

                    type="text"

                    placeholder="Buscar..."

                    value={busqueda}

                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }

                    className="w-full border rounded-xl p-3 pl-12"

                />

            </div>

            {/* Tabla */}

            <div className="bg-white rounded-2xl shadow overflow-hidden text-gray-700 text-center">

                <table className="w-full">

                    <thead className="bg-green-600 text-white">

                        <tr>

                            <th className="p-4">Cliente</th>

                            <th>Cancha</th>

                            <th>Valor</th>

                            <th>Método</th>

                            <th>Estado</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            pagos

                                .filter((p) =>

                                    p.cliente.toLowerCase()

                                        .includes(busqueda.toLowerCase())

                                )

                                .map((p) => (

                                    <tr
                                        key={p.id}
                                        className="border-b hover:bg-green-50 transition"
                                    >

                                        <td className="p-4">

                                            {p.cliente}

                                        </td>

                                        <td>

                                            {p.cancha}

                                        </td>

                                        <td className="font-bold text-green-600">

                                            ${Number(p.valor).toLocaleString()}

                                        </td>

                                        <td>

                                            {p.metodo}

                                        </td>

                                        <td>

                                            <span
                                                className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            text-sm
                                            font-semibold

                                            ${p.estado === "Pagado"

                                                        ? "bg-green-100 text-green-700"

                                                        : p.estado === "Pendiente"

                                                            ? "bg-yellow-100 text-yellow-700"

                                                            : "bg-red-100 text-red-700"
                                                    }
                                            `}
                                            >

                                                {p.estado}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="flex justify-center gap-4 text-lg">

                                                <button
                                                    onClick={() => {

                                                        setPagoSeleccionado(p);

                                                        setMostrarDetalle(true);

                                                    }}

                                                    className="text-blue-600 hover:text-blue-800"

                                                >

                                                    <FaEye />

                                                </button>

                                                <button
                                                    onClick={() => eliminarPago(p.id)}
                                                    className="text-red-600"
                                                >

                                                    <FaTrash />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>

            <PagoModal

                mostrarModal={mostrarModal}

                setMostrarModal={setMostrarModal}

                formulario={formulario}

                setFormulario={setFormulario}

                pagos={pagos}

                setPagos={setPagos}

            />

            <DetallePagoModal

                mostrarDetalle={mostrarDetalle}

                setMostrarDetalle={setMostrarDetalle}

                pagoSeleccionado={pagoSeleccionado}

                aprobarPago={aprobarPago}

                rechazarPago={rechazarPago}

                abrirFactura={(pago) => {

                    setPagoSeleccionado(pago);

                    setMostrarFactura(true);

                }}
            />

            <FacturaModal

                mostrarFactura={mostrarFactura}

                setMostrarFactura={setMostrarFactura}

                pago={pagoSeleccionado}

            />

        </div>

    );

}