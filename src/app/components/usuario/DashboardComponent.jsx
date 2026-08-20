"use client";

import { useEffect, useState } from "react";

export default function DashboardComponent() {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        const data = JSON.parse(
            localStorage.getItem("usuarioLogueado")
        );

        setUsuario(data);

    }, []);

    return (

        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-8">

                <div className="
                    bg-gradient-to-r
                    from-green-600
                    to-green-800
                    text-white
                    rounded-3xl
                    p-8
                    mb-8
                ">

                    <h1 className="text-4xl font-bold">
                        Bienvenido {usuario?.nombre} ⚽
                    </h1>

                    <p className="mt-2">
                        Gestiona tus reservas desde FutZone.
                    </p>

                </div>

                <div className="grid md:grid-cols-4 gap-6">

                    <div className="bg-white p-6 rounded-3xl shadow text-black">
                        <h3>Reservas</h3>
                        <p className="text-4xl font-bold text-green-600">
                            0
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow text-black">
                        <h3>Partidos</h3>
                        <p className="text-4xl font-bold text-blue-600">
                            0
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow text-black">
                        <h3>Canchas</h3>
                        <p className="text-4xl font-bold text-yellow-500">
                            5
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow text-black">
                        <h3>Favoritas</h3>
                        <p className="text-4xl font-bold text-red-500">
                            0
                        </p>
                    </div>

                </div>

            </div>

        </div>

    );

}