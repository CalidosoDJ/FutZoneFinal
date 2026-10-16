"use client";

import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default function DashboardCharts() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // 1. Obtener las reservas guardadas por los usuarios
        const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

        // 2. Definir los meses del año
        const mesesNombres = [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];

        // Inicializar el contador para cada mes en 0
        const conteoMeses = {
            Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0,
            Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Dic: 0
        };

        // 3. Agrupar las reservas reales según el mes de su fecha
        reservas.forEach((reserva) => {
            if (reserva.fecha) {
                // Parsear fecha YYYY-MM-DD
                const partes = reserva.fecha.split("-");
                if (partes.length === 3) {
                    const mesIndex = parseInt(partes[1], 10) - 1; // 0 para Enero, 1 para Febrero...
                    if (mesIndex >= 0 && mesIndex < 12) {
                        const nombreMes = mesesNombres[mesIndex];
                        conteoMeses[nombreMes] += 1;
                    }
                }
            }
        });

        // 4. Formatear la estructura requerida por Recharts
        const datosReales = mesesNombres.map((mes) => ({
            mes,
            reservas: conteoMeses[mes],
        }));

        setChartData(datosReales);
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[380px] text-gray-700">
            <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-xl text-gray-900">
                    Reservas por Mes
                </h2>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Datos reales
                </span>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="mes"
                        stroke="#64748b"
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        allowDecimals={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "12px",
                            color: "#fff",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        }}
                        itemStyle={{ color: "#22c55e" }}
                        formatter={(value) => [`${value} reservas`, "Total"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="reservas"
                        stroke="#16a34a"
                        strokeWidth={4}
                        dot={{ fill: "#16a34a", r: 5 }}
                        activeDot={{ r: 8, fill: "#22c55e" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}