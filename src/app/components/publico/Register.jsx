"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebook, FaTwitter } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {

    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [celular, setCelular] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const registrarUsuario = (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return
        }

        const usuario = {
            nombre,
            usuario,
            celular,
            correo,
            password,
        };

        // Guardar usuario
        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        alert("Usuario registrado correctamente");

        router.push("/login");

    };

    return (

        <section className="min-h-screen flex bg-black">

            {/* FORMULARIO */}
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-3">

                <form
                    onSubmit={registrarUsuario}
                    className="w-full max-w-md"
                >

                    <div className="mb-2">

                        <h1 className="text-5xl font-bold text-gray-900">
                            Fut<span className="text-green-600">Zone</span>
                        </h1>

                        <p className="text-black mt-3 text-xl">
                            Únete a la comunidad futbolera
                        </p>

                    </div>

                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Ingrese su Nombre Completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-2 rounded-xl border border-dark focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Ingrese su Nombre de Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full p-2 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Ingrese su Correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full p-2 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Numero Celular"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            className="w-full p-2 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition"
                    >
                        Registrarse
                    </button>

                    {/* Separador */}

                    <div className="flex items-center my-5">

                        <div className="flex-1 border-t border-black"></div>

                        <span className="px-4 text-black text-sm">
                            o continúa con
                        </span>

                        <div className="flex-1 border-t border-black"></div>

                    </div>

                    {/* Redes Sociales */}

                    <div className="grid grid-cols-3 gap-3">

                        <button
                            type="button"
                            className="flex justify-center items-center p-4 border rounded-xl bg-blue-700 hover:bg-blue-600 transition"
                        >
                            <FaFacebook size={22} />
                        </button>

                        <button
                            type="button"
                            className="flex justify-center items-center p-4 border bg-gray-300 rounded-2xl hover:bg-gray-400 transition"
                        >
                            <FcGoogle size={22} />
                        </button>

                        <button
                            type="button"
                            className="flex justify-center items-center p-4 border bg-black rounded-xl hover:bg-gray-800 transition"
                        >
                            <FaTwitter size={22} />
                        </button>

                    </div>

                    <p className="text-center text-gray-500 mt-6">

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
                    backgroundImage: "url('/images/registrarse.jpg')",
                }}
            >

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Texto */}
                <div className="relative z-10 flex flex-col p-16 text-white">

                    <h1 className="text-6xl font-bold mb-5 leading-tight">

                        Únete a la comunidad
                        FutZone

                    </h1>

                    <p className="text-xl text-gray-300 max-w-xl">

                        Crea tu cuenta y administra
                        reservas, partidos y torneos
                        desde una sola plataforma.

                    </p>

                </div>

            </div>

        </section>

    );
}