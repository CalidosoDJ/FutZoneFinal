"use client";

import Image from "next/image";
import { FaTimes, FaPrint, FaFilePdf } from "react-icons/fa";

export default function FacturaModal({

    mostrarFactura,

    setMostrarFactura,

    pago,

}) {

    if (!mostrarFactura || !pago) return null;

    const imprimir = () => {

        window.print();

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-3xl max-w-4x1 max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold">

                        Factura FutZone

                    </h2>

                    <button

                        onClick={() => setMostrarFactura(false)}

                    >

                        <FaTimes
                            size={22}
                            className="text-red-600"
                        />

                    </button>

                </div>

                {/* Factura */}

                <div
                    id="factura"
                    className="p-8 mt-0"
                >

                    <div className="flex justify-between items-center">

                        <div>

                            <Image

                                src="/icons/futzone logo.jpeg"

                                width={55}

                                height={55}

                                alt="Logo"

                            />

                            <h1 className="text-2xl font-bold">

                                FutZone

                            </h1>

                            <p className="text-gray-500">

                                Sistema de Reservas Deportivas

                            </p>

                        </div>

                        <div className="text-right">

                            <h2 className="text-2xl font-bold">

                                FACTURA

                            </h2>

                            <p>

                                N°

                                FAC-{pago.id}

                            </p>

                            <p>

                                {new Date().toLocaleDateString()}

                            </p>

                        </div>

                    </div>

                    <hr className="mb-8"/>

                    <div className="grid grid-cols-2 gap-5">

                        <div>

                            <h3 className="font-bold text-lg mb-4">

                                Cliente

                            </h3>

                            <p>

                                {pago.cliente}

                            </p>

                        </div>

                        <div>

                            <h3 className="font-bold text-lg mb-4">

                                Información

                            </h3>

                            <p>

                                Cancha:

                                {pago.cancha}

                            </p>

                            <p>

                                Método:

                                {pago.metodo}

                            </p>

                            <p>

                                Estado:

                                {pago.estado}

                            </p>

                        </div>

                    </div>

                    <div className="mt-2">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-green-600 text-white">

                                    <th className="py-2">

                                        Concepto

                                    </th>

                                    <th>

                                        Referencia

                                    </th>

                                    <th>

                                        Valor

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr className="border">

                                    <td className="py-2 px-3">

                                        Reserva de cancha

                                    </td>

                                    <td>

                                        {pago.referenciaSistema}

                                    </td>

                                    <td>

                                        $

                                        {Number(pago.valor).toLocaleString()}

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                    <div className="mt-2 flex justify-end">

                        <div className="text-right">

                            <h2 className="text-2xl font-bold">

                                TOTAL

                            </h2>

                            <p className="text-3xl font-bold text-green-600">

                                $

                                {Number(pago.valor).toLocaleString()}

                            </p>

                        </div>

                    </div>

                    <div className="text-center text-gray-500">

                        !Gracias por utilizar FutZone!.

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t p-6 flex justify-end gap-4">

                    <button

                        onClick={imprimir}

                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

                    >

                        <FaPrint/>

                        Imprimir

                    </button>

                    <button

                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

                    >

                        <FaFilePdf/>

                        Descargar PDF

                    </button>

                </div>

            </div>

        </div>

    );

}