"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, CheckCircle } from "lucide-react";

export default function BienvenidaBanner() {
    const [saludo, setSaludo] = useState("");
    const [nombreAdmin, setNombreAdmin] = useState("Administrador");
    const [visible, setVisible] = useState(false);
    const [renderizar, setRenderizar] = useState(true);

    useEffect(() => {
        // 1. Obtener nombre del usuario logueado
        const usuarioLogueado = localStorage.getItem("usuarioLogueado");
        if (usuarioLogueado) {
            try {
                const admin = JSON.parse(usuarioLogueado);
                setNombreAdmin(admin.nombre || admin.usuario || "Administrador");
            } catch (e) {
                console.error("Error al leer sesión", e);
            }
        }

        // 2. Determinar el saludo según la hora
        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) {
            setSaludo("Buenos días");
        } else if (hora >= 12 && hora < 19) {
            setSaludo("Buenas tardes");
        } else {
            setSaludo("Buenas noches");
        }

        // 3. Animación de ENTRADA (Deslizar desde la izquierda)
        const timerEntrada = setTimeout(() => {
            setVisible(true);
        }, 300);

        // 4. Animación de SALIDA hacia la izquierda (A los 4 segundos)
        const timerSalida = setTimeout(() => {
            setVisible(false);
        }, 3000);

        // 5. Desmontar del DOM (A los 4.5 segundos)
        const timerDesmontar = setTimeout(() => {
            setRenderizar(false);
        }, 4500);

        return () => {
            clearTimeout(timerEntrada);
            clearTimeout(timerSalida);
            clearTimeout(timerDesmontar);
        };
    }, []);

    if (!renderizar) return null;

    return (
        <div
            className={`fixed top-6 left-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-l-4 border-green-500 transition-all duration-500 ease-in-out transform ${visible
                ? "translate-x-0 opacity-100 scale-100"
                : "-translate-x-full opacity-0 scale-95"
                }`}
        >
            {/* Ícono animado */}
            <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                <Sparkles size={20} className="animate-pulse" />
            </div>

            {/* Texto de la notificación */}
            <div>
                <p className="text-xs text-green-400 font-semibold tracking-wide uppercase flex items-center gap-1">
                    <CheckCircle size={12} />
                    Sesión Iniciada
                </p>
                <p className="text-sm font-bold text-white">
                    ¡{saludo}, <span className="text-green-400">{nombreAdmin}</span>! 👋
                </p>
            </div>

            {/* Botón de cierre manual */}
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => setRenderizar(false), 500);
                }}
                className="ml-2 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
                <X size={16} />
            </button>
        </div>
    );
}