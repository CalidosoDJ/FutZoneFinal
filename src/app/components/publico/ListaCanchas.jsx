"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CardCancha from "./CardCancha";

export default function ListaCanchas() {

    const [buscar, setBuscar] = useState("");
    const [tipo, setTipo] = useState("Todas");

    const canchas = [

        {
            id: 1,
            nombre: "Cancha Sintética #1",
            imagen: "/img/cancha1.jpg",
            zona: "Fútbol 5",
            precio: 90000,
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            calificacion: 4.9,
        },

        {
            id: 2,
            nombre: "Cancha Sintética #2",
            imagen: "/img/cancha2.jpg",
            zona: "Fútbol 5",
            precio: 90000,
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            calificacion: 4.8,
        },

        {
            id: 3,
            nombre: "Cancha Sintética #3",
            imagen: "/img/cancha3.jpg",
            zona: "Fútbol 6",
            precio: 100000,
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            calificacion: 4.9,
        },

        {
            id: 4,
            nombre: "Cancha Profesional",
            imagen: "/img/cancha4.jpg",
            zona: "Fútbol 8",
            precio: 120000,
            direccion: "Centro Deportivo El Cubo",
            telefono: "3106021273",
            calificacion: 5,
        }

    ];

    const lista = canchas.filter((cancha) => {

        const nombre = cancha.nombre
            .toLowerCase()
            .includes(buscar.toLowerCase());

        const categoria =
            tipo === "Todas" || cancha.zona === tipo;

        return nombre && categoria;

    });

    return (

        <section className="bg-[#08111f] py-24">

            <div className="max-w-7xl mx-auto px-8">

                {/* Titulo */}

                <div className="text-center mb-16">

                    <span className="text-green-400 uppercase tracking-widest font-semibold">

                        Disponibilidad

                    </span>

                    <h2 className="text-5xl font-black text-white mt-4">

                        Nuestras Canchas

                    </h2>

                    <p className="text-gray-400 mt-5 max-w-3xl mx-auto text-lg">

                        Escoge la cancha ideal para tu partido.
                        Todas pertenecen al Centro Deportivo El Cubo.

                    </p>

                </div>

                {/* Buscador */}

                <div className="bg-[#111827] rounded-3xl p-8 mb-16 shadow-2xl">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        <div className="relative">

                            <Search
                                className="absolute left-5 top-4 text-green-500"
                            />

                            <input
                                type="text"
                                placeholder="Buscar cancha..."
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                className="w-full bg-[#1F2937] rounded-2xl py-4 pl-14 text-white outline-none"
                            />

                        </div>

                        <select

                            value={tipo}

                            onChange={(e) => setTipo(e.target.value)}

                            className="bg-[#1F2937] rounded-2xl px-5 text-white"

                        >

                            <option>Todas</option>

                            <option>Fútbol 5</option>

                            <option>Fútbol 6</option>

                            <option>Fútbol 8</option>

                        </select>

                        <button

                            className="

                            bg-green-500

                            hover:bg-green-600

                            rounded-2xl

                            text-white

                            font-bold

                            flex

                            justify-center

                            items-center

                            gap-3

                            "

                        >

                            <SlidersHorizontal />

                            Filtrar

                        </button>

                    </div>

                </div>

                {/* Contador */}

                <div className="flex justify-between items-center mb-10">

                    <h3 className="text-white text-2xl font-bold">

                        {lista.length} Canchas disponibles

                    </h3>

                    <span className="text-green-400">

                        Centro Deportivo El Cubo

                    </span>

                </div>

                {/* Tarjetas */}

                <div className="grid lg:grid-cols-2 gap-10">

                    {lista.map((cancha) => (

                        <CardCancha

                            key={cancha.id}

                            cancha={cancha}

                        />

                    ))}

                </div>

            </div>

        </section>

    );

}