"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Sparkles } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [celular, setCelular] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verPassword, setVerPassword] = useState(false);
    const [verConfirmPassword, setVerConfirmPassword] = useState(false);
    const [cargando, setCargando] = useState(false);

    // Estado para controlar el modal animado de éxito
    const [modalExito, setModalExito] = useState(false);

    const googleButtonRef = useRef(null);

    // Cargar e inicializar el SDK oficial de Google Sign-In
    useEffect(() => {
        const handleGoogleSuccess = async (response) => {
            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: response.credential }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("usuarioLogueado", JSON.stringify(data.usuario));
                    setModalExito(true);
                    setTimeout(() => {
                        router.push("/");
                    }, 1800);
                } else {
                    alert(data.message || "No se pudo registrar con Google");
                }
            } catch (err) {
                console.error("Error al autenticar con Google:", err);
                alert("Ocurrió un error al conectar con Google.");
            }
        };

        const renderGoogleButton = () => {
            if (window.google?.accounts?.id && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleSuccess,
                });

                googleButtonRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "signup_with", // Muestra "Registrarse con Google"
                    shape: "pill",
                    width: 300,
                });
            }
        };

        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = renderGoogleButton;
            document.body.appendChild(script);
        } else {
            renderGoogleButton();
        }
    }, [router]);

    const registrarUsuario = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);

        try {
            const respuesta = await fetch("http://127.0.0.1:8000/api/usuarios/registro/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_completo: nombre.trim(),
                    username: usuario.trim(),
                    email: correo.trim().toLowerCase(),
                    password: password,
                    telefono: celular.trim(),
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                const primerError =
                    datos.email?.[0] ||
                    datos.username?.[0] ||
                    datos.password?.[0] ||
                    datos.non_field_errors?.[0] ||
                    datos.message ||
                    "No se pudo registrar el usuario.";
                alert(primerError);
                return;
            }

            setModalExito(true);

            setTimeout(() => {
                router.push("/login");
            }, 2500);

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("No se pudo conectar con el servidor de Next.js.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <section className="h-dvh w-full flex bg-black overflow-hidden">
                <div className="w-full lg:w-[40%] h-full bg-white flex items-center justify-center px-6 sm:px-10 py-3 overflow-hidden">
                    <form
                        onSubmit={registrarUsuario}
                        className="w-full max-w-md flex flex-col justify-center"
                    >
                        <div className="mb-2.5">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                                Fut<span className="text-green-600">Zone</span>
                            </h1>

                            <p className="text-gray-700 mt-1 text-sm sm:text-base font-medium">
                                Únete a la comunidad futbolera
                            </p>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Ingrese su Nombre Completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Ingrese su Nombre de Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Ingrese su Correo electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                required
                            />

                            <input
                                type="tel"
                                placeholder="Número Celular"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                required
                            />

                            <div className="relative flex items-center">
                                <input
                                    type={verPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2 pr-10 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                    required
                                />

                                <button
                                    type="button"
                                    aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    onClick={() => setVerPassword(!verPassword)}
                                    className="absolute right-3 text-gray-700 hover:text-black cursor-pointer"
                                >
                                    {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    type={verConfirmPassword ? "text" : "password"}
                                    placeholder="Confirmar contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3.5 py-2 pr-10 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200"
                                    required
                                />

                                <button
                                    type="button"
                                    aria-label={verConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                                    onClick={() => setVerConfirmPassword(!verConfirmPassword)}
                                    className="absolute right-3 text-gray-700 hover:text-black cursor-pointer"
                                >
                                    {verConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2.5 px-4 rounded-xl font-semibold transition text-sm cursor-pointer shadow-sm"
                        >
                            {cargando ? "Registrando..." : "Registrarse"}
                        </button>

                        {/* SEPARADOR Y BOTÓN DE GOOGLE */}
                        <div className="my-2.5">
                            <div className="relative flex items-center justify-center mb-2.5">
                                <div className="border-t border-gray-300 w-full"></div>
                                <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                    o regístrate con
                                </span>
                                <div className="border-t border-gray-300 w-full"></div>
                            </div>

                            <div className="flex justify-center">
                                <div
                                    ref={googleButtonRef}
                                    className="transition-transform duration-200 hover:scale-[1.02] rounded-full shadow-sm hover:shadow-md"
                                ></div>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 mt-1.5 text-xs">
                            ¿Ya tienes cuenta?
                            <span
                                onClick={() => router.push("/login")}
                                className="text-green-600 font-semibold cursor-pointer ml-1.5 hover:underline"
                            >
                                Inicia sesión
                            </span>
                        </p>
                    </form>
                </div>

                <div
                    className="hidden lg:flex lg:w-[60%] h-full bg-cover bg-center relative items-end"
                    style={{
                        backgroundImage: "url('/images/registrarse.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="relative z-10 flex flex-col p-12 text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                            Únete a la comunidad
                            <br />
                            FutZone
                        </h1>

                        <p className="text-base text-gray-300 max-w-xl">
                            Crea tu cuenta y administra reservas, partidos y torneos desde una sola plataforma.
                        </p>
                    </div>
                </div>
            </section>

            {/* MODAL ANIMADO DE REGISTRO EXITOSO */}
            {modalExito && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 animate-bounce">
                            <CheckCircle2 size={48} strokeWidth={2.2} />
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
                            ¡Registro Exitoso! <Sparkles size={20} className="text-green-500 animate-pulse" />
                        </h3>

                        <p className="mt-3 text-sm font-semibold text-gray-500 flex items-center justify-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            Redirigiendo...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}