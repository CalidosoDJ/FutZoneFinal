"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function PagoModal({

    mostrarModal,
    setMostrarModal,

    formulario,
    setFormulario,

    pagos,
    setPagos,

}) {

    const [reservas, setReservas] = useState([]);

    const generarReferencia = () => {

        const fecha = new Date();

        const codigo = Math.floor(
            1000 + Math.random() * 9000
        );

        return `FTZ-${fecha.getFullYear()}${String(
            fecha.getMonth() + 1
        ).padStart(2, "0")}${String(
            fecha.getDate()
        ).padStart(2, "0")}-${codigo}`;

    };

    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("reservas")) || [];

        setReservas(datos);

    }, []);

    useEffect(() => {

        if (
            mostrarModal &&
            !formulario.referenciaSistema
        ) {

            setFormulario((prev) => ({

                ...prev,

                referenciaSistema:
                    generarReferencia(),

            }));

        }

    }, [mostrarModal]);

    const cargarComprobante = (e) => {

        const archivo = e.target.files[0];

        if (!archivo) return;

        const reader = new FileReader();

        reader.onload = () => {

            setFormulario({

                ...formulario,

                comprobante: reader.result,

            });

        };

        reader.readAsDataURL(archivo);

    };

    const guardarPago = () => {

        if (
            !formulario.cliente ||
            !formulario.cancha
        ) {

            alert("Seleccione una reserva");

            return;

        }

        const nuevoPago = {

            ...formulario,

            estado:
                formulario.metodo === "Nequi"

                    ? "Pendiente de Verificación"

                    : "Pagado",

            id: Date.now(),

        };

        const nuevos = [

            ...pagos,

            nuevoPago,

        ];

        setPagos(nuevos);

        localStorage.setItem(
            "pagos",
            JSON.stringify(nuevos)
        );

        alert("Pago registrado");

        setMostrarModal(false);

    };

    if (!mostrarModal) return null;
    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-6 z-50 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6 bg-green-600 text-white">

                    <h2 className="text-3xl font-bold">

                        Registrar Pago

                    </h2>

                    <button
                        onClick={() => setMostrarModal(false)}
                    >

                        <FaTimes size={22} />

                    </button>

                </div>

                {/* Contenido */}

                <div className="p-6">

                    {/* Reserva */}

                    <label className="font-semibold">

                        Reserva

                    </label>

                    <select

                        value={formulario.idReserva || ""}

                        onChange={(e) => {

                            const reserva = reservas.find(

                                (r) =>

                                    String(r.id) === e.target.value

                            );

                            if (!reserva) return;

                            setFormulario({

                                ...formulario,

                                idReserva: reserva.id,

                                cliente: reserva.cliente,

                                cancha: reserva.cancha,

                                valor: reserva.total,

                                fecha: reserva.fecha,

                            });

                        }}

                        className="w-full border rounded-xl p-3 mt-2 mb-6"

                    >

                        <option value="">

                            Seleccione una reserva

                        </option>

                        {

                            reservas.map((r) => (

                                <option
                                    key={r.id}
                                    value={r.id}
                                >

                                    {r.cliente} - {r.cancha}

                                </option>

                            ))

                        }

                    </select>

                    {/* Datos */}

                    <div className="grid grid-cols-2 gap-6">

                        <div>

                            <label>

                                Cliente

                            </label>

                            <input

                                readOnly

                                value={formulario.cliente}

                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"

                            />

                        </div>

                        <div>

                            <label>

                                Cancha

                            </label>

                            <input

                                readOnly

                                value={formulario.cancha}

                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"

                            />

                        </div>

                        <div>

                            <label>

                                Valor

                            </label>

                            <input

                                readOnly

                                value={`$${Number(formulario.valor).toLocaleString()}`}

                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"

                            />

                        </div>

                        <div>

                            <label>

                                Fecha

                            </label>

                            <input

                                readOnly

                                value={formulario.fecha}

                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"

                            />

                        </div>

                    </div>

                    {/* Método */}

                    <div className="mt-8">

                        <label className="font-semibold text-lg">

                            Método de Pago

                        </label>

                        <div className="flex gap-10 mt-4">

                            <label className="flex items-center gap-2">

                                <input

                                    type="radio"

                                    checked={formulario.metodo === "Efectivo"}

                                    onChange={() =>

                                        setFormulario({

                                            ...formulario,

                                            metodo: "Efectivo",

                                        })

                                    }

                                />

                                Efectivo

                            </label>

                            <label className="flex items-center gap-2">

                                <input

                                    type="radio"

                                    checked={formulario.metodo === "Nequi"}

                                    onChange={() =>

                                        setFormulario({

                                            ...formulario,

                                            metodo: "Nequi",

                                        })

                                    }

                                />

                                Nequi

                            </label>

                        </div>

                    </div>
                    {/* Sección Nequi */}

                    {formulario.metodo === "Nequi" && (

                        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">

                            <h3 className="text-2xl font-bold text-green-700 mb-5">

                                Pago por Nequi

                            </h3>

                            <div className="flex justify-center">

                                <Image
                                    src="/images/qr.webp"
                                    width={250}
                                    height={250}
                                    alt="QR Nequi"
                                    className="rounded-xl shadow"
                                />

                            </div>

                            <div className="mt-6 space-y-3">

                                <p>

                                    <strong>Número Nequi:</strong>

                                    3106021273

                                </p>

                                <p>

                                    <strong>Valor a pagar:</strong>
                                    ${Number(formulario.valor).toLocaleString()}

                                </p>

                                <p>

                                    <strong>Referencia FutZone:</strong>
                                    <span className="text-green-700 font-bold ml-2">
                                        {formulario.referenciaSistema}
                                    </span>

                                </p>

                            </div>

                            <div className="mt-6">
                                <label className="font-semibold">
                                    Referencia que aparece en Nequi
                                </label>

                                <input
                                    type="text"
                                    value={formulario.referenciaNequi}
                                    onChange={(e) =>
                                        setFormulario({
                                            ...formulario,
                                            referenciaNequi: e.target.value
                                        })

                                    }

                                    placeholder="Ej: 985632147"
                                    className="w-full border rounded-xl p-3 mt-2"

                                />

                            </div>

                            <div className="mt-6">
                                <label className="font-semibold">
                                    Adjuntar comprobante
                                </label>

                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={cargarComprobante}
                                    className="mt-3"
                                />

                            </div>

                            {

                                formulario.comprobante && (
                                    <div className="mt-6">
                                        <p className="font-semibold mb-3">
                                            Vista previa
                                        </p>

                                        {

                                            formulario.comprobante.startsWith("data:image")
                                                ?
                                                <Image
                                                    src={formulario.comprobante}
                                                    width={250}
                                                    height={250}
                                                    alt="Comprobante"
                                                    className="rounded-xl border"

                                                />

                                                :

                                                <div className="bg-gray-100 rounded-xl p-4">

                                                    PDF cargado correctamente

                                                </div>
                                        }
                                    </div>

                                )

                            }

                        </div>

                    )}

                </div>

                {/* Footer */}

                <div className="border-t p-6 flex justify-end gap-4">
                    <button
                        onClick={() => setMostrarModal(false)}
                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>

                    <button

                        onClick={guardarPago}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"

                    >

                        {

                            formulario.metodo === "Nequi"
                                ? "Enviar comprobante"
                                : "Registrar Pago"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}