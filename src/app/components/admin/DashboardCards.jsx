"use client";

import { FaFutbol, FaCalendarCheck, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const datos = [
    {
        titulo: "Canchas",
        valor: 5,
        icono: <FaFutbol size={25} />,
        color: "bg-green-500",
    },
    {
        titulo: "Reservas Hoy",
        valor: 18,
        icono: <FaCalendarCheck size={25} />,
        color: "bg-blue-500",
    },
    {
        titulo: "Usuarios",
        valor: 42,
        icono: <FaUsers size={25} />,
        color: "bg-orange-500",
    },
    {
        titulo: "Ingresos",
        valor: "$2.3M",
        icono: <FaMoneyBillWave size={25} />,
        color: "bg-purple-500",
    },
];

export default function DashboardCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {datos.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex justify-between items-center">

                    <div>

                        <p className="text-gray-500">
                            {card.titulo}
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {card.valor}
                        </h2>

                    </div>

                    <div
                        className={`${card.color} p-4 rounded-xl text-white`}
                    >
                        {card.icono}
                    </div>

                </div>

            ))}

        </div>

    );
}