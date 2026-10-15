"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {

    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [celular, setCelular] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    const registrarUsuario = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);

        try {

            const respuesta = await fetch(
                "http://127.0.0.1:8000/api/usuarios/registro/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre_completo: nombre,
                        username: usuario,
                        email: correo,
                        password: password,
                        telefono: celular,
                    }),
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                if (datos.email) {
                    alert("Este correo ya está registrado.");
                    return;
                }

                if (datos.username) {
                    alert("Este nombre de usuario ya existe.");
                    return;
                }

                alert(
                    datos.detail ||
                    "No se pudo registrar el usuario."
                );

                return;
            }

            alert("Usuario registrado correctamente");

            router.push("/login");

        } catch (error) {

            console.error(
                "Error al registrar usuario:",
                error
            );

            alert(
                "No se pudo conectar con el servidor Django."
            );

        } finally {

            setCargando(false);

        }
    };

    return (
        <section className="min-h-screen flex bg-black">

            {/* FORMULARIO */}
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-8 py-4">

                <form
                    onSubmit={registrarUsuario}
                    className="w-full max-w-md"
                >

                    {/* Logo */}
                    <div className="mb-5">

                        <h1 className="text-4xl font-bold text-gray-900">
                            Fut<span className="text-green-600">
                                Zone
                            </span>
                        </h1>

                        <p className="text-black mt-1 text-lg">
                            Únete a la comunidad futbolera
                        </p>

                    </div>

                    {/* Campos */}
                    <div className="space-y-3">

                        <input
                            type="text"
                            placeholder="Ingrese su Nombre Completo"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Ingrese su Nombre de Usuario"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Ingrese su Correo electrónico"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Número Celular"
                            value={celular}
                            onChange={(e) =>
                                setCelular(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="w-full p-3 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white p-3 rounded-xl font-semibold transition"
                    >
                        {cargando
                            ? "Registrando..."
                            : "Registrarse"}
                    </button>

                    {/* Separador */}
                    <div className="flex items-center my-4">

                        <div className="flex-1 border-t border-black"></div>

                        <span className="px-3 text-black text-sm">
                            o continúa con
                        </span>

                        <div className="flex-1 border-t border-black"></div>

                    </div>

                    {/* Redes Sociales */}
                    <div className="grid grid-cols-3 gap-3">

                        <button
                            type="button"
                            className="flex justify-center items-center p-3 border rounded-xl bg-blue-700 hover:bg-blue-600 transition"
                        >
                            <FaFacebook size={20} />
                        </button>

                        <button
                            type="button"
                            className="flex justify-center items-center p-3 border bg-gray-300 rounded-xl hover:bg-gray-400 transition"
                        >
                            <FcGoogle size={20} />
                        </button>

                        <button
                            type="button"
                            className="flex justify-center items-center p-3 border bg-black rounded-xl hover:bg-gray-800 transition"
                        >
                            <FaTwitter size={20} />
                        </button>

                    </div>

                    {/* Login */}
                    <p className="text-center text-gray-500 mt-4 text-sm">

                        ¿Ya tienes cuenta?

                        <span
                            onClick={() => router.push("/login")}
                            className="text-green-600 font-semibold cursor-pointer ml-2"
                        >
                            Inicia sesión
                        </span>

                    </p>

                </form>

            </div>

            {/* IMAGEN */}
            <div
                className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('/images/registrarse.jpg')",
                }}
            >

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 flex flex-col p-14 text-white">

                    <h1 className="text-5xl font-bold mb-4 leading-tight">
                        Únete a la comunidad
                        FutZone
                    </h1>

                    <p className="text-lg text-gray-300 max-w-xl">
                        Crea tu cuenta y administra
                        reservas, partidos y torneos
                        desde una sola plataforma.
                    </p>

                </div>

            </div>

        </section>
    );
}