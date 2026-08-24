"use client";

import { useState, useRef, useEffect } from "react";

import {
    Paperclip,
    Send,
    Smile,
    MoreVertical
} from "lucide-react";
import Image from "next/image";
export default function ChatBox() {


    const [mensaje, setMensaje] = useState("");
    const [escribiendo, setEscribiendo] = useState(false);

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

    useEffect(() => {

        finalChat.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [mensajes]);
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

    const enviarMensaje = () => {

        if (mensaje.trim() === "") return;

        const textoUsuario = mensaje;

        const nuevo = {
            id: Date.now(),
            texto: textoUsuario,
            tipo: "enviado",
            hora: obtenerHora(),
        };

        setMensajes((prev) => [...prev, nuevo]);

        setMensaje("");

        setEscribiendo(true);

        setTimeout(() => {

            let respuesta = "";

            const texto = textoUsuario.toLowerCase();

            if (texto.includes("hola")) {

                respuesta =
                    "👋 ¡Hola! Bienvenido a FutZone. ¿En qué podemos ayudarte?";

            }

            else if (texto.includes("reserva")) {

                respuesta =
                    "⚽ Para reservar una cancha solo entra a la sección 'Lista de Canchas' y selecciona la que prefieras.";

            }

            else if (texto.includes("pago")) {

                respuesta =
                    "💳 Puedes pagar mediante Nequi, Daviplata o directamente en el establecimiento.";

            }

            else if (texto.includes("cancelar")) {

                respuesta =
                    "❌ Puedes cancelar una reserva desde 'Mis Reservas' antes del horario establecido.";

            }

            else if (texto.includes("horario")) {

                respuesta =
                    "🕐 Nuestro horario de atención es de 6:00 AM a 11:00 PM.";

            }

            else if (texto.includes("ubicacion") || texto.includes("mapa")) {

                respuesta =
                    "📍 Puedes consultar la ubicación de todas las canchas desde el módulo 'Mapa'.";

            }

            else if (texto.includes("precio")) {

                respuesta =
                    "💰 Tenemos canchas desde $75.000 por hora.";

            }

            else {

                respuesta =
                    "😊 Gracias por escribirnos. Uno de nuestros asesores responderá muy pronto.";

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

        }, 1500);

    };
    return (

        <div className="fixed bottom-28 right-8 w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border flex flex-col z-50">

            {/* HEADER */}

            <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-lg">

                    <Image
                        src="/images/ChatIA.png"
                        alt="Asistente IA"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                    />

                </div>

                <div>

                    <h2 className="font-bold text-lg text-slate-800">
                        Soporte FutZone
                    </h2>

                    <span className="text-green-600 text-sm flex items-center gap-2">

                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

                        En línea

                    </span>

                </div>

            </div>

            {/* MENSAJES */}

            <div className="flex-1 bg-slate-100 overflow-y-auto p-5 ">
                <div className="flex flex-wrap gap-2 mt-5">

                    <button
                        onClick={() => setMensaje("Quiero hacer una reserva")}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm"
                    >
                        ⚽ Reserva
                    </button>

                    <button
                        onClick={() => setMensaje("¿Cómo puedo realizar el pago?")}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm"
                    >
                        💳 Pagos
                    </button>

                    <button
                        onClick={() => setMensaje("Como veo el mapa donde estan ubicadas las canchas?")}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm"
                    >
                        📍 Ubicación
                    </button>

                </div>
                <div className="flex justify-center my-6">

                    <span className="bg-slate-200 px-4 py-2 rounded-full text-xs text-slate-600">

                        Hoy

                    </span>

                </div>

                {mensajes.map((m) => (

                    <div
                        key={m.id}
                        className={`flex mb-5 ${m.tipo === "enviado"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >

                        {m.tipo === "recibido" && (

                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">

                                <Image
                                    src="/images/ChatIA.png"
                                    alt="Asistente FutZone"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />

                            </div>

                        )}

                        <div
                            className={`
        max-w-[75%]
        rounded-2xl
        px-4
        py-3
        shadow
        transition-all
        duration-300
        animate-[fadeIn_.3s_ease]
        ${m.tipo === "enviado"
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-slate-800"
                                }
        `}
                        >

                            <p>{m.texto}</p>

                            <div className="flex justify-end gap-2 mt-2 text-xs">

                                <span>{m.hora}</span>

                                {m.tipo === "enviado" && (

                                    <span className="text-green-200">

                                        ✔✔

                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                ))}
                {escribiendo && (

                    <div className="flex mb-4">

                        <div className="bg-white rounded-2xl px-4 py-3 shadow">

                            <div className="flex gap-2">

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></span>

                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]"></span>

                            </div>

                        </div>

                    </div>

                )}

                <div ref={finalChat}></div>

            </div>

            {/* INPUT */}

            <div className="bg-white border-t p-4">

                <div className="flex items-center gap-3">

                    <Smile className="text-slate-500" />

                    <Paperclip className="text-slate-500" />

                    <input
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                enviarMensaje();

                            }

                        }}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border text-gray-700 rounded-full px-5 py-3 outline-none focus:border-green-500"
                    />

                    <button
                        onClick={enviarMensaje}
                        className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white flex justify-center items-center"
                    >

                        <Send size={20} />

                    </button>

                </div>

            </div>

        </div>

    );

}