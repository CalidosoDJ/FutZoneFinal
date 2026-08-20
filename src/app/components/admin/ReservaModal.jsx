"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ReservaModal({

    mostrarModal,
    setMostrarModal,

    formulario,
    setFormulario,

    guardarReserva,
    actualizarReserva,

    editando,

}) {

    const [usuarios, setUsuarios] = useState([]);

    const [canchas, setCanchas] = useState([]);

    useEffect(() => {

        const usuariosGuardados =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const canchasGuardadas =
            JSON.parse(localStorage.getItem("canchas")) || [];

        setUsuarios(usuariosGuardados);

        setCanchas(canchasGuardadas);

    }, []);

    // calcular total automáticamente

    useEffect(() => {

        setFormulario((prev) => ({

            ...prev,

            total:
                Number(prev.precioHora) *
                Number(prev.duracion),

        }));

    }, [formulario.precioHora, formulario.duracion]);

    if (!mostrarModal) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40 text-gray-700">

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8">

                {/* Header */}

                <div className="flex justify-between items-center mb-8 bg-green-600 text-white p-4 rounded-xl">

                    <h2 className="text-3xl font-bold">

                        {editando
                            ? "Editar Reserva"
                            : "Nueva Reserva"}

                    </h2>

                    <button
                        onClick={() => setMostrarModal(false)}
                    >

                        <FaTimes size={22} />

                    </button>

                </div>

                {/* Cliente */}

                <div className="mb-5">

                    <label className="font-semibold">

                        Cliente

                    </label>

                    <select

                        value={formulario.cliente}

                        onChange={(e) =>
                            setFormulario({
                                ...formulario,
                                cliente: e.target.value,
                            })
                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option value="">
                            Seleccione...
                        </option>

                        {usuarios.map((u, index) => (

                            <option
                                key={index}
                                value={u.nombre}
                            >

                                {u.nombre}

                            </option>

                        ))}

                    </select>

                </div>

                {/* Cancha */}

                <div className="mb-5">

                    <label className="font-semibold">

                        Cancha

                    </label>

                    <select

                        value={formulario.cancha}

                        onChange={(e) => {

                            const cancha =
                                canchas.find(
                                    (c) =>
                                        c.nombre ===
                                        e.target.value
                                );

                            setFormulario({

                                ...formulario,

                                cancha: cancha.nombre,

                                precioHora:
                                    cancha.precio,

                            });

                        }}

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option>
                            Seleccione...
                        </option>

                        {canchas.map((c, index) => (

                            <option
                                key={index}
                                value={c.nombre}
                            >

                                {c.nombre}

                            </option>

                        ))}

                    </select>

                </div>

                <div className="grid grid-cols-2 gap-5">

                    {/* Fecha */}

                    <div>

                        <label>Fecha</label>

                        <input

                            type="date"

                            value={formulario.fecha}

                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    fecha:
                                        e.target.value,
                                })
                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                    {/* Hora */}

                    <div>

                        <label>Hora</label>

                        <input

                            type="time"

                            value={formulario.hora}

                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    hora:
                                        e.target.value,
                                })
                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        />

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-5 mt-5">

                    {/* Duración */}

                    <div>

                        <label>Duración</label>

                        <select

                            value={formulario.duracion}

                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    duracion:
                                        e.target.value,

                                })
                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        >

                            <option value={1}>1 Hora</option>

                            <option value={2}>2 Horas</option>

                            <option value={3}>3 Horas</option>

                        </select>

                    </div>

                    {/* Pago */}

                    <div>

                        <label>Método Pago</label>

                        <select

                            value={formulario.metodoPago}

                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    metodoPago:
                                        e.target.value,

                                })
                            }

                            className="w-full border rounded-xl p-3 mt-2"

                        >

                            <option>Efectivo</option>

                            <option>Nequi</option>

                            <option>Daviplata</option>

                            <option>Transferencia</option>

                        </select>

                    </div>

                </div>

                {/* Estado */}

                <div className="mt-5">

                    <label>Estado</label>

                    <select

                        value={formulario.estado}

                        onChange={(e) =>
                            setFormulario({

                                ...formulario,

                                estado:
                                    e.target.value,

                            })
                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option>Pendiente</option>

                        <option>Confirmada</option>

                        <option>Cancelada</option>

                    </select>

                </div>

                {/* Total */}

                <div className="mt-8 bg-green-50 rounded-xl p-5">

                    <h3 className="font-bold text-xl">

                        Total

                    </h3>

                    <p className="text-3xl font-bold text-green-700">

                        ${Number(formulario.total).toLocaleString()}

                    </p>

                </div>

                {/* Botones */}

                <div className="flex justify-end gap-4 mt-8">

                    <button

                        onClick={() =>
                            setMostrarModal(false)
                        }

                        className="bg-gray-300 px-6 py-3 rounded-xl"

                    >

                        Cancelar

                    </button>

                    <button

                        onClick={
                            editando
                                ? actualizarReserva
                                : guardarReserva
                        }

                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"

                    >

                        {editando
                            ? "Actualizar"
                            : "Guardar"}

                    </button>

                </div>

            </div>

        </div>

    );

}