"use client";

import { FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function DetallePagoModal({
    mostrarDetalle,
    setMostrarDetalle,
    pagoSeleccionado,
    aprobarPago,
    rechazarPago,
    abrirFactura,
}) {
    if (!mostrarDetalle || !pagoSeleccionado) return null;

    const resolverUrlComprobante = (url) => {
        if (!url) return "";
        if (url.startsWith("data:") || url.startsWith("http")) return url;
        return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const urlComprobante = resolverUrlComprobante(pagoSeleccionado.comprobante);
    const esPdf = urlComprobante.toLowerCase().endsWith(".pdf") || urlComprobante.startsWith("data:application/pdf");

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-6">
                    <h2 className="text-3xl font-bold">Detalle del Pago</h2>
                    <button
                        onClick={() => setMostrarDetalle(false)}
                        className="cursor-pointer"
                    >
                        <FaTimes size={24} className="text-red-600 hover:text-red-700" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="font-semibold">Cliente</label>
                            <input
                                readOnly
                                value={pagoSeleccionado.cliente}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Cancha</label>
                            <input
                                readOnly
                                value={pagoSeleccionado.cancha}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Valor</label>
                            <input
                                readOnly
                                value={`$${Number(pagoSeleccionado.valor).toLocaleString("es-CO")}`}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Método de Pago</label>
                            <input
                                readOnly
                                value={pagoSeleccionado.metodo}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Referencia FutZone</label>
                            <input
                                readOnly
                                value={pagoSeleccionado.referenciaSistema}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Referencia Nequi</label>
                            <input
                                readOnly
                                value={pagoSeleccionado.referenciaNequi}
                                className="w-full bg-gray-100 border rounded-xl p-3 mt-2"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="mt-8">
                        <label className="font-semibold">Estado del Pago</label>
                        <div className="mt-3">
                            <span
                                className={`px-4 py-2 rounded-full font-semibold ${pagoSeleccionado.estado === "Pagado"
                                        ? "bg-green-100 text-green-700"
                                        : pagoSeleccionado.estado === "Pendiente"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {pagoSeleccionado.estado}
                            </span>
                        </div>
                    </div>

                    {/* Comprobante */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Comprobante de Transferencia</h3>

                        {urlComprobante ? (
                            esPdf ? (
                                <div className="bg-gray-100 p-5 rounded-xl flex items-center justify-between">
                                    <span className="font-medium">Comprobante en formato PDF</span>
                                    <a
                                        href={urlComprobante}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                                    >
                                        Abrir PDF <FaExternalLinkAlt />
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <img
                                        src={urlComprobante}
                                        alt="Comprobante de pago"
                                        className="max-h-96 w-auto rounded-xl border shadow-sm"
                                    />
                                    <a
                                        href={urlComprobante}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-semibold"
                                    >
                                        Ver imagen completa <FaExternalLinkAlt />
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
                                No se adjuntó comprobante (pago presencial o sin captura).
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="mt-10 flex flex-wrap justify-end gap-4 border-t pt-6">
                        {pagoSeleccionado.estado === "Pendiente" && (
                            <>
                                <button
                                    onClick={() => {
                                        aprobarPago(pagoSeleccionado.id);
                                        setMostrarDetalle(false);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                                >
                                    Aprobar Pago
                                </button>

                                <button
                                    onClick={() => {
                                        rechazarPago(pagoSeleccionado.id);
                                        setMostrarDetalle(false);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                                >
                                    Rechazar Pago
                                </button>
                            </>
                        )}

                        {pagoSeleccionado.estado === "Pagado" && (
                            <button
                                onClick={() => abrirFactura(pagoSeleccionado)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                            >
                                Ver Factura
                            </button>
                        )}

                        <button
                            onClick={() => setMostrarDetalle(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}