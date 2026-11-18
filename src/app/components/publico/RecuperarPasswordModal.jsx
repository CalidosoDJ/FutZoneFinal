"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function RecuperarPasswordModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Ejemplo de llamada a tu API de Next.js / Backend
            const res = await fetch("/api/auth/recuperar-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Ocurrió un error al procesar la solicitud.");
            }

            setMensajeExito(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setEmail("");
        setMensajeExito(false);
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                {/* Cabecera Verde FutZone */}
                <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white text-center relative">
                    <h3 className="text-2xl font-black tracking-wide">
                        FUT<span className="text-green-200">ZONE</span>
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                        Recuperación de contraseña
                    </p>
                </div>

                <div className="p-6">
                    {mensajeExito ? (
                        /* ESTADO DE ÉXITO */
                        <div className="text-center py-4 space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">
                                ¡Correo enviado!
                            </h4>
                            <p className="text-sm text-gray-600">
                                Hemos enviado un enlace de recuperación a{" "}
                                <span className="font-semibold text-gray-800">{email}</span>. Revisa tu bandeja de entrada o spam.
                            </p>
                            <button
                                onClick={handleCloseModal}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md mt-2"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        /* FORMULARIO DE SOLICITUD */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
                            </p>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jugador@ejemplo.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                                        </>
                                    ) : (
                                        "Enviar Enlace"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}