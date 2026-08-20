"use client";

import { useState, useEffect } from "react";
import {
    FaCog, FaBuilding, FaFutbol, FaBell, FaLock, FaSave, FaEye,
    FaEyeSlash,
} from "react-icons/fa";

export default function ConfiguracionPage() {

    const [configuracion, setConfiguracion] = useState({
        nombre: "FutZone",
        correo: "",
        telefono: "",
        ciudad: "Popayán",
        permitirCancelaciones: true,
        tiempoCancelacion: 2,
        nuevasReservas: true,
        cancelaciones: true,
        pagos: true,
        torneos: true,
    });

    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [passwordActual, setPasswordActual] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const [verPasswordActual, setVerPasswordActual] = useState(false);
    const [verNuevaPassword, setVerNuevaPassword] = useState(false);
    const [verConfirmarPassword, setVerConfirmarPassword] = useState(false);

    const cambiarValor = (campo, valor) => {

        setConfiguracion({
            ...configuracion,
            [campo]: valor,
        });
    };

    const guardarConfiguracion = () => {

        localStorage.setItem(
            "configuracionFutZone",
            JSON.stringify(configuracion)
        );

        alert("Configuración guardada correctamente.");

    };

    const cambiarPassword = () => {

        if (
            passwordActual.trim() === "" ||
            nuevaPassword.trim() === "" ||
            confirmarPassword.trim() === ""
        ) {
            alert("Completa todos los campos.");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }

        if (nuevaPassword.length < 6) {
            alert("La nueva contraseña debe tener mínimo 6 caracteres.");
            return;
        }

        const usuarioLogueado = JSON.parse(
            localStorage.getItem("usuarioLogueado")
        );

        if (!usuarioLogueado) {
            alert("No se encontró el usuario actual.");
            return;
        }

        // ADMINISTRADOR
        if (usuarioLogueado.rol === "admin") {

            const admin = JSON.parse(
                localStorage.getItem("admin")
            );

            if (!admin || admin.password !== passwordActual) {
                alert("La contraseña actual es incorrecta.");
                return;
            }

            admin.password = nuevaPassword;

            localStorage.setItem(
                "admin",
                JSON.stringify(admin)
            );

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(admin)
            );

        }

        // USUARIO NORMAL
        else {

            const usuarios =
                JSON.parse(
                    localStorage.getItem("usuarios")
                ) || [];

            const usuarioEncontrado = usuarios.find(
                (u) => u.id === usuarioLogueado.id
            );

            if (
                !usuarioEncontrado ||
                usuarioEncontrado.password !== passwordActual
            ) {
                alert("La contraseña actual es incorrecta.");
                return;
            }

            const nuevosUsuarios = usuarios.map((u) =>
                u.id === usuarioLogueado.id
                    ? {
                        ...u,
                        password: nuevaPassword
                    }
                    : u
            );

            localStorage.setItem(
                "usuarios",
                JSON.stringify(nuevosUsuarios)
            );

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify({
                    ...usuarioLogueado,
                    password: nuevaPassword
                })
            );
        }

        alert("Contraseña actualizada correctamente.");

        setPasswordActual("");
        setNuevaPassword("");
        setConfirmarPassword("");

        setMostrarPassword(false);

    };

    useEffect(() => {

        const configuracionGuardada =
            localStorage.getItem("configuracionFutZone");

        if (configuracionGuardada) {

            setConfiguracion(
                JSON.parse(configuracionGuardada)
            );

        }

    }, []);

    return (

        <div>

            {/* HEADER */}

            <div className="flex items-center gap-4 mb-8">

                <div className="bg-green-100 p-4 rounded-2xl">

                    <FaCog className="text-green-600 text-3xl animate-spin" />

                </div>

                <div>

                    <h1 className="text-4xl font-bold text-gray-800">
                        Configuración
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Administra la configuración de FutZone
                    </p>

                </div>

            </div>


            {/* INFORMACIÓN DE FUTZONE */}

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                <div className="flex items-center gap-3 mb-6">

                    <FaBuilding className="text-green-600 text-2xl" />

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Información de FutZone
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Información general de la plataforma
                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="text-gray-700">

                        <label className="block font-semibold text-gray-700 mb-2">
                            Nombre de la plataforma
                        </label>

                        <input
                            type="text"
                            value={configuracion.nombre}
                            onChange={(e) =>
                                cambiarValor(
                                    "nombre",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        />

                    </div>


                    <div>

                        <label className="block font-semibold text-gray-700 mb-2">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={configuracion.correo}
                            onChange={(e) =>
                                cambiarValor(
                                    "correo",
                                    e.target.value
                                )
                            }
                            placeholder="contacto@futzone.com"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        />

                    </div>


                    <div>

                        <label className="block font-semibold text-gray-700 mb-2">
                            Teléfono
                        </label>

                        <input
                            type="text"
                            value={configuracion.telefono}
                            onChange={(e) =>
                                cambiarValor(
                                    "telefono",
                                    e.target.value
                                )
                            }
                            placeholder="300 000 0000"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        />

                    </div>


                    <div>

                        <label className="block font-semibold text-gray-700 mb-2">
                            Ciudad
                        </label>

                        <input
                            type="text"
                            value={configuracion.ciudad}
                            onChange={(e) =>
                                cambiarValor(
                                    "ciudad",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        />

                    </div>

                </div>

            </div>


            {/* CONFIGURACIÓN DE RESERVAS */}

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                <div className="flex items-center gap-3 mb-6">

                    <FaFutbol className="text-green-600 text-2xl" />

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Configuración de reservas
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Controla las reglas de las reservas
                        </p>

                    </div>

                </div>


                <div className="space-y-5">


                    {/* CANCELACIONES */}

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="font-semibold text-gray-700">
                                Permitir cancelaciones
                            </p>

                            <p className="text-sm text-gray-500">
                                Los usuarios podrán cancelar sus reservas
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                cambiarValor(
                                    "permitirCancelaciones",
                                    !configuracion.permitirCancelaciones
                                )
                            }
                            className={`w-14 h-7 rounded-full transition ${configuracion.permitirCancelaciones
                                ? "bg-green-600"
                                : "bg-gray-300"
                                }`}
                        >

                            <div
                                className={`w-6 h-6 bg-white rounded-full shadow transform transition ${configuracion.permitirCancelaciones
                                    ? "translate-x-7"
                                    : "translate-x-0"
                                    }`}
                            />

                        </button>

                    </div>


                    {/* TIEMPO DE CANCELACIÓN */}

                    <div>

                        <label className="block font-semibold text-gray-700 mb-2">
                            Tiempo límite para cancelar
                        </label>

                        <div className="flex items-center gap-3">

                            <input
                                type="number"
                                min="1"
                                value={configuracion.tiempoCancelacion}
                                placeholder="2"
                                onChange={(e) =>
                                    cambiarValor(
                                        "tiempoCancelacion",
                                        e.target.value
                                    )
                                }
                                className="w-32 border border-gray-300 rounded-xl p-3 text-gray-700"
                            />

                            <span className="text-gray-500">
                                horas antes de la reserva
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* NOTIFICACIONES */}

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                <div className="flex items-center gap-3 mb-6">

                    <FaBell className="text-orange-500 text-2xl" />

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Notificaciones
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Selecciona qué eventos deseas controlar
                        </p>

                    </div>

                </div>


                <div className="space-y-4">

                    {[
                        ["nuevasReservas", "Nuevas reservas"],
                        ["cancelaciones", "Cancelaciones"],
                        ["pagos", "Pagos"],
                        ["torneos", "Nuevos torneos"],
                    ].map(([campo, nombre]) => (

                        <div
                            key={campo}
                            className="flex justify-between items-center border-b pb-4"
                        >

                            <span className="font-medium text-gray-700">
                                {nombre}
                            </span>

                            <button
                                onClick={() =>
                                    cambiarValor(
                                        campo,
                                        !configuracion[campo]
                                    )
                                }
                                className={`w-14 h-7 rounded-full transition ${configuracion[campo]
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                                    }`}
                            >

                                <div
                                    className={`w-6 h-6 bg-white rounded-full shadow transform transition ${configuracion[campo]
                                        ? "translate-x-7"
                                        : "translate-x-0"
                                        }`}
                                />

                            </button>

                        </div>

                    ))}

                </div>

            </div>


            {/* SEGURIDAD */}

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                <div className="flex items-center gap-3 mb-4">

                    <FaLock className="text-red-600 text-2xl" />

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Seguridad
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Opciones de seguridad de la cuenta
                        </p>

                    </div>

                </div>

                <button
                    onClick={() => setMostrarPassword(true)}
                    className="border border-red-500 text-red-600 hover:bg-red-100 px-5 py-3 rounded-xl font-semibold cursor-pointer"
                >
                    Cambiar contraseña
                </button>

            </div>


            {/* GUARDAR */}

            <div className="flex justify-end">

                <button
                    onClick={guardarConfiguracion}
                    className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 shadow-md font-semibold"
                >

                    <FaSave />

                    Guardar configuración

                </button>

            </div>

            {mostrarPassword && (

                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 text-gray-700">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

                        {/* HEADER */}

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-800">
                                    Cambiar contraseña
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Actualiza la contraseña de tu cuenta
                                </p>

                            </div>

                            <button
                                onClick={() => setMostrarPassword(false)}
                                className="text-gray-500 hover:text-red-600 text-xl"
                            >
                                ✕
                            </button>

                        </div>


                        {/* CONTRASEÑA ACTUAL */}

                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Contraseña actual
                            </label>

                            <div className="relative">

                                <input
                                    type={verPasswordActual ? "text" : "password"}
                                    value={passwordActual}
                                    onChange={(e) =>
                                        setPasswordActual(e.target.value)
                                    }
                                    placeholder="Ingrese su contraseña actual"
                                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setVerPasswordActual(!verPasswordActual)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                                >
                                    {verPasswordActual ? (
                                        <FaEyeSlash size={20} />
                                    ) : (
                                        <FaEye size={20} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* NUEVA CONTRASEÑA */}

                        <div className="mb-5">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Nueva contraseña
                            </label>

                            <div className="relative">

                                <input
                                    type={verNuevaPassword ? "text" : "password"}
                                    value={nuevaPassword}
                                    onChange={(e) =>
                                        setNuevaPassword(e.target.value)
                                    }
                                    placeholder="Ingrese la nueva contraseña"
                                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setVerNuevaPassword(!verNuevaPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                                >
                                    {verNuevaPassword ? (
                                        <FaEyeSlash size={20} />
                                    ) : (
                                        <FaEye size={20} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* CONFIRMAR */}

                        <div className="mb-6">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Confirmar contraseña
                            </label>

                            <div className="relative">

                                <input
                                    type={verConfirmarPassword ? "text" : "password"}
                                    value={confirmarPassword}
                                    onChange={(e) =>
                                        setConfirmarPassword(e.target.value)
                                    }
                                    placeholder="Repita la nueva contraseña"
                                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setVerConfirmarPassword(!verConfirmarPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
                                >
                                    {verConfirmarPassword ? (
                                        <FaEyeSlash size={20} />
                                    ) : (
                                        <FaEye size={20} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <br />
                        {/* BOTONES */}

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setMostrarPassword(false)}
                                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={cambiarPassword}
                                className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                Cambiar contraseña
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}