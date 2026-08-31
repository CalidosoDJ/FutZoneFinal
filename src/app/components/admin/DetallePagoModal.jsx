"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function DetallePagoModal({

    mostrarDetalle,

    setMostrarDetalle,

    pagoSeleccionado,

    aprobarPago,

    rechazarPago,

    abrirFactura,

}) {

    if (!mostrarDetalle || !pagoSeleccionado) return null;

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-3xl font-bold">

                        Detalle del Pago

                    </h2>

                    <button
                        onClick={() => setMostrarDetalle(false)}
                    >

                        <FaTimes
                            size={24}
                            className="text-red-600 hover:text-red-700"
                        />

                    </button>

                </div>

                {/* Contenido */}

                <div className="p-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>

                            <label className="font-semibold">

                                Cliente

                            </label>

                            <input

                                readOnly

                                value={pagoSeleccionado.cliente}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Cancha

                            </label>

                            <input

                                readOnly

                                value={pagoSeleccionado.cancha}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Valor

                            </label>

                            <input

                                readOnly

                                value={`$${Number(pagoSeleccionado.valor).toLocaleString()}`}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Método de Pago

                            </label>

                            <input

                                readOnly

                                value={pagoSeleccionado.metodo}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Referencia FutZone

                            </label>

                            <input

                                readOnly

                                value={pagoSeleccionado.referenciaSistema}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Referencia Nequi

                            </label>

                            <input

                                readOnly

                                value={pagoSeleccionado.referenciaNequi}

                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"

                            />

                        </div>

                    </div>

                    {/* Estado */}

                    <div className="mt-8">

                        <label className="font-semibold">

                            Estado del Pago

                        </label>

                        <div className="mt-3">

                            <span
                                className={`

                                    px-4

                                    py-2

                                    rounded-full

                                    font-semibold

                                    ${pagoSeleccionado.estado === "Pagado"

                                        ? "bg-green-100 text-green-700"

                                        : pagoSeleccionado.estado === "Pendiente de Verificación"

                                            ? "bg-yellow-100 text-yellow-700"

                                            : "bg-red-100 text-red-700"

                                    }

                                `}
                            >

                                {pagoSeleccionado.estado}

                            </span>

                        </div>

                    </div>

                    {/* Comprobante */}

                    <div className="mt-8">

                        <h3 className="text-xl font-bold mb-4">

                            Comprobante

                        </h3>

                        {

                            pagoSeleccionado.comprobante

                                ?

                                pagoSeleccionado.comprobante.startsWith("data:image")

                                    ?

                                    <Image

                                        src={pagoSeleccionado.comprobante}

                                        width={400}

                                        height={400}

                                        alt="Comprobante"

                                        className="rounded-xl border"

                                    />

                                    :

                                    <div className="bg-gray-100 p-5 rounded-xl">

                                        Comprobante PDF cargado.

                                    </div>

                                :

                                <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                                    No se adjuntó comprobante.

                                </div>

                        }

                    </div>

                    {/* Botones */}

                    <div className="mt-10 flex flex-wrap justify-end gap-4 border-t pt-6">

                        {/* Aprobar */}

                        {

                            pagoSeleccionado.estado === "Pendiente de Verificación" && (

                                <button

                                    onClick={() => {

                                        aprobarPago(pagoSeleccionado.id);

                                        setMostrarDetalle(false);

                                    }}

                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"

                                >

                                    Aprobar Pago

                                </button>

                            )

                        }

                        {/* Rechazar */}

                        {

                            pagoSeleccionado.estado === "Pendiente de Verificación" && (

                                <button

                                    onClick={() => {

                                        rechazarPago(pagoSeleccionado.id);

                                        setMostrarDetalle(false);

                                    }}

                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"

                                >

                                    Rechazar Pago

                                </button>

                            )

                        }

                        {/* Factura */}

                        {

                            pagoSeleccionado.estado === "Pagado" && (

                                <button

                                    onClick={() => abrirFactura(pagoSeleccionado)}

                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"

                                >

                                    Ver Factura

                                </button>

                            )

                        }

                        {/* Cerrar */}

                        <button

                            onClick={() => setMostrarDetalle(false)}

                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl font-semibold transition"

                        >

                            Cerrar

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}