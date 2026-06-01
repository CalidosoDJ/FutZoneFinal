"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {

    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const registrarUsuario = (e) => {

        e.preventDefault();

        const usuario = {
            nombre,
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
            <div className="w-full lg:w-[40%] bg-gray-950 flex items-center justify-center p-8">

                <form
                    onSubmit={registrarUsuario}
                    className="w-full max-w-md"
                >

                    {/* Logo */}
                    <div className="mb-10">

                        <h1 className="text-5xl font-bold text-white mb-3">
                            Fut<span className="text-green-500">Zone</span>
                        </h1>

                        <p className="text-gray-400">
                            Crea tu cuenta y empieza a reservar
                        </p>

                    </div>

                    {/* Nombre */}
                    <div className="mb-5">

                        <label className="text-white block mb-2">
                            Nombre
                        </label>

                        <input
                            type="text"
                            placeholder="Juan Pérez"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl outline-none focus:border-green-500 transition"
                        />

                    </div>

                    {/* Correo */}
                    <div className="mb-5">

                        <label className="text-white block mb-2">
                            Correo
                        </label>

                        <input
                            type="email"
                            placeholder="correo@gmail.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl outline-none focus:border-green-500 transition"
                        />

                    </div>

                    {/* Contraseña */}
                    <div className="mb-8">

                        <label className="text-white block mb-2">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl outline-none focus:border-green-500 transition"
                        />

                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-2xl text-lg font-semibold"
                    >
                        Registrarse
                    </button>

                    {/* Login */}
                    <p className="text-gray-400 mt-6 text-center">

                        ¿Ya tienes cuenta?{" "}

                        <span
                            onClick={() => router.push("/login")}
                            className="text-green-500 cursor-pointer hover:text-green-400"
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
                    backgroundImage: "url('/images/register.jpg')",
                }}
            >

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Texto */}
                <div className="relative z-10 flex flex-col justify-end p-16 text-white">

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