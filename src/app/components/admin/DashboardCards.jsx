"use client";

import { useEffect, useState } from "react";
import { FaChartBar, FaFutbol } from "react-icons/fa";

export default function DashboardCharts() {
    const [resumenDias, setResumenDias] = useState([]);
    const [resumenCanchas, setResumenCanchas] = useState([]);

    useEffect(() => {
        const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

        // --- 1. AGRUPACIÓN REAL POR DÍA DE LA SEMANA ---
        const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const conteoDias = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0, Dom: 0 };

        reservas.forEach((r) => {
            if (r.fecha) {
                // Convertir la fecha 'YYYY-MM-DD' a objeto Date
                const [year, month, day] = r.fecha.split("-").map(Number);
                const fechaObj = new Date(year, month - 1, day);
                const diaNombre = diasSemana[fechaObj.getDay()];

                if (conteoDias[diaNombre] !== undefined) {
                    conteoDias[diaNombre] += 1;
                }
            }
        });

        const maxReservas = Math.max(...Object.values(conteoDias), 1);
        const diasOrdenados = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

        const dataDiasFormatted = diasOrdenados.map((dia) => ({
            dia,
            total: conteoDias[dia],
            porcentaje: Math.round((conteoDias[dia] / maxReservas) * 100),
        }));

        // --- 2. AGRUPACIÓN REAL POR CANCHA RESERVADA ---
        const conteoCanchas = {};
        reservas.forEach((r) => {
            const nombreCancha = r.cancha || r.nombreCancha || "Cancha Sin Nombre";
            conteoCanchas[nombreCancha] = (conteoCanchas[nombreCancha] || 0) + 1;
        });

        const totalReservas = reservas.length || 1;
        const dataCanchasFormatted = Object.keys(conteoCanchas).map((cancha) => ({
            nombre: cancha,
            total: conteoCanchas[cancha],
            porcentaje: Math.round((conteoCanchas[cancha] / totalReservas) * 100),
        }));

        setResumenDias(dataDiasFormatted);
        setResumenCanchas(dataCanchasFormatted);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Gráfica de Reservas por Día */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaChartBar className="text-green-500" />
                        Comportamiento Semanal de Reservas
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        Datos reales
                    </span>
                </div>

                <div className="flex items-end justify-between h-48 gap-2 pt-8">
                    {resumenDias.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-gray-600">
                                {item.total}
                            </span>
                            <div className="w-full bg-gray-100 rounded-t-xl h-36 flex items-end overflow-hidden p-1">
                                <div
                                    style={{ height: `${item.porcentaje}%` }}
                                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg transition-all duration-500"
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                                {item.dia}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gráfica de Popularidad por Cancha */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaFutbol className="text-green-500" />
                        Popularidad por Cancha
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        Uso real
                    </span>
                </div>

                <div className="space-y-4">
                    {resumenCanchas.length > 0 ? (
                        resumenCanchas.map((cancha, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm font-semibold text-gray-700">
                                    <span>{cancha.nombre}</span>
                                    <span className="text-green-600">{cancha.total} reservas ({cancha.porcentaje}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${cancha.porcentaje}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-12">
                            Aún no hay reservas registradas por ningún usuario.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}