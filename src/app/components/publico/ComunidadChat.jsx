"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Calendar, Users, Trophy, MessageSquareText, ShieldAlert, MessageCircle, X, ChevronRight } from "lucide-react";

export default function ComunidadChat({ currentUserId }) {
  const [mensajes, setMensajes] = useState([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [matchDate, setMatchDate] = useState("");
  const [spotsNeeded, setSpotsNeeded] = useState("");
  const [filtro, setFiltro] = useState("TODOS");
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Estados para el Chat Privado y Contactos Recientes
  const [chatAbierto, setChatAbierto] = useState(false);
  const [usuarioDestino, setUsuarioDestino] = useState(null);
  const [mensajesPrivados, setMensajesPrivados] = useState([]);
  const [textoPrivado, setTextoPrivado] = useState("");
  const [enviandoPrivado, setEnviandoPrivado] = useState(false);
  const [misContactos, setMisContactos] = useState([]);

  const bottomRef = useRef(null);
  const bottomPrivadoRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const obtenerTokenSeguro = () => {
    if (typeof window === "undefined") return "";
    return (
      sessionStorage.getItem("tokenFutZone") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access") ||
      ""
    );
  };

  const cargarMensajes = async () => {
    try {
      const token = obtenerTokenSeguro();
      if (!token) {
        setErrorMsg("No hay sesión activa. Por favor, inicia sesión de nuevo.");
        return;
      }

      const res = await fetch(`${API_URL}/comunidad/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        setErrorMsg("Acceso restringido. Token no válido o expirado. Vuelve a iniciar sesión.");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setMensajes(data);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Error conectando con la API:", err);
    }
  };

  // Cargar lista de personas con las que ha interactuado el usuario
  const cargarContactosRecientes = async () => {
    try {
      const token = obtenerTokenSeguro();
      const res = await fetch(`${API_URL}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const listaUsuarios = Array.isArray(data) ? data : data?.results || [];
        // Filtramos para no mostrarse a sí mismo
        setMisContactos(listaUsuarios.filter(u => Number(u.id_usuario ?? u.id) !== Number(currentUserId)));
      }
    } catch (err) {
      console.error("Error cargando contactos:", err);
    }
  };

  useEffect(() => {
    cargarMensajes();
    cargarContactosRecientes();
    const intervalo = setInterval(() => {
      cargarMensajes();
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

  useEffect(() => {
    bottomPrivadoRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesPrivados.length]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setEnviando(true);

    try {
      const token = obtenerTokenSeguro();
      const res = await fetch(`${API_URL}/comunidad/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          category,
          match_date: category !== "GENERAL" && matchDate ? matchDate : null,
          spots_needed: category === "BUSCO_JUGADOR" && spotsNeeded ? Number(spotsNeeded) : null,
        }),
      });

      if (res.ok) {
        setContent("");
        setMatchDate("");
        setSpotsNeeded("");
        setCategory("GENERAL");
        await cargarMensajes();
      }
    } finally {
      setEnviando(false);
    }
  };

  // Cargar mensajes privados reales desde Django
  const cargarMensajesPrivados = async (otroId) => {
    try {
      const token = obtenerTokenSeguro();
      const res = await fetch(`${API_URL}/chat/${otroId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMensajesPrivados(data);
      }
    } catch (err) {
      console.error("Error cargando chat privado:", err);
    }
  };

  // Abrir modal de chat con un usuario específico
  const abrirChatConUsuario = (usuarioObj) => {
    const idOtro = usuarioObj.id_usuario ?? usuarioObj.id;
    const nombreOtro = usuarioObj.nombre_completo ?? usuarioObj.nombre ?? "Jugador";
    const usernameOtro = usuarioObj.username ?? "jugador";

    setUsuarioDestino({
      id: idOtro,
      nombre: nombreOtro,
      username: usernameOtro
    });
    setChatAbierto(true);
    cargarMensajesPrivados(idOtro);
  };

  // Enviar mensaje privado real a través de la API de Django
  const enviarMensajePrivado = async (e) => {
    e.preventDefault();
    if (!textoPrivado.trim() || !usuarioDestino) return;

    setEnviandoPrivado(true);
    try {
      const token = obtenerTokenSeguro();
      const res = await fetch(`${API_URL}/chat/${usuarioDestino.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contenido: textoPrivado.trim()
        }),
      });

      if (res.ok) {
        setTextoPrivado("");
        await cargarMensajesPrivados(usuarioDestino.id);
      }
    } catch (err) {
      console.error("Error enviando mensaje privado:", err);
    } finally {
      setEnviandoPrivado(false);
    }
  };

  // Sincronización automática del chat privado cada 3 segundos si está abierto
  useEffect(() => {
    let intervaloPrivado;
    if (chatAbierto && usuarioDestino) {
      intervaloPrivado = setInterval(() => {
        cargarMensajesPrivados(usuarioDestino.id);
      }, 3000);
    }
    return () => clearInterval(intervaloPrivado);
  }, [chatAbierto, usuarioDestino]);

  const mensajesFiltrados =
    filtro === "TODOS" ? mensajes : mensajes.filter((m) => m.category === filtro);

  const obtenerEstiloBadge = (cat) => {
    if (cat === "RETO_VS") return "bg-rose-50 text-rose-700 border-rose-200";
    if (cat === "BUSCO_JUGADOR") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const obtenerTextoBadge = (cat) => {
    if (cat === "RETO_VS") return "⚔️ Reto VS";
    if (cat === "BUSCO_JUGADOR") return "🏃 Busco Jugador";
    return "💬 General";
  };

  if (errorMsg) {
    return (
      <div className="p-12 bg-white rounded-3xl text-center space-y-4 border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <p className="text-slate-700 text-sm font-semibold">{errorMsg}</p>
        <button
          onClick={() => {
            sessionStorage.removeItem("tokenFutZone");
            sessionStorage.removeItem("usuarioLogueado");
            window.location.href = "/login";
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-3xl overflow-hidden relative shadow-sm border border-slate-200/80">
      
      {/* Barra Superior con Filtros y Accesos Rápidos de Chat */}
      <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-900">Comunidad y Chats FutZone</span>
          </div>

          <div className="flex gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            {[
              { id: "TODOS", label: "Todos" },
              { id: "BUSCO_JUGADOR", label: "🏃 Refuerzos" },
              { id: "RETO_VS", label: "⚔️ Retos" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiltro(tab.id)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filtro === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bandeja horizontal de Jugadores para iniciar chat privado al instante */}
        {misContactos.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Chatear con:</span>
            {misContactos.map((contacto) => {
              const cId = contacto.id_usuario ?? contacto.id;
              const cNombre = contacto.nombre_completo ?? contacto.nombre ?? "Jugador";
              return (
                <button
                  key={cId}
                  type="button"
                  onClick={() => abrirChatConUsuario(contacto)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition shrink-0 shadow-xs cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {cNombre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Área de Mensajes de Comunidad */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {mensajesFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">Aún no hay publicaciones en esta categoría.</p>
            <p className="text-xs text-slate-400">¡Sé el primero en lanzar un reto o armar parche!</p>
          </div>
        )}

        {mensajesFiltrados.map((msg) => {
          const esMio = Number(msg.autor_id) === Number(currentUserId);
          return (
            <div
              key={msg.id_mensaje}
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 transition-all ${
                esMio
                  ? "ml-auto bg-emerald-600 text-white shadow-md shadow-emerald-600/10 rounded-br-sm"
                  : "mr-auto bg-white border border-slate-200/90 text-slate-800 shadow-sm rounded-bl-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-6 mb-1.5">
                <span className={`text-xs font-extrabold ${esMio ? "text-emerald-100" : "text-emerald-700"}`}>
                  {esMio ? "Tú" : msg.autor_nombre}
                  {msg.autor_username && !esMio && (
                    <span className={`font-normal ml-1 ${esMio ? "text-emerald-200" : "text-slate-400"}`}>
                      @{msg.autor_username}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${obtenerEstiloBadge(msg.category)}`}>
                  {obtenerTextoBadge(msg.category)}
                </span>
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal">{msg.content}</p>

              {(msg.match_date || msg.spots_needed) && (
                <div className={`mt-3 pt-2.5 border-t flex flex-wrap gap-2 text-xs ${
                  esMio ? "border-emerald-500/40 text-emerald-50" : "border-slate-100 text-slate-600"
                }`}>
                  {msg.match_date && (
                    <span className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-medium ${
                      esMio ? "bg-emerald-700/50" : "bg-slate-100 text-slate-700"
                    }`}>
                      <Calendar className="w-3.5 h-3.5" /> {msg.match_date}
                    </span>
                  )}
                  {msg.spots_needed && (
                    <span className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-medium ${
                      esMio ? "bg-emerald-700/50" : "bg-slate-100 text-slate-700"
                    }`}>
                      <Users className="w-3.5 h-3.5" /> Faltan: {msg.spots_needed}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/20">
                <span className={`text-[10px] ${esMio ? "text-emerald-200" : "text-slate-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>

                {!esMio && (
                  <button
                    type="button"
                    onClick={() => abrirChatConUsuario({
                      id_usuario: msg.autor_id,
                      nombre: msg.autor_nombre,
                      username: msg.autor_username
                    })}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer border border-emerald-200/60"
                  >
                    <MessageCircle size={13} /> Responder Privado
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Formulario de Envío General */}
      <form onSubmit={handleEnviar} className="p-4 bg-white border-t border-slate-100 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "GENERAL", label: "💬 General" },
            { id: "BUSCO_JUGADOR", label: "🏃 Busco Jugador" },
            { id: "RETO_VS", label: "⚔️ Reto VS" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                category === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {category !== "GENERAL" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Día, hora y cancha (Ej: Viernes 8 PM - Cancha 2)"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {category === "BUSCO_JUGADOR" && (
              <input
                type="number"
                min={1}
                max={15}
                placeholder="¿Cuántos faltan?"
                value={spotsNeeded}
                onChange={(e) => setSpotsNeeded(e.target.value)}
                className="sm:w-44 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-emerald-600 focus-within:bg-white transition-all shadow-xs">
          <input
            type="text"
            placeholder="Escribe un mensaje a la comunidad de FutZone..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={enviando || !content.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* ================================================= */}
      {/* MODAL DE CHAT PRIVADO REAL CON EL JUGADOR         */}
      {/* ================================================= */}
      {chatAbierto && usuarioDestino && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[550px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Cabecera del Modal */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                  {usuarioDestino.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{usuarioDestino.nombre}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    @{usuarioDestino.username || "jugador"} • Chat Directo
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatAbierto(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mensajes del Chat Privado */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {mensajesPrivados.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-10">
                  No hay mensajes aún con {usuarioDestino.nombre}. ¡Empieza la conversación!
                </div>
              )}

              {mensajesPrivados.map((m) => {
                const remitenteId = typeof m.id_remitente === "object" ? m.id_remitente?.id_usuario : m.id_remitente;
                const esMio = Number(remitenteId) === Number(currentUserId);
                
                return (
                  <div
                    key={m.id_mensaje_privado || m.id || Math.random()}
                    className={`flex flex-col max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm ${
                      esMio
                        ? "ml-auto bg-emerald-600 text-white rounded-br-sm"
                        : "mr-auto bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.contenido || m.texto}</p>
                    <span className={`text-[10px] mt-1 self-end ${esMio ? "text-emerald-200" : "text-slate-400"}`}>
                      {m.fecha_envio ? new Date(m.fecha_envio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : m.hora}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomPrivadoRef} />
            </div>

            {/* Formulario de Envío Privado */}
            <form onSubmit={enviarMensajePrivado} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Escribe un mensaje a ${usuarioDestino.nombre}...`}
                value={textoPrivado}
                onChange={(e) => setTextoPrivado(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={enviandoPrivado || !textoPrivado.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center shrink-0"
              >
                <Send size5={16} size={16} />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}