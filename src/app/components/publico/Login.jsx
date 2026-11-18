
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    Check,
    Loader2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import RecuperarPasswordModal from "./RecuperarPasswordModal";

export default function LoginComponent() {
    const router = useRouter();

    // Estados del formulario
    const [modalAbierto, setModalAbierto] = useState(false);
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");

    // Iniciar sesión
    const iniciarSesion = async (e) => {
        e.preventDefault();

        if (cargando) return;

        setErrorMensaje("");

        if (!correo.trim() || !password) {
            setErrorMensaje(
                "Por favor ingresa el correo y la contraseña."
            );
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
                        email: correo.trim(),
                        password: password,
                    }),
                }
            );

            const datos = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                setErrorMensaje(
                    datos.non_field_errors?.[0] ||
                    datos.detail ||
                    datos.error ||
                    "Correo o contraseña incorrectos."
                );

                setCargando(false);
                return;
            }

            const usuario = datos.usuario;

            if (!usuario) {
                setErrorMensaje(
                    "El servidor no devolvió los datos del usuario."
                );
                setCargando(false);
                return;
            }

            // Verificar que Django haya generado el token
            if (!datos.token) {
                setErrorMensaje(
                    "El servidor no generó el token de sesión. Revisa el backend."
                );
                setCargando(false);
                return;
            }

            // Normalizar el rol
            const idRol = Number(
                typeof usuario.id_rol === "object"
                    ? usuario.id_rol?.id_rol ?? usuario.id_rol?.id
                    : usuario.id_rol
            );

            // Permitir administrador, jugador y árbitro
            if (![1, 2, 4].includes(idRol)) {
                setErrorMensaje(
                    "El usuario no tiene un rol válido asignado."
                );
                setCargando(false);
                return;
            }

            // Preparar información del usuario
            const usuarioSesion = {
                ...usuario,
                id_rol: idRol,
            };

            // Guardar token y usuario únicamente en esta pestaña
            sessionStorage.setItem(
                "tokenFutZone",
                datos.token
            );

            sessionStorage.setItem(
                "usuarioLogueado",
                JSON.stringify(usuarioSesion)
            );

            // Animación de éxito
            setNombreUsuario(
                usuario.nombre_completo ||
                usuario.username ||
                "Usuario"
            );

            setExito(true);

            // Redireccionar según el rol
            setTimeout(() => {
                if (idRol === 1) {
                    router.push("/admin");
                } else if (idRol === 4) {
                    router.push("/arbitro/dashboard");
                } else if (idRol === 2) {
                    router.push("/dashboard");
                }
            }, 1600);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);

            setErrorMensaje(
                "No se pudo conectar con el servidor Django."
            );

            setCargando(false);
        }
    };

    return (
        <section className="min-h-screen flex bg-black">

            {/* PANEL IZQUIERDO */}
            <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-6 sm:px-12 py-8 relative">

                {cargando ? (

                    /* ANIMACIÓN DE VERIFICACIÓN */
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
                            {!exito ? "Verificando..." : "¡Hola de nuevo!"}
                        </h2>

                        <p className="text-green-600 font-semibold text-xl mb-4">
                            {exito
                                ? nombreUsuario
                                : "Validando credenciales"}
                        </p>

                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-green-600 transition-all duration-1000 ${
                                    exito
                                        ? "w-full"
                                        : "w-2/3 animate-pulse"
                                }`}
                            />
                        </div>

                        <p className="text-gray-400 text-xs mt-4">
                            {!exito
                                ? "Conectando con el servidor..."
                                : "Cargando tu panel principal..."}
                        </p>
                    </div>

                ) : (

                    /* FORMULARIO */
                    <form
                        onSubmit={iniciarSesion}
                        className="w-full max-w-lg"
                    >

                        {/* IDENTIDAD FUTZONE */}
                        <div className="mb-8">

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors duration-200 group mb-6"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                                <span>Volver al Inicio</span>
                            </Link>

                            <Link
                                href="/"
                                className="block w-fit hover:opacity-85 transition-opacity"
                            >
                                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                                    Fut<span className="text-green-500">Zone</span>
                                </h1>
                            </Link>

                            <p className="text-black text-xl">
                                Inicia sesión para continuar
                            </p>
                        </div>

                        {/* MENSAJE DE ERROR */}
                        {errorMensaje && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMensaje}</span>
                            </div>
                        )}

                        {/* CORREO */}
                        <div className="mb-6">
                            <label
                                htmlFor="correo"
                                className="text-black block mb-2"
                            >
                                Correo
                            </label>

                            <input
                                id="correo"
                                type="email"
                                placeholder="Ingrese su correo electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
                            />
                        </div>

                        {/* CONTRASEÑA */}
                        <div className="mb-8">

                            <label
                                htmlFor="password"
                                className="text-black block mb-2 font-medium"
                            >
                                Contraseña
                            </label>

                            <div className="relative flex items-center">

                                <input
                                    id="password"
                                    type={
                                        mostrarPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Ingrese su contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
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

                            {/* RECUPERAR CONTRASEÑA */}
                            <button
                                type="button"
                                onClick={() => setModalAbierto(true)}
                                className="text-xs text-green-600 hover:text-green-700 font-semibold transition-colors cursor-pointer mt-3 block ml-auto"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>

                        </div>

                        {/* BOTÓN INICIAR SESIÓN */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 transition text-white p-4 rounded-2xl text-lg font-semibold cursor-pointer disabled:cursor-not-allowed"
                        >
                            Iniciar Sesión
                        </button>

                        {/* REGISTRO */}
                        <p className="text-gray-400 mt-6 text-center">
                            ¿No tienes cuenta?{" "}

                            <Link
                                href="/register"
                                className="text-green-500 cursor-pointer hover:text-green-400 font-semibold"
                            >
                                Regístrate
                            </Link>
                        </p>

                    </form>
                )}

                {/* MODAL DE RECUPERACIÓN */}
                <RecuperarPasswordModal
                    isOpen={modalAbierto}
                    onClose={() => setModalAbierto(false)}
                />

            </div>

            {/* PANEL DERECHO */}
            <div
                className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
                style={{
                    backgroundImage: "url('/images/login3.avif')",
                }}
            >
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 flex flex-col justify-end p-16 text-white">

                    <h1 className="text-6xl font-bold mb-5 leading-tight">
                        Vive la pasión
                        <br />
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
