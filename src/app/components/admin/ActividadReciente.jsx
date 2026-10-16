"use client";

import { useEffect, useState } from "react";
import { UserPlus, CalendarCheck, CalendarX, Edit3, Clock } from "lucide-react";

export default function ActividadReciente() {
    const [actividades, setActividades] = useState([]);

    useEffect(() => {
        const listaActividades = [];

        // 1. OBTENER NUEVOS USUARIOS
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        usuarios.forEach((u) => {
            listaActividades.push({
                id: `user-${u.correo || u.id}`,
                tipo: "usuario",
                titulo: "Nuevo usuario registrado",
                detalle: `${u.nombre || u.usuario || "Usuario"} se unió a FutZone`,
                fechaRaw: u.fechaRegistro || u.id || Date.now(),
                icono: <UserPlus className="text-green-600" size={18} />,
                borderColor: "border-green-600",
                bgColor: "bg-green-50",
            });
        });

        // 2. OBTENER RESERVAS REALIZADAS Y CANCELADAS
        const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
        reservas.forEach((r) => {
            const esCancelada = r.estado && r.estado.toLowerCase() === "cancelada";

            listaActividades.push({
                id: `res-${r.id || Math.random()}`,
                tipo: esCancelada ? "reserva_cancelada" : "reserva_nueva",
                titulo: esCancelada ? "Reserva cancelada" : "Nueva reserva realizada",
                detalle: `${r.usuarioNombre || r.cliente || "Un jugador"} reservó ${r.cancha || r.nombreCancha || "una cancha"} (${r.fecha || "Fecha N/A"})`,
                fechaRaw: r.fechaCreacion || r.fecha || Date.now(),
                icono: esCancelada ? (
                    <CalendarX className="text-red-600" size={18} />
                ) : (
                    <CalendarCheck className="text-blue-600" size={18} />
                ),
                borderColor: esCancelada ? "border-red-600" : "border-blue-600",
                bgColor: esCancelada ? "bg-red-50" : "bg-blue-50",
            });
        });

        // 3. OBTENER CAMBIOS EN CANCHAS (Opcional si guardas logs)
        const logsCanchas = JSON.parse(localStorage.getItem("logsCanchas") || "[]");
        logsCanchas.forEach((c) => {
            listaActividades.push({
                id: `cancha-${c.id || Math.random()}`,
                tipo: "cancha_editada",
                titulo: "Cancha actualizada",
                detalle: `Se modificaron los datos de ${c.nombreCancha || "una cancha"}`,
                fechaRaw: c.fecha || Date.now(),
                icono: <Edit3 className="text-amber-600" size={18} />,
                borderColor: "border-amber-600",
                bgColor: "bg-amber-50",
            });
        });

        // 4. ORDENAR POR FECHA MÁS RECIENTE
        listaActividades.sort((a, b) => new Date(b.fechaRaw) - new Date(a.fechaRaw));

        // Tomar las últimas 5 o 6 actividades
        setActividades(listaActividades.slice(0, 6));
    }, []);

    // Función para formatear fechas amigables
    const formatearTiempo = (fechaRaw) => {
        if (!fechaRaw) return "Recientemente";
        const fecha = new Date(fechaRaw);
        if (isNaN(fecha.getTime())) return "Recientemente";

        return fecha.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-700">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                    Actividad Reciente
                </h2>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    En vivo
                </span>
            </div>

            <div className="space-y-4">
                {actividades.length > 0 ? (
                    actividades.map((a) => (
                        <div
                            key={a.id}
                            className={`border-l-4 ${a.borderColor} pl-4 py-2 pr-3 rounded-r-xl ${a.bgColor} transition hover:translate-x-1`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex items-center gap-2">
                                    {a.icono}
                                    <h3 className="font-bold text-gray-800 text-sm">
                                        {a.titulo}
                                    </h3>
                                </div>

                                <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                                    <Clock size={12} />
                                    {formatearTiempo(a.fechaRaw)}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 mt-1 pl-6">
                                {a.detalle}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No hay actividad registrada aún en el sistema.
                    </div>
                )}
            </div>
        </div>
    );
}