"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

export default function ChatButton() {
    const [abierto, setAbierto] = useState(false);

    return (
        <>
            {/* Botón flotante para abrir (solo se muestra cuando está cerrado) */}
            {!abierto && (
                <button
                    onClick={() => setAbierto(true)}
                    aria-label="Abrir chat de soporte"
                    className="
                        fixed
                        bottom-8
                        right-8
                        z-50
                        w-16
                        h-16
                        rounded-full
                        bg-green-600
                        hover:bg-green-500
                        text-slate-950
                        shadow-2xl
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        hover:scale-110
                        cursor-pointer
                    "
                >
                    <MessageCircle size={30} strokeWidth={2.2} />
                </button>
            )}

            {/* Ventana pasando la función onClose para poder cerrarla */}
            {abierto && (
                <ChatBox onClose={() => setAbierto(false)} />
            )}
        </>
    );
}