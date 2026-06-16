import Image from "next/image";
import Link from "next/link";

export default function CanchaCard({ cancha }) {

    return (

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex hover:shadow-2xl transition h-[100%]">

            <div className="flex flex-col md:flex-row w-full">
                {/* Imagen */}
                <div className="relative md:w-[260px] h-[300px] flex-shrink-0">

                    <Image
                        src={cancha.imagen}
                        alt={cancha.nombre}
                        fill
                        className="object-cover"
                    />

                </div>

                {/* Información */}
                <div className="w-[70%] p-6 flex flex-col justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-green-700 mb-3">
                            {cancha.nombre}
                        </h2>

                        <div className="space-y-2 text-gray-700">

                            <p>
                                <span className="font-semibold">Complejo:</span> FutZone
                            </p>

                            <p>
                                <span className="font-semibold">Ubicación:</span> Complejo Deportivo FutZone
                            </p>

                            <p>
                                <span className="font-semibold">Teléfono:</span> 3106021273
                            </p>

                            <p>
                                <span className="font-semibold">Precio:</span> {cancha.precio}
                            </p>

                        </div>

                    </div>

                    <div className="flex gap-3">
                        <Link href="/login">
                            <button className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-6
                            py-3
                            rounded-xl">
                            Reservar
                            </button>
                        </Link>

                        <Link href="/ubicacion">
                            <button className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            border
                            border-gray-300
                            px-6
                            py-3
                            rounded-xl
                            ">
                            Cómo llegar
                        </button>
                        
                        </Link> 

                    </div>

                </div>

            </div>

        </div>
    );
}