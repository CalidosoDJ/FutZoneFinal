"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Users, Sparkles, ShieldCheck } from "lucide-react";
import ComunidadChat from "../components/publico/ComunidadChat";

export default function ComunidadPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Leemos de sessionStorage usando la llave exacta de tu login
    const usuarioGuardado = sessionStorage.getItem("usuarioLogueado") || localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        const parsedUser = JSON.parse(usuarioGuardado);
        setUserId(parsedUser.id_usuario || parsedUser.id || 1);
      } catch (e) {
        console.error("Error al leer el usuario", e);
        setUserId(1);
      }
    } else {
      setUserId(1);
    }
  }, []);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-medium">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando entorno de comunidad...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header estilo plataforma pro */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5" /> Comunidad Oficial FutZone
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              Panel de Comunidad ⚽
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Conéctate en tiempo real con otros jugadores, lanza retos competitivos o encuentra los refuerzos perfectos para tu equipo.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left pr-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</span>
              <span className="block text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Red Activa
              </span>
            </div>
          </div>
        </div>

        {/* Contenedor del Chat con estilo ultra limpio */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <ComunidadChat currentUserId={userId} />
        </div>

      </div>
    </div>
  );
}