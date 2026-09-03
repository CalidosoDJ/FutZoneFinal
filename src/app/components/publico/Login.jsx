"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginComponent() {

    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    //rol admin
    useEffect(() => {

        const adminExiste = localStorage.getItem("admin");

        if (!adminExiste) {

            const admin = {
                nombre: "Administrador",
                usuario: "admin",
                celular: "3106021273",
                correo: "admin@futzone.com",
                password: "admin123",
                rol: "admin"
            };

            localStorage.setItem("admin", JSON.stringify(admin));
        }

    }, []);

    const iniciarSesion = (e) => {


        e.preventDefault();

        // LOGIN DEL ADMINISTRADOR
        const admin = JSON.parse(localStorage.getItem("admin"));

        if (
            admin &&
            admin.correo === correo &&
            admin.password === password
        ) {
            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(admin)
            );

            router.push("/admin");
            return;
        }


        // LOGIN DEL ÁRBITRO
        if (
            correo === "arbitro@futzone.com" &&
            password === "123"
        ) {

            const arbitro = {
                nombre: "Árbitro FutZone",
                correo: "arbitro@futzone.com",
                rol: "arbitro",
            };

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(arbitro)
            );

            router.push("/arbitro/dashboard");
            return;
        }


        // LOGIN DE USUARIOS REGISTRADOS
        const usuarios =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioEncontrado = usuarios.find(
            (u) =>
                u.correo === correo &&
                u.password === password
        );

        if (usuarioEncontrado) {

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(usuarioEncontrado)
            );

            router.push("/dashboard");
            return;
        }


        // SI NO COINCIDE NINGÚN USUARIO
        alert("Correo o contraseña incorrectos");

    };


    return (

        <section className="min-h-screen flex bg-black">

            {/* FORMULARIO */}
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-8">

                <form
                    onSubmit={iniciarSesion}
                    className="w-full max-w-md"
                >

                    {/* Logo */}
                    <div className="mb-10">

                        <h1 className="text-5xl font-bold text-gray-900 mb-3">
                            Fut<span className="text-green-500">Zone</span>
                        </h1>

                        <p className="text-black text-xl">
                            Inicia sesión para continuar
                        </p>

                    </div>

                    {/* Correo */}
                    <div className="mb-1">

                        <label className="text-black block mb-2">
                            Correo
                        </label>

                        <input
                            type="email"
                            placeholder="Ingrese su Correo Electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                        />

                    </div>

                    {/* Contraseña */}
                    <div className="mb-8">

                        <label className="text-white block mb-2">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            placeholder="Ingrese su Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                        />

                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-2xl text-lg font-semibold"
                    >
                        Iniciar Sesión
                    </button>

                    {/* Register */}
                    <p className="text-gray-400 mt-6 text-center">

                        ¿No tienes cuenta?{" "}

                        <span
                            onClick={() => router.push("/register")}
                            className="text-green-500 cursor-pointer hover:text-green-400"
                        >
                            Regístrate
                        </span>

                    </p>

                </form>

            </div>

            {/* IMAGEN */}
            <div
                className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('/images/login3.avif')",
                }}
            >

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Texto */}
                <div className="relative z-10 flex flex-col justify-end p-16 text-white">

                    <h1 className="text-6xl font-bold mb-5 leading-tight">

                        Vive la pasión
                        del fútbol

                    </h1>

                    <p className="text-xl text-gray-300 max-w-xl">

                        Reserva canchas, organiza torneos
                        y disfruta la mejor experiencia
                        deportiva con FutZone.

                    </p>

                </div>

            </div>

        </section>

    );
}