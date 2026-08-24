"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default function CardCancha({ cancha }) {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2">

            <Image
                src={cancha.imagen}
                alt={cancha.nombre}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
            />

            <div className="p-6">

                <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-black text-slate-800">
                        {cancha.nombre}
                    </h2>

                    <div className="flex items-center gap-1">

                        <Star
                            size={18}
                            className="text-yellow-500 fill-yellow-400"
                        />

                        <span className="font-bold">
                            {cancha.calificacion}
                        </span>

                    </div>

                </div>

                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full mt-3 text-sm font-semibold">

                    {cancha.zona}

                </span>

                <div className="flex items-center gap-2 mt-5 text-slate-500">

                    <MapPin size={18} />

                    <span>{cancha.direccion}</span>

                </div>

                <div className="mt-6 flex justify-between items-center">

                    <p className="text-2xl font-black text-green-600">
                        ${cancha.precio.toLocaleString()}
                    </p>

                    <Link
                        href={`/reserva/${cancha.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
                    >
                        Reservar
                    </Link>

                </div>

            </div>

        </div>
    );
}