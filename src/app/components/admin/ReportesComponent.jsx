"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
    FaFutbol,
    FaCalendarCheck,
    FaTrophy,
    FaUsers,
    FaMoneyBillWave,
    FaBullhorn,
    FaFilePdf,
} from "react-icons/fa";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ReportesComponent() {

    const [torneos, setTorneos] = useState([]);
    const [promociones, setPromociones] = useState([]);
    const [reservas, setReservas] = useState([]);

    const reservasPendientes = reservas.filter(
        (r) => r.estado === "Pendiente"
    ).length;

    const reservasConfirmadas = reservas.filter(
        (r) => r.estado === "Confirmada"
    ).length;

    const reservasCanceladas = reservas.filter(
        (r) => r.estado === "Cancelada"
    ).length;

    useEffect(() => {

        const datosTorneos =
            JSON.parse(localStorage.getItem("torneos")) || [];

        const datosPromociones =
            JSON.parse(localStorage.getItem("promociones")) || [];

        const datosReservas =
            JSON.parse(localStorage.getItem("reservas")) || [];

        setTorneos(datosTorneos);
        setPromociones(datosPromociones);
        setReservas(datosReservas);

    }, []);

    // Estadisticas

    const totalTorneos = torneos.length;

    const torneosActivos = torneos.filter(
        (t) => t.estado === "Activo"
    ).length;

    const totalEquipos = torneos.reduce(
        (total, torneo) =>
            total + (Array.isArray(torneo.equipos)
                ? torneo.equipos.length
                : 0),
        0
    );

    const totalReservas = reservas.length;
    const totalPromociones = promociones.length;

    const datosTorneos = [
        {
            estado: "Activos",
            cantidad: torneos.filter(
                (t) => t.estado === "Activo"
            ).length,
        },
        {
            estado: "En curso",
            cantidad: torneos.filter(
                (t) => t.estado === "En curso"
            ).length,
        },
        {
            estado: "Finalizados",
            cantidad: torneos.filter(
                (t) => t.estado === "Finalizado"
            ).length,
        },
    ];

    const ingresosPorMes = {};

    reservas.forEach((reserva) => {

        if (reserva.estado !== "Confirmada") return;

        if (!reserva.fecha) return;

        const fecha = new Date(reserva.fecha);

        const mes = fecha.toLocaleDateString("es-CO", {
            month: "long",
        });

        const mesCapitalizado =
            mes.charAt(0).toUpperCase() + mes.slice(1);

        const valor = Number(
            reserva.total ||
            reserva.valor ||
            reserva.precio ||
            0
        );

        ingresosPorMes[mesCapitalizado] =
            (ingresosPorMes[mesCapitalizado] || 0) + valor;
    });

    const reservasPorCancha = {};

    reservas.forEach((reserva) => {

        const nombreCancha =
            reserva.cancha ||
            reserva.nombreCancha ||
            "Sin cancha";

        reservasPorCancha[nombreCancha] =
            (reservasPorCancha[nombreCancha] || 0) + 1;

    });

    const totalReservasIndicador = reservas.length;

    const reservasConfirmadasIndicador = reservas.filter(
        (r) => r.estado === "Confirmada"
    ).length;

    const reservasCanceladasIndicador = reservas.filter(
        (r) => r.estado === "Cancelada"
    ).length;

    const tasaConfirmacion =
        totalReservasIndicador > 0
            ? Math.round(
                (reservasConfirmadasIndicador /
                    totalReservasIndicador) *
                100
            )
            : 0;

    const tasaCancelacion =
        totalReservasIndicador > 0
            ? Math.round(
                (reservasCanceladasIndicador /
                    totalReservasIndicador) *
                100
            )
            : 0;

    const datosCanchas = Object.entries(reservasPorCancha)
        .map(([cancha, cantidad]) => ({
            cancha,
            cantidad,
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

    const datosIngresos = Object.entries(ingresosPorMes).map(
        ([mes, ingresos]) => ({
            mes,
            ingresos,
        })
    );

    const totalIngresos = reservas.reduce(
        (total, reserva) =>
            total + Number(reserva.valor || reserva.precio || 0),
        0
    );

    const generarPDF = () => {

        const doc = new jsPDF();

        const fechaActual = new Date().toLocaleDateString("es-CO");

        // TÍTULO

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte General - FutZone", 20, 20);

        // FECHA

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha del reporte: ${fechaActual}`, 20, 28);

        // LÍNEA

        doc.line(20, 33, 190, 33);

        // RESUMEN

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Resumen General", 20, 45);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Total de torneos: ${totalTorneos}`, 20, 55);
        doc.text(`Torneos activos: ${torneosActivos}`, 20, 63);
        doc.text(`Equipos inscritos: ${totalEquipos}`, 20, 71);
        doc.text(`Total de reservas: ${totalReservas}`, 20, 79);
        doc.text(
            `Ingresos: $${Number(totalIngresos).toLocaleString("es-CO")}`,
            20,
            87
        );

        doc.text(
            `Promociones: ${totalPromociones}`,
            20,
            95
        );

        // RESERVAS

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Estado de las Reservas", 20, 110);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Confirmadas: ${reservasConfirmadasIndicador}`,
            20,
            120
        );

        doc.text(
            `Pendientes: ${reservasPendientes}`,
            20,
            128
        );

        doc.text(
            `Canceladas: ${reservasCanceladasIndicador}`,
            20,
            136
        );

        // INDICADORES

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Indicadores", 20, 151);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Tasa de confirmación: ${tasaConfirmacion}%`,
            20,
            161
        );

        doc.text(
            `Tasa de cancelación: ${tasaCancelacion}%`,
            20,
            169
        );

        // TORNEOS

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Torneos registrados", 20, 184);

        let posicionY = 194;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        torneos.forEach((torneo) => {

            doc.text(
                `${torneo.nombre} - ${torneo.estado}`,
                20,
                posicionY
            );

            posicionY += 7;

            // Si la página se llena

            if (posicionY > 275) {

                doc.addPage();

                posicionY = 20;

            }

        });

        // GUARDAR

        doc.save("Reporte-FutZone.pdf");

    };

    return (

        <div>

            {/* TÍTULO */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Reportes
                </h1>

                <p className="text-gray-500 mt-1">
                    Resumen general de FutZone
                </p>

                <button
                    onClick={generarPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-md"
                >
                    <FaFilePdf />
                    Generar PDF
                </button>

            </div>


            {/* TARJETAS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* TORNEOS */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Total Torneos
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                {totalTorneos}
                            </h2>

                            <p className="text-sm text-green-600 mt-2">
                                {torneosActivos} activos
                            </p>

                        </div>

                        <FaTrophy className="text-purple-600 text-4xl" />

                    </div>

                </div>


                {/* EQUIPOS */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Equipos inscritos
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                {totalEquipos}
                            </h2>

                        </div>

                        <FaUsers className="text-blue-600 text-4xl" />

                    </div>

                </div>


                {/* RESERVAS */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Total Reservas
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                {totalReservas}
                            </h2>

                        </div>

                        <FaCalendarCheck className="text-green-600 text-4xl" />

                    </div>

                </div>


                {/* INGRESOS */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-600">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Ingresos
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                ${totalIngresos.toLocaleString("es-CO")}
                            </h2>

                        </div>

                        <FaMoneyBillWave className="text-emerald-600 text-4xl" />

                    </div>

                </div>


                {/* PROMOCIONES */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Promociones
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                {totalPromociones}
                            </h2>

                        </div>

                        <FaBullhorn className="text-orange-500 text-4xl" />

                    </div>

                </div>


                {/* CANCHAS */}

                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-700">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Plataforma FutZone
                            </p>

                            <h2 className="text-3xl font-bold text-slate-800">
                                Activa
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                Sistema funcionando correctamente
                            </p>

                        </div>

                        <FaFutbol className="text-green-700 text-4xl" />

                    </div>

                </div>

            </div>

            {/* REPORTE DE TORNEOS */}

            <div className="bg-white rounded-2xl shadow-lg mt-8 overflow-hidden text-gray-700">

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Reporte de Torneos
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Resumen de los torneos registrados en FutZone
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-slate-800 text-white">

                                <th className="p-4 text-left">
                                    Torneo
                                </th>

                                <th className="p-4 text-center">
                                    Tipo
                                </th>

                                <th className="p-4 text-center">
                                    Equipos
                                </th>

                                <th className="p-4 text-center">
                                    Fecha inicio
                                </th>

                                <th className="p-4 text-center">
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {torneos.map((torneo) => (

                                <tr
                                    key={torneo.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4 font-semibold">
                                        {torneo.nombre}
                                    </td>

                                    <td className="p-4 text-center">
                                        {torneo.tipo}
                                    </td>

                                    <td className="p-4 text-center">
                                        {torneo.equipos?.length || 0}
                                        {" / "}
                                        {torneo.equiposMaximos || 0}
                                    </td>

                                    <td className="p-4 text-center">
                                        {torneo.fechaInicio || "-"}
                                    </td>

                                    <td className="p-4 text-center">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${torneo.estado === "Activo"
                                                ? "bg-green-100 text-green-700"
                                                : torneo.estado === "Finalizado"
                                                    ? "bg-gray-200 text-gray-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {torneo.estado}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                            {torneos.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No hay torneos registrados.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* REPORTE DE RESERVAS */}

            <div className="bg-white rounded-2xl shadow-lg mt-8 overflow-hidden text-gray-700">

                <div className="p-6 border-b">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Reporte de Reservas
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Resumen de las reservas realizadas en FutZone
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-slate-800 text-white">

                                <th className="p-4 text-left">
                                    Usuario
                                </th>

                                <th className="p-4 text-left">
                                    Cancha
                                </th>

                                <th className="p-4 text-center">
                                    Fecha
                                </th>

                                <th className="p-4 text-center">
                                    Hora
                                </th>

                                <th className="p-4 text-center">
                                    Estado
                                </th>

                                <th className="p-4 text-center">
                                    Valor
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {reservas.map((reserva, index) => (

                                <tr
                                    key={reserva.id || index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4 font-semibold">
                                        {reserva.usuario || reserva.nombreUsuario || "-"}
                                    </td>

                                    <td className="p-4">
                                        {reserva.cancha || reserva.nombreCancha || "-"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {reserva.fecha || "-"}
                                    </td>

                                    <td className="p-4 text-center">
                                        {reserva.hora || reserva.horaInicio || "-"}
                                    </td>

                                    <td className="p-4 text-center">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                                ${reserva.estado === "Pendiente"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : reserva.estado === "Confirmada"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                        `}
                                        >
                                            {reserva.estado}
                                        </span>

                                    </td>

                                    <td className="p-4 text-center font-semibold">
                                        $
                                        {Number(
                                            reserva.valor ||
                                            reserva.precio ||
                                            reserva.total ||
                                            0
                                        ).toLocaleString("es-CO")}
                                    </td>

                                </tr>

                            ))}

                            {reservas.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No hay reservas registradas.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* GRÁFICA DE TORNEOS */}

            <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Torneos por estado
                    </h2>

                    <p className="text-gray-500">
                        Distribución de los torneos registrados en FutZone
                    </p>

                </div>

                <div className="w-full h-80">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={datosTorneos}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="estado" />

                            <YAxis allowDecimals={false} />

                            <Tooltip />

                            <Bar
                                dataKey="cantidad"
                                fill="#16a34a"
                                radius={[8, 8, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>
            <br />
            {/* GRÁFICA DE RESERVAS */}

            <div className="bg-white rounded-2xl shadow-md p-6">

                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Estado de las Reservas
                </h2>

                <ResponsiveContainer width="100%" height={300}>

                    <BarChart
                        data={[
                            {
                                estado: "Pendiente",
                                cantidad: reservasPendientes,
                            },
                            {
                                estado: "Confirmada",
                                cantidad: reservasConfirmadas,
                            },
                            {
                                estado: "Cancelada",
                                cantidad: reservasCanceladas,
                            },
                        ]}
                    >

                        <XAxis dataKey="estado" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Bar
                            dataKey="cantidad"
                            fill="#00a63c"
                            radius={[8, 8, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* GRÁFICA DE INGRESOS */}

            <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Ingresos por mes
                    </h2>

                    <p className="text-gray-500">
                        Ingresos generados por reservas confirmadas
                    </p>

                </div>

                <div className="w-full h-80">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={datosIngresos}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="mes" />

                            <YAxis
                                tickFormatter={(valor) =>
                                    `$${valor.toLocaleString("es-CO")}`
                                }
                            />

                            <Tooltip
                                formatter={(valor) =>
                                    `$${Number(valor).toLocaleString("es-CO")}`
                                }
                            />

                            <Bar
                                dataKey="ingresos"
                                fill="#16a34a"
                                radius={[8, 8, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* GRÁFICA DE CANCHAS MÁS RESERVADAS */}

            <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Canchas más reservadas
                    </h2>

                    <p className="text-gray-500">
                        Canchas con mayor cantidad de reservas
                    </p>

                </div>

                <div className="w-full h-80">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={datosCanchas}
                            layout="vertical"
                            margin={{
                                left: 20,
                                right: 30,
                            }}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="cancha"
                                width={120}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="cantidad"
                                fill="#16a34a"
                                radius={[0, 8, 8, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* INDICADORES DE RENDIMIENTO */}

            <div className="mt-8">

                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Indicadores de rendimiento
                    </h2>

                    <p className="text-gray-500">
                        Métricas generales de las reservas
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                    {/* TASA DE CONFIRMACIÓN */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">

                        <p className="text-gray-500 font-medium">
                            Tasa de confirmación
                        </p>

                        <div className="flex items-center justify-between mt-3">

                            <h3 className="text-4xl font-bold text-green-600">
                                {tasaConfirmacion}%
                            </h3>

                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

                                <span className="text-green-600 text-2xl">
                                    ✓
                                </span>

                            </div>

                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                            Reservas confirmadas
                        </p>

                    </div>


                    {/* TASA DE CANCELACIÓN */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">

                        <p className="text-gray-500 font-medium">
                            Tasa de cancelación
                        </p>

                        <div className="flex items-center justify-between mt-3">

                            <h3 className="text-4xl font-bold text-red-600">
                                {tasaCancelacion}%
                            </h3>

                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">

                                <span className="text-red-600 text-2xl">
                                    ×
                                </span>

                            </div>

                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                            Reservas canceladas
                        </p>

                    </div>


                    {/* TOTAL RESERVAS */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">

                        <p className="text-gray-500 font-medium">
                            Reservas registradas
                        </p>

                        <div className="flex items-center justify-between mt-3">

                            <h3 className="text-4xl font-bold text-blue-600">
                                {totalReservasIndicador}
                            </h3>

                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                                <span className="text-blue-600 text-2xl">
                                    📅
                                </span>

                            </div>

                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                            Total de reservas
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
}