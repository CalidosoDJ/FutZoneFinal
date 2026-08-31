"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, } from "recharts";

const data = [
    { mes: "Ene", reservas: 20 },
    { mes: "Feb", reservas: 35 },
    { mes: "Mar", reservas: 28 },
    { mes: "Abr", reservas: 42 },
    { mes: "May", reservas: 60 },
];

export default function DashboardCharts() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 h-[380px] text-gray-700">

            <h2 className="font-bold text-xl mb-5">

                Reservas por Mes

            </h2>

            <ResponsiveContainer width="100%" height="90%">

                <LineChart data={data}>

                    <XAxis dataKey="mes" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="reservas"
                        stroke="#16a34a"
                        strokeWidth={4}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );
}