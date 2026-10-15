"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginComponent() {

    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (e) => {

        e.preventDefault();

        if (!correo || !password) {
            alert("Por favor ingresa el correo y la contraseña.");
            return;
        }

        setCargando(true);

        try {

            const respuesta = await fetch(
                "http://127.0.0.1:8000/api/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: correo,
                        password: password,
                    }),
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                alert(
                    datos.non_field_errors?.[0] ||
                    datos.detail ||
                    "Correo o contraseña incorrectos"
                );

                return;
            }

           const usuario = datos.usuario;

console.log("Usuario recibido de Django:", usuario);

localStorage.setItem(
    "usuarioLogueado",
    JSON.stringify(usuario)
);

            alert("Inicio de sesión exitoso");

            // ADMINISTRADOR
            if (usuario.id_rol === 1) {
                router.push("/admin");
                return;
            }

            // ÁRBITRO
            if (usuario.id_rol === 3) {
                router.push("/arbitro/dashboard");
                return;
            }

            // JUGADOR
            router.push("/dashboard");

        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
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
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-12 py-8">

                <form
                    onSubmit={iniciarSesion}
                    className="w-full max-w-lg"
                >

                    {/* Logo */}
                    <div className="mb-5">

                        <h1 className="text-5xl font-bold text-gray-900 mb-3">
                            Fut<span className="text-green-500">
                                Zone
                            </span>
                        </h1>

                        <p className="text-black text-xl">
                            Inicia sesión para continuar
                        </p>

                    </div>

                    {/* Correo */}
                    <div className="mb-6">

                        <label className="text-black block mb-2">
                            Correo
                        </label>

                        <input
                            type="email"
                            placeholder="Ingrese su Correo Electrónico"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                        />

                    </div>

                    {/* Contraseña */}
                    <div className="mb-8">

                        <label className="text-black block mb-2">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            placeholder="Ingrese su Contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                        />

                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 transition text-white p-4 rounded-2xl text-lg font-semibold"
                    >
                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar Sesión"}
                    </button>

                    {/* Register */}
                    <p className="text-gray-400 mt-6 text-center">

                        ¿No tienes cuenta?{" "}

                        <span
                            onClick={() =>
                                router.push("/register")
                            }
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
                    backgroundImage:
                        "url('/images/login3.avif')",
                }}
            >

                <div className="absolute inset-0 bg-black/50"></div>

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