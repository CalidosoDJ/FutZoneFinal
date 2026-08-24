"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CardCancha from "./CardCancha";

export default function ListaCanchas() {

    const [buscar, setBuscar] = useState("");
    const [zona, setZona] = useState("todas");
    const [precio, setPrecio] = useState("ninguno");

    const canchas = [

        {
            id: 1,
            nombre: "Cancha Sintética #1",
            zona: "Fútbol 5",
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            precio: 90000,
            imagen: "/images/cancha1.jpg",
            calificacion: 4.9,
        },

        {
            id: 2,
            nombre: "Cancha Sintética #2",
            zona: "Fútbol 5",
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            precio: 90000,
            imagen: "/images/cancha2.jpg",
            calificacion: 4.8,
        },

        {
            id: 3,
            nombre: "Cancha Sintética #3",
            zona: "Fútbol 6",
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            precio: 100000,
            imagen: "/images/cancha3.webp",
            calificacion: 4.9,
        },

        {
            id: 4,
            nombre: "Cancha Sintética #4",
            zona: "Fútbol 7",
            direccion: "Popayán",
            telefono: "3015550328",
            precio: 90000,
            imagen: "/images/cancha4.webp",
            calificacion: 4.7,
        },

        {
            id: 5,
            nombre: "Cancha Sintética #5",
            zona: "Fútbol 6",
            direccion: "Popayán",
            telefono: "3127599503",
            precio: 75000,
            imagen: "/images/cancha5.jpg",
            calificacion: 4.6,
        },

        {
            id: 6,
            nombre: "Cancha Sintética #6",
            zona: "Fútbol 5",
            direccion: "Popayán",
            telefono: "3122971247",
            precio: 80000,
            imagen: "/images/cancha6.jpg",
            calificacion: 4.8,
        },

    ];

    let lista = canchas.filter(
        (c) =>
            c.nombre.toLowerCase().includes(buscar.toLowerCase()) &&
            (zona === "todas" || c.zona === zona)
    );

    if (precio === "menor") {
        lista.sort((a, b) => a.precio - b.precio);
    }

    if (precio === "mayor") {
        lista.sort((a, b) => b.precio - a.precio);
    }

    return (

        <div className="min-h-screen bg-slate-100">

            {/* HERO */}

            <section className="bg-gradient-to-r from-green-700 to-green-600 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <h1 className="text-5xl font-black text-white">
                        Encuentra tu cancha ideal
                    </h1>

                    <p className="text-green-100 mt-5 text-lg max-w-2xl">
                        Reserva la mejor cancha para tu próximo partido de forma rápida y segura.
                    </p>

                </div>

            </section>

            {/* FILTROS */}

            <section className="max-w-7xl mx-auto px-6 -mt-10">

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <div className="grid md:grid-cols-3 gap-5">

                        <div className="relative">

                            <Search
                                className="absolute left-4 top-4 text-green-600"
                                size={20}
                            />

                            <input
                                type="text"
                                placeholder="Buscar cancha..."
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                className="w-full border text-gray-700 rounded-xl py-3 pl-12"
                            />

                        </div>

                        <select
                            value={zona}
                            onChange={(e) => setZona(e.target.value)}
                            className="border text-gray-700 rounded-xl px-4"
                        >

                            <option value="todas">Todas las canchas</option>
                            <option value="Fútbol 5">Fútbol 5</option>
                            <option value="Fútbol 6">Fútbol 6</option>
                            <option value="Fútbol 7">Fútbol 7</option>

                        </select>

                        <select
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="border text-gray-700 rounded-xl px-4"
                        >

                            <option value="ninguno">Ordenar por precio</option>
                            <option value="menor">Menor a mayor</option>
                            <option value="mayor">Mayor a menor</option>

                        </select>

                    </div>

                </div>

            </section>

            {/* CONTADOR */}

            <section className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex justify-between items-center mb-10">

                    <h2 className="text-2xl text-gray-700 font-black">

                        {lista.length} Canchas disponibles

                    </h2>

                    <span className="text-green-600 font-semibold">

                        FutZone

                    </span>

                </div>

                {/* TARJETAS */}

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {lista.length > 0 ? (

                        lista.map((cancha) => (

                            <CardCancha
                                key={cancha.id}
                                cancha={cancha}
                            />

                        ))

                    ) : (

                        <div className="col-span-3 bg-white rounded-3xl p-12 shadow-lg text-center">

                            <h2 className="text-3xl font-bold text-slate-700">

                                No se encontraron canchas

                            </h2>

                            <p className="text-slate-500 mt-3">

                                Cambia los filtros o busca otra cancha.

                            </p>

                        </div>

                    )}

                </div>

            </section>

        </div>

    );

}