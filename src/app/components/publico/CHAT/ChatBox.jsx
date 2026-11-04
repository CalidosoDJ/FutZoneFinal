"use client";

import { useState, useRef, useEffect } from "react";
import {
    Paperclip,
    Send,
    Smile,
    X,
    Bot,
    Mic,
    MicOff,
    Volume2,
    VolumeX
} from "lucide-react";
import Image from "next/image";

export default function ChatBox({ onClose }) {
    const [mensaje, setMensaje] = useState("");
    const [escribiendo, setEscribiendo] = useState(false);
    const [escuchando, setEscuchando] = useState(false);
    const [vozActivada, setVozActivada] = useState(true);

    const [mensajes, setMensajes] = useState(() => {
        if (typeof window !== "undefined") {
            const guardados = localStorage.getItem("chat-futzone");
            if (guardados) {
                return JSON.parse(guardados);
            }
        }
        return [
            {
                id: 1,
                texto: "👋 Hola, bienvenido a FutZone. ¿En qué podemos ayudarte?",
                tipo: "recibido",
                hora: "10:30 AM",
            }
        ];
    });

    const finalChat = useRef(null);
    const recognitionRef = useRef(null);

    // Configurar Reconocimiento de Voz (Speech to Text)
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

    // Función para hablar la respuesta (Text to Speech)
    const hablarTexto = (texto) => {
        if (!vozActivada || typeof window === "undefined" || !("speechSynthesis" in window)) {
            return;
        }

        // Cancelar lectura anterior si existe
        window.speechSynthesis.cancel();

        // Limpiar emojis o caracteres para que la voz suene natural
        const textoLimpio = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

        const utterance = new SpeechSynthesisUtterance(textoLimpio);
        utterance.lang = "es-ES";
        utterance.rate = 1.0; // Velocidad normal de voz

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
        localStorage.setItem(
            "chat-futzone",
            JSON.stringify(mensajes)
        );
    }, [mensajes]);

    const obtenerHora = () => {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const enviarMensaje = (textoAEnviar) => {
        const contenido = textoAEnviar || mensaje;
        if (contenido.trim() === "") return;

        // Detener micrófono si estaba escuchando
        if (escuchando && recognitionRef.current) {
            recognitionRef.current.stop();
            setEscuchando(false);
        }

        const nuevo = {
            id: Date.now(),
            texto: contenido,
            tipo: "enviado",
            hora: obtenerHora(),
        };

        setMensajes((prev) => [...prev, nuevo]);
        setMensaje("");
        setEscribiendo(true);

        setTimeout(() => {
            let respuesta = "";
            const texto = contenido.toLowerCase();

            if (texto.includes("hola")) {
                respuesta = "👋 ¡Hola! Bienvenido a FutZone. ¿En qué podemos ayudarte?";
            } else if (texto.includes("reserva")) {
                respuesta = "⚽ Para reservar una cancha solo entra a la sección 'Lista de Canchas' y selecciona la que prefieras.";
            } else if (texto.includes("pago")) {
                respuesta = "💳 Puedes pagar mediante Nequi, Daviplata o directamente en el establecimiento.";
            } else if (texto.includes("cancelar")) {
                respuesta = "❌ Puedes cancelar una reserva desde 'Mis Reservas' antes del horario establecido.";
            } else if (texto.includes("horario")) {
                respuesta = "🕐 Nuestro horario de atención es de 6:00 AM a 11:00 PM.";
            } else if (texto.includes("ubicacion") || texto.includes("mapa")) {
                respuesta = "📍 Puedes consultar la ubicación de todas las canchas desde el módulo 'Mapa'.";
            } else if (texto.includes("precio")) {
                respuesta = "💰 Tenemos canchas desde $75.000 por hora.";
            } else {
                respuesta = "😊 Gracias por escribirnos. Uno de nuestros asesores responderá muy pronto.";
            }

            setEscribiendo(false);

            setMensajes((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    texto: respuesta,
                    tipo: "recibido",
                    hora: obtenerHora(),
                },
            ]);

            // Reproducir respuesta con sintetizador de voz
            hablarTexto(respuesta);

        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[550px] max-h-[82vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">

            {/* HEADER CON CONTROL DE VOZ */}
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
                                e.target.style.display = 'none';
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

                {/* ACCIONES DEL HEADER (MUTE Y CERRAR) */}
                <div className="flex items-center gap-1">
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
                        onClick={() => enviarMensaje("Quiero hacer una reserva")}
                        className="bg-slate-800 hover:bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                        ⚽ Reserva
                    </button>

                    <button
                        onClick={() => enviarMensaje("¿Cómo puedo realizar el pago?")}
                        className="bg-slate-800 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
                    >
                        💳 Pagos
                    </button>

                    <button
                        onClick={() => enviarMensaje("¿Cómo veo el mapa de ubicación?")}
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
                    <div
                        key={m.id}
                        className={`flex items-end gap-2 ${m.tipo === "enviado" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {m.tipo === "recibido" && (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-green-500 shrink-0 bg-slate-800 flex items-center justify-center">
                                <Bot size={14} className="text-green-400" />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${m.tipo === "enviado"
                                    ? "bg-green-600 text-white rounded-br-none"
                                    : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none"
                                }`}
                        >
                            <p className="leading-relaxed">{m.texto}</p>
                            <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-75">
                                <span>{m.hora}</span>
                                {m.tipo === "enviado" && <span>✓✓</span>}
                            </div>
                        </div>
                    </div>
                ))}

                {escribiendo && (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full border border-green-500 shrink-0 bg-slate-800 flex items-center justify-center">
                            <Bot size={14} className="text-green-400" />
                        </div>
                        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl px-4 py-3 rounded-bl-none">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:200ms]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:400ms]"></span>
                            </div>
                        </div>
                    </div>
                )}

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

                    {/* BOTÓN DE MICRÓFONO */}
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
                        placeholder={escuchando ? "Escuchando..." : "Escribe o dicta un mensaje..."}
                        className={`flex-1 bg-slate-900 border text-white rounded-full px-4 py-2 text-sm outline-none transition placeholder:text-slate-500 ${escuchando
                                ? "border-red-500/80 ring-1 ring-red-500/50"
                                : "border-slate-700/80 focus:border-green-500"
                            }`}
                    />

                    <button
                        onClick={() => enviarMensaje()}
                        className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 text-slate-950 font-bold flex justify-center items-center shrink-0 transition shadow-lg shadow-green-600/20 cursor-pointer"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}