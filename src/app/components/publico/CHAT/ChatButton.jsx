"use client";

import { useState, useRef } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import ChatBox from "./ChatBox";

export default function ChatButton() {
    const [abierto, setAbierto] = useState(false);
    const [mostrarBadge, setMostrarBadge] = useState(true);

    // Estados y referencias para la posición y arrastre
    const [posicion, setPosicion] = useState({ x: null, y: null });
    const isDragging = useRef(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    // --- CONTROLADORES PARA MOUSE (DESKTOP) ---
    const handleMouseDown = (e) => {
        // Solo clic izquierdo
        if (e.button !== 0) return;

        isDragging.current = true;
        hasMoved.current = false;

        const rect = e.currentTarget.getBoundingClientRect();
        dragStartOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        hasMoved.current = true;

        const newX = e.clientX - dragStartOffset.current.x;
        const newY = e.clientY - dragStartOffset.current.y;

        // Mantener dentro de los límites de la pantalla
        const maxX = window.innerWidth - 70;
        const maxY = window.innerHeight - 70;

        setPosicion({
            x: Math.max(10, Math.min(newX, maxX)),
            y: Math.max(10, Math.min(newY, maxY)),
        });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // --- CONTROLADORES PARA PANTALLA TÁCTIL (MÓVILES) ---
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        isDragging.current = true;
        hasMoved.current = false;

        const rect = e.currentTarget.getBoundingClientRect();
        dragStartOffset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };

        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault(); // Evita el scroll de la página mientras se arrastra
        hasMoved.current = true;

        const touch = e.touches[0];
        const newX = touch.clientX - dragStartOffset.current.x;
        const newY = touch.clientY - dragStartOffset.current.y;

        const maxX = window.innerWidth - 70;
        const maxY = window.innerHeight - 70;

        setPosicion({
            x: Math.max(10, Math.min(newX, maxX)),
            y: Math.max(10, Math.min(newY, maxY)),
        });
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
    };

    // Manejador del clic principal
    const handleClick = () => {
        // Si se arrastró, no abrir la ventana de chat
        if (hasMoved.current) return;
        setAbierto(true);
        setMostrarBadge(false);
    };

    // Estilo dinámico de posición (por defecto abajo a la derecha)
    const estiloBoton = posicion.x !== null && posicion.y !== null
        ? { left: `${posicion.x}px`, top: `${posicion.y}px` }
        : {};

    return (
        <>
            {!abierto && (
                <div
                    style={estiloBoton}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onClick={handleClick}
                    className={`fixed z-50 flex flex-col items-end gap-2 cursor-grab active:cursor-grabbing select-none ${posicion.x === null ? "bottom-8 right-8" : ""
                        }`}
                >
                    {/* ETIQUETA FLOTANTE INTERACTIVA */}
                    {mostrarBadge && (
                        <div className="relative flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 shadow-xl border border-green-200 animate-bounce duration-1000">

                            {/* Punto verde pulsante de estado en línea */}
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>

                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 pointer-events-none">
                                <Sparkles size={14} className="text-green-600" />
                                <span>¿Tienes dudas? ¡Pregúntame!</span>
                            </div>

                            {/* Cerrar sugerencia */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMostrarBadge(false);
                                }}
                                className="ml-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                aria-label="Cerrar sugerencia"
                            >
                                <X size={12} />
                            </button>

                            {/* Indicador apuntando al botón */}
                            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-green-200 bg-white"></div>
                        </div>
                    )}

                    {/* BOTÓN FLOTANTE */}
                    <button
                        aria-label="Abrir chat de soporte"
                        className="
              w-16
              h-16
              rounded-full
              bg-green-600
              hover:bg-green-500
              text-white
              shadow-2xl
              flex
              items-center
              justify-center
              transition-all
              duration-200
              hover:scale-110
              active:scale-95
              shadow-green-600/30
            "
                    >
                        <MessageCircle size={30} strokeWidth={2.2} />
                    </button>
                </div>
            )}

            {/* Ventana pasando la función onClose para poder cerrarla */}
            {abierto && (
                <ChatBox onClose={() => setAbierto(false)} />
            )}
        </>
    );
}