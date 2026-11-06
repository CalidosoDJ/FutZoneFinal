"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Check, Loader2 } from "lucide-react";
import RecuperarPasswordModal from "@/app/components/publico/RecuperarPasswordModal";

export default function LoginComponent() {
    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [progreso, setProgreso] = useState(0);
    const [modalAbierto, setModalAbierto] = useState(false);

    const iniciarSesion = async (e) => {
        e.preventDefault();

        if (!correo || !password) {
            alert("Por favor ingresa el correo y la contraseña.");
            return;
        }

        setCargando(true);
        setProgreso(30); // Inicia la barra de carga

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
                setCargando(false);
                setProgreso(0);
                return;
            }

            const usuario = datos.usuario;

            if (!usuario) {
                alert("El servidor no devolvió los datos del usuario.");
                setCargando(false);
                setProgreso(0);
                return;
            }

            // 🌟 Animación de Carga Completa
            setProgreso(65);
            setNombreUsuario(usuario.nombre_completo || usuario.username || "Usuario");

            setTimeout(() => {
                setExito(true);
                setProgreso(100);
            }, 400);

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(usuario)
            );

            // Redirección tras completar la barra
            setTimeout(() => {
                if (usuario.id_rol === 1) {
                    router.push("/admin");
                    return;
                }

                if (usuario.id_rol === 3) {
                    router.push("/arbitro/dashboard");
                    return;
                }

                router.push("/dashboard");
            }, 1600);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("No se pudo conectar con el servidor Django.");
            setCargando(false);
            setProgreso(0);
        }
    };

    return (
        <section className="min-h-screen flex bg-black overflow-hidden">
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-12 py-8 relative">

                {/* 🌟 TARJETA CON BARRA DE CARGA PROGRESIVA */}
                {cargando ? (
                    <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl transition-all animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative mb-6 flex items-center justify-center">
                            {!exito ? (
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-500/20">
                                    <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 animate-in zoom-in duration-300">
                                    <Check className="w-10 h-10 text-white stroke-[3]" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            {!exito ? "Verificando..." : `¡Hola de nuevo!`}
                        </h2>

                        <p className="text-green-600 font-semibold text-xl mb-6">
                            {exito ? nombreUsuario : "Validando credenciales"}
                        </p>

                        {/* BARRA DE PROGRESO */}
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-green-600 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progreso}%` }}
                            ></div>
                        </div>

                        <p className="text-gray-400 text-xs mt-4">
                            {!exito ? "Conectando con el servidor..." : "Cargando tu panel principal..."}
                        </p>
                    </div>
                ) : (
                    /* FORMULARIO DE LOGIN */
                    <form
                        onSubmit={iniciarSesion}
                        className="w-full max-w-lg transition-all"
                    >
                        <div className="mb-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors duration-200 group mb-6"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                                <span>Volver al Inicio</span>
                            </Link>

                            <Link
                                href="/"
                                className="block w-fit hover:opacity-85 transition-opacity cursor-pointer"
                            >
                                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                                    Fut<span className="text-green-500">Zone</span>
                                </h1>
                            </Link>

                            <p className="text-black text-xl">
                                Inicia sesión para continuar
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="text-black block mb-2">
                                Correo
                            </label>

                            <input
                                type="email"
                                placeholder="Ingrese su Correo Electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-black block mb-2 font-medium">
                                Contraseña
                            </label>

                            <div className="relative flex items-center">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    placeholder="Ingrese su Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-gray-300 border border-black text-black p-4 pr-12 rounded-2xl outline-none focus:border-gray-950 transition"
                                />

                                <button
                                    type="button"
                                    aria-label={
                                        mostrarPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    onClick={() =>
                                        setMostrarPassword(!mostrarPassword)
                                    }
                                    className="absolute right-4 text-gray-700 hover:text-black transition cursor-pointer p-1"
                                >
                                    {mostrarPassword ? (
                                        <EyeOff size={22} />
                                    ) : (
                                        <Eye size={22} />
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalAbierto(true)}
                                className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors cursor-pointer mt-3 block ml-auto"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>

                            <RecuperarPasswordModal
                                isOpen={modalAbierto}
                                onClose={() => setModalAbierto(false)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 transition text-white p-4 rounded-2xl text-lg font-semibold cursor-pointer"
                        >
                            Iniciar Sesión
                        </button>

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
                )}
            </div>

            {/* COLUMNA DERECHA */}
            <div
                className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('/images/login3.avif')",
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