"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatBox from "./ChatBox";

export default function ChatButton() {

    const [abierto, setAbierto] = useState(false);

    return (
        <>

            {/* Botón flotante */}

            <button
                onClick={() => setAbierto(!abierto)}
                className="
                    fixed
                    bottom-8
                    right-8
                    z-50
                    w-16
                    h-16
                    rounded-full
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    shadow-2xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                "
            >

                {abierto ? <X size={28} /> : <MessageCircle size={28} />}

            </button>

            {/* Ventana */}

            {abierto && <ChatBox />}

        </>
    );

}