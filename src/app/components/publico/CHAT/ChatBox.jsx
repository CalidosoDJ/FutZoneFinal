"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Paperclip,
    Send,
    Smile,
    X,
    Bot,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    RotateCcw,
    CalendarCheck,
    ShieldCheck,
    LogIn
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const obtenerIdUsuario = () => {
    if (typeof window === "undefined") return null;
    try {
        const userData = localStorage.getItem("usuarioLogueado");
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.id_usuario || parsed.id || null;
        }
    } catch {
        return null;
    }
    return null;
};

const obtenerClavesStorage = () => {
    const idUsuario = obtenerIdUsuario();
    const sufijo = idUsuario ? `user-${idUsuario}` : "guest";
    return {
        claveMensajes: `chat-futzone-${sufijo}`,
        claveConv: `chat-futzone-conv-${sufijo}`,
    };
};

export default function ChatBox({ onClose }) {
    const router = useRouter();
    const [mensaje, setMensaje] = useState("");
    const [escribiendo, setEscribiendo] = useState(false);
    const [escuchando, setEscuchando] = useState(false);
    const [vozActivada, setVozActivada] = useState(true);

    // Estado para el modal de persuasión de inicio de sesión
    const [canchaSeleccionadaModal, setCanchaSeleccionadaModal] = useState(null);

    const [idConversacion, setIdConversacion] = useState(() => {
        if (typeof window !== "undefined") {
            const { claveConv } = obtenerClavesStorage();
            const convGuardada = localStorage.getItem(claveConv);
            return convGuardada ? Number(convGuardada) : null;
        }
        return null;
    });

    const [mensajes, setMensajes] = useState(() => {
        if (typeof window !== "undefined") {
            const { claveMensajes } = obtenerClavesStorage();
            const guardados = localStorage.getItem(claveMensajes);
            if (guardados) {
                return JSON.parse(guardados);
            }
        }
        return [
            {
                id: 1,
                texto: "👋 Hola, bienvenido a FutZone. ¿En qué podemos ayudarte hoy? Puedo recomendarte canchas, revisar horarios disponibles o darte información de torneos.",
                tipo: "recibido",
                hora: "10:30 AM",
                tarjetas: [],
            }
        ];
    });

    const finalChat = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "es-ES";

                recognition.onresult = (event) => {
                    const textoTranscrito = event.results[0][0].transcript;
                    setMensaje(textoTranscrito);
                    setEscuchando(false);
                };

                recognition.onerror = (event) => {
                    console.error("Error en reconocimiento de voz:", event.error);
                    setEscuchando(false);
                };

                recognition.onend = () => {
                    setEscuchando(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const hablarTexto = (texto) => {
        if (!vozActivada || typeof window === "undefined" || !("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const textoLimpio = texto
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
            .replace(/\*/g, "");

        const utterance = new SpeechSynthesisUtterance(textoLimpio);
        utterance.lang = "es-ES";
        utterance.rate = 1.0;

        window.speechSynthesis.speak(utterance);
    };

    const alternarMicrofono = () => {
        if (!recognitionRef.current) {
            alert("Tu navegador no soporta el reconocimiento de voz por micrófono.");
            return;
        }

        if (escuchando) {
            recognitionRef.current.stop();
            setEscuchando(false);
        } else {
            try {
                recognitionRef.current.start();
                setEscuchando(true);
            } catch (error) {
                console.error("Error al iniciar micrófono:", error);
            }
        }
    };

    useEffect(() => {
        finalChat.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [mensajes, escribiendo]);

    useEffect(() => {
        const { claveMensajes } = obtenerClavesStorage();
        localStorage.setItem(claveMensajes, JSON.stringify(mensajes));
    }, [mensajes]);

    const obtenerHora = () => {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatearPrecio = (valor) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(valor);
    };

    // Maneja el clic en "Reservar esta cancha"
    const manejarClickReservar = (cancha) => {
        const idUsuario = obtenerIdUsuario();

        if (!idUsuario) {
            // No está logueado: mostramos el modal persuasivo
            setCanchaSeleccionadaModal(cancha);
            return;
        }

        // Ya inició sesión: redirigimos directo a /canchas
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (onClose) onClose();
        router.push(`/canchas?cancha=${cancha.id_cancha}`);
    };

    const irAIniciarSesion = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setCanchaSeleccionadaModal(null);
        if (onClose) onClose();
        router.push("/login");
    };

    const limpiarChat = () => {
        if (typeof window !== "undefined") {
            window.speechSynthesis?.cancel();
            const { claveMensajes, claveConv } = obtenerClavesStorage();
            localStorage.removeItem(claveMensajes);
            localStorage.removeItem(claveConv);
        }
        setIdConversacion(null);
        setMensajes([
            {
                id: Date.now(),
                texto: "👋 Hola, bienvenido a FutZone. ¿En qué podemos ayudarte hoy? Puedo recomendarte canchas, revisar horarios disponibles o darte información de torneos.",
                tipo: "recibido",
                hora: obtenerHora(),
                tarjetas: [],
            }
        ]);
    };

    const enviarMensaje = async (textoAEnviar) => {
        const contenido = textoAEnviar || mensaje;
        if (contenido.trim() === "" || escribiendo) return;

        if (escuchando && recognitionRef.current) {
            recognitionRef.current.stop();
            setEscuchando(false);
        }

        const idUsuario = obtenerIdUsuario();

        const nuevo = {
            id: Date.now(),
            texto: contenido,
            tipo: "enviado",
            hora: obtenerHora(),
        };

        // Creamos inmediatamente la burbuja vacía del bot donde caerá el streaming
        const botMsgId = Date.now() + 1;
        const burbujaBotInicial = {
            id: botMsgId,
            texto: "",
            tipo: "recibido",
            hora: obtenerHora(),
            tarjetas: [],
        };

        setMensajes((prev) => [...prev, nuevo, burbujaBotInicial]);
        setMensaje("");
        setEscribiendo(true);

        let textoAcumulado = "";

        try {
            const response = await fetch(`${API_URL}/chatbot/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mensaje: contenido,
                    id_usuario: idUsuario,
                    id_conversacion: idConversacion,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Error en la conexión con el servidor");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lineas = buffer.split("\n");
                buffer = lineas.pop() || "";

                for (const linea of lineas) {
                    if (!linea.trim()) continue;
                    const evento = JSON.parse(linea);

                    if (evento.tipo === "meta" && evento.id_conversacion) {
                        const { claveConv } = obtenerClavesStorage();
                        setIdConversacion(evento.id_conversacion);
                        localStorage.setItem(claveConv, String(evento.id_conversacion));
                    } else if (evento.tipo === "token") {
                        textoAcumulado += evento.contenido;
                        setMensajes((prev) =>
                            prev.map((m) =>
                                m.id === botMsgId ? { ...m, texto: textoAcumulado } : m
                            )
                        );
                    } else if (evento.tipo === "fin") {
                        setMensajes((prev) =>
                            prev.map((m) =>
                                m.id === botMsgId
                                    ? { ...m, tarjetas: evento.tarjetas || [] }
                                    : m
                            )
                        );
                    }
                }
            }

            if (textoAcumulado) {
                hablarTexto(textoAcumulado);
            }
        } catch (error) {
            console.error("Error en chatbot:", error);
            const fallback = "⚠️ No pude conectarme con el servidor de FutZone en este momento. Verifica que el backend esté activo.";

            setMensajes((prev) =>
                prev.map((m) =>
                    m.id === botMsgId ? { ...m, texto: fallback } : m
                )
            );
        } finally {
            setEscribiendo(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] sm:w-[390px] h-[570px] max-h-[84vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">

            {/* MODAL PERSUASIVO PARA INICIAR SESIÓN */}
            {canchaSeleccionadaModal && (
                <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-[330px] shadow-2xl text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto text-green-400">
                            <ShieldCheck size={26} />
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="text-white font-bold text-base">
                                ¡Asegura tu cancha en segundos!
                            </h3>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                Para reservar <span className="text-green-400 font-semibold">{canchaSeleccionadaModal.nombre}</span> es necesario iniciar sesión. Así protegemos tus datos personales, guardamos tu comprobante y aseguramos tu horario al instante.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <button
                                onClick={irAIniciarSesion}
                                className="w-full py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20 cursor-pointer"
                            >
                                <LogIn size={16} />
                                Iniciar sesión para reservar
                            </button>

                            <button
                                onClick={() => setCanchaSeleccionadaModal(null)}
                                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition cursor-pointer"
                            >
                                Seguir preguntando al asistente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 shadow-md bg-slate-800 flex items-center justify-center">
                        <Image
                            src="/images/ChatIA.png"
                            alt="Asistente IA"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <Bot className="text-green-400 absolute" size={20} />
                    </div>

                    <div>
                        <h2 className="font-bold text-base text-white tracking-tight leading-none">
                            Soporte FutZone
                        </h2>
                        <span className="text-green-400 text-xs flex items-center gap-1.5 mt-1 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            En línea
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={limpiarChat}
                        className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Nueva conversación"
                        aria-label="Nueva conversación"
                    >
                        <RotateCcw size={17} />
                    </button>

                    <button
                        onClick={() => {
                            if (vozActivada) window.speechSynthesis?.cancel();
                            setVozActivada(!vozActivada);
                        }}
                        className={`p-1.5 rounded-full transition cursor-pointer ${vozActivada ? "text-green-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                            }`}
                        title={vozActivada ? "Respuesta por voz activada" : "Respuesta por voz desactivada"}
                    >
                        {vozActivada ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>

                    <button
                        onClick={() => {
                            if (window.speechSynthesis) window.speechSynthesis.cancel();
                            if (onClose) onClose();
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        aria-label="Cerrar chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* ÁREA DE MENSAJES SCROLLABLE */}
            <div className="flex-1 bg-slate-900/90 overflow-y-auto p-4 space-y-4">

                {/* BOTONES RÁPIDOS */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <button
                        onClick={() => enviarMensaje("¿Qué canchas tienen disponibles hoy y cuánto valen?")}
                        className="bg-slate-800 hover:bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                        ⚽ Disponibilidad
                    </button>

                    <button
                        onClick={() => enviarMensaje("¿Cuáles son los métodos de pago?")}
                        className="bg-slate-800 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                        💳 Pagos
                    </button>

                    <button
                        onClick={() => enviarMensaje("¿Dónde están ubicados y cuál es el horario?")}
                        className="bg-slate-800 hover:bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                        📍 Ubicación
                    </button>
                </div>

                <div className="flex justify-center my-3">
                    <span className="bg-slate-800/80 border border-slate-700/50 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Hoy
                    </span>
                </div>

                {mensajes.map((m) => (
                    <div key={m.id} className="space-y-2">
                        <div
                            className={`flex items-end gap-2 ${m.tipo === "enviado" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {m.tipo === "recibido" && (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-green-500 shrink-0 bg-slate-800 flex items-center justify-center">
                                    <Bot size={14} className="text-green-400" />
                                </div>
                            )}

                            <div
                                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${m.tipo === "enviado"
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none"
                                    }`}
                            >
                                {/* Puntos animados mientras llega el primer token del streaming */}
                                {m.tipo === "recibido" && m.texto === "" ? (
                                    <div className="flex gap-1.5 py-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:200ms]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:400ms]"></span>
                                    </div>
                                ) : (
                                    <p className="leading-relaxed whitespace-pre-line">{m.texto}</p>
                                )}

                                <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-75">
                                    <span>{m.hora}</span>
                                    {m.tipo === "enviado" && <span>✓✓</span>}
                                </div>
                            </div>
                        </div>

                        {/* TARJETAS INTERACTIVAS DE CANCHAS RECOMENDADAS */}
                        {m.tipo === "recibido" && m.tarjetas && m.tarjetas.length > 0 && (
                            <div className="pl-9 space-y-2">
                                {m.tarjetas.map((cancha) => (
                                    <div
                                        key={cancha.id_cancha}
                                        className="bg-slate-800/95 border border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col"
                                    >
                                        <div className="flex items-center gap-3 p-2.5">
                                            <img
                                                src={cancha.imagen_url}
                                                alt={cancha.nombre}
                                                onError={(e) => {
                                                    e.target.src = "/images/ChatIA.png";
                                                }}
                                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700 bg-slate-900"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                                                    {cancha.tipo}
                                                </span>
                                                <h4 className="text-white font-bold text-sm truncate">
                                                    {cancha.nombre}
                                                </h4>
                                                <p className="text-slate-300 text-xs font-semibold mt-0.5">
                                                    {formatearPrecio(cancha.precio_hora)}{" "}
                                                    <span className="text-slate-400 font-normal">/ hora</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => manejarClickReservar(cancha)}
                                            className="w-full py-2 px-3 bg-green-600 hover:bg-green-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                            <CalendarCheck size={15} />
                                            Reservar esta cancha
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div ref={finalChat}></div>
            </div>

            {/* BARRA INFERIOR DE MENSAJE Y MICRÓFONO */}
            <div className="bg-slate-950 p-3 border-t border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                    <button type="button" className="text-slate-400 hover:text-white p-1.5 transition">
                        <Smile size={18} />
                    </button>
                    <button type="button" className="text-slate-400 hover:text-white p-1.5 transition">
                        <Paperclip size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={alternarMicrofono}
                        className={`p-2 rounded-full transition cursor-pointer ${escuchando
                            ? "bg-red-500 text-white animate-pulse"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        title={escuchando ? "Escuchando... Haz clic para detener" : "Dictar mensaje por voz"}
                    >
                        {escuchando ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <input
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                enviarMensaje();
                            }
                        }}
                        disabled={escribiendo}
                        placeholder={escuchando ? "Escuchando..." : "Escribe o dicta un mensaje..."}
                        className={`flex-1 bg-slate-900 border text-white rounded-full px-4 py-2 text-sm outline-none transition placeholder:text-slate-500 ${escuchando
                            ? "border-red-500/80 ring-1 ring-red-500/50"
                            : "border-slate-700/80 focus:border-green-500"
                            }`}
                    />

                    <button
                        onClick={() => enviarMensaje()}
                        disabled={escribiendo}
                        className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-slate-950 font-bold flex justify-center items-center shrink-0 transition shadow-lg shadow-green-600/20 cursor-pointer"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}