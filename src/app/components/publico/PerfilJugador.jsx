"use client";

import Image from "next/image";
import {
    Mail,
    Phone,
    MapPin,
    Camera,
    Pencil,
    BadgeCheck,
    CalendarCheck,
    MapPinned,
    Star,
    Clock3,
    CalendarDays
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PerfilJugador() {
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);

    // Estados de Modales
    const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);
    const [mostrarPerfilDeportivo, setMostrarPerfilDeportivo] = useState(false);

    // Estado del Perfil Personal
    const [perfil, setPerfil] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        ciudad: "Popayán",
    });

    // Estado del Perfil Deportivo
    const [perfilDeportivo, setPerfilDeportivo] = useState({
        posicion: "Delantero",
        pierna: "Derecha",
        horario: "06:00 PM",
        cancha: "Fútbol 6",
        zona: "Norte",
        nivel: "Intermedio",
        modalidad: "Amistoso",
        frecuencia: "2 veces/semana",
    });

    // Estado de la Foto de Perfil
    const [fotoPerfil, setFotoPerfil] = useState("/images/login.jpg");

    // Estado para Próxima Reserva y Estadísticas
    const [proximaReserva, setProximaReserva] = useState(null);
    const [totalReservas, setTotalReservas] = useState(0);
    const [canchasVisitadas, setCanchasVisitadas] = useState(0);

    // 1. CARGA DE USUARIO Y SUS DATOS ESPECÍFICOS
    useEffect(() => {
        const sesion = localStorage.getItem("usuarioLogueado");
        if (!sesion) return;

        const user = JSON.parse(sesion);
        setUsuarioLogueado(user);

        // Cargar Perfil Personal individual del usuario
        const perfilGuardado = localStorage.getItem(`perfilUsuario_${user.id}`);
        if (perfilGuardado) {
            setPerfil(JSON.parse(perfilGuardado));
        } else {
            setPerfil({
                nombre: user.nombre || user.usuario || "",
                correo: user.correo || "",
                telefono: user.celular || "",
                ciudad: "Popayán",
            });
        }

        // Cargar Perfil Deportivo individual
        const deportivoGuardado = localStorage.getItem(`perfilDeportivo_${user.id}`);
        if (deportivoGuardado) {
            setPerfilDeportivo(JSON.parse(deportivoGuardado));
        }

        // Cargar Foto individual
        const fotoGuardada = localStorage.getItem(`fotoPerfil_${user.id}`);
        if (fotoGuardada) {
            setFotoPerfil(fotoGuardada);
        }

        // Cargar Reservas exclusivas del usuario
        const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
        const misReservas = reservasGuardadas.filter((r) => r.usuarioId === user.id || r.correo === user.correo);

        setTotalReservas(misReservas.length);

        // Contar canchas únicas visitadas
        const canchasUnicas = new Set(misReservas.map((r) => r.canchaNombre || r.cancha));
        setCanchasVisitadas(canchasUnicas.size);

        // Obtener la próxima reserva
        if (misReservas.length > 0) {
            setProximaReserva(misReservas[misReservas.length - 1]);
        }
    }, []);

    // GUARDAR PERFIL PERSONAL
    const guardarPerfil = () => {
        if (!usuarioLogueado) return;
        localStorage.setItem(`perfilUsuario_${usuarioLogueado.id}`, JSON.stringify(perfil));
        setMostrarModalPerfil(false);
        alert("Perfil actualizado correctamente.");
    };

    // GUARDAR PERFIL DEPORTIVO
    const guardarPerfilDeportivo = () => {
        if (!usuarioLogueado) return;
        localStorage.setItem(`perfilDeportivo_${usuarioLogueado.id}`, JSON.stringify(perfilDeportivo));
        setMostrarPerfilDeportivo(false);
    };

    // CAMBIAR FOTO DE PERFIL
    const cambiarFoto = (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo || !usuarioLogueado) return;

        const lector = new FileReader();
        lector.onloadend = () => {
            const nuevaFoto = lector.result;
            setFotoPerfil(nuevaFoto);
            localStorage.setItem(`fotoPerfil_${usuarioLogueado.id}`, nuevaFoto);
        };
        lector.readAsDataURL(archivo);
    };

    return (
        <>
            {/* MODAL EDITAR PERFIL DEPORTIVO */}
            {mostrarPerfilDeportivo && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8">
                        <h2 className="text-3xl font-black text-slate-800 mb-6">
                            Editar Perfil Deportivo
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="font-semibold text-slate-700">Posición favorita</label>
                                <select
                                    value={perfilDeportivo.posicion}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, posicion: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Arquero</option>
                                    <option>Defensa</option>
                                    <option>Volante</option>
                                    <option>Delantero</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Pierna dominante</label>
                                <select
                                    value={perfilDeportivo.pierna}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, pierna: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Derecha</option>
                                    <option>Izquierda</option>
                                    <option>Ambas</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Horario favorito</label>
                                <select
                                    value={perfilDeportivo.horario}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, horario: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>08:00 AM</option>
                                    <option>10:00 AM</option>
                                    <option>02:00 PM</option>
                                    <option>04:00 PM</option>
                                    <option>06:00 PM</option>
                                    <option>08:00 PM</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Tipo de cancha</label>
                                <select
                                    value={perfilDeportivo.cancha}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, cancha: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Fútbol 5</option>
                                    <option>Fútbol 6</option>
                                    <option>Fútbol 7</option>
                                    <option>Fútbol 8</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Zona favorita</label>
                                <select
                                    value={perfilDeportivo.zona}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, zona: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Norte</option>
                                    <option>Centro</option>
                                    <option>Sur</option>
                                    <option>Occidente</option>
                                    <option>Oriente</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Nivel</label>
                                <select
                                    value={perfilDeportivo.nivel}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, nivel: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Principiante</option>
                                    <option>Intermedio</option>
                                    <option>Avanzado</option>
                                    <option>Profesional</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Modalidad favorita</label>
                                <select
                                    value={perfilDeportivo.modalidad}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, modalidad: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Amistoso</option>
                                    <option>Torneo</option>
                                    <option>Entrenamiento</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Frecuencia</label>
                                <select
                                    value={perfilDeportivo.frecuencia}
                                    onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, frecuencia: e.target.value })}
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>1 vez/semana</option>
                                    <option>2 veces/semana</option>
                                    <option>3 veces/semana</option>
                                    <option>Todos los días</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={() => setMostrarPerfilDeportivo(false)}
                                className="px-6 py-3 rounded-xl border font-semibold cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarPerfilDeportivo}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold cursor-pointer"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECCIÓN PORTADA Y PERFIL */}
            <section className="bg-white rounded-[35px] shadow-lg border border-slate-200 overflow-hidden">
                {/* PORTADA CON ALTURA ADECUADA (h-48) */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950 to-emerald-800">
                    <div className="absolute -top-20 -right-10 w-72 h-72 bg-green-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* SECCIÓN INFERIOR CON PADDING SUPERIOR ADECUADO */}
                <div className="px-8 pb-8 pt-4">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end -mt-20 lg:-mt-24 mb-6">
                        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6">

                            {/* FOTO DE PERFIL */}
                            <div className="relative shrink-0">
                                <Image
                                    src={fotoPerfil}
                                    alt="Foto de perfil"
                                    width={150}
                                    height={150}
                                    unoptimized={fotoPerfil.startsWith("data:")}
                                    className="w-[150px] h-[150px] rounded-full border-4 border-white object-cover shadow-xl bg-gray-200"
                                />
                                <input
                                    type="file"
                                    id="cambiarFoto"
                                    accept="image/*"
                                    onChange={cambiarFoto}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="cambiarFoto"
                                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition duration-300"
                                >
                                    <Camera size={18} />
                                </label>
                            </div>

                            {/* INFORMACIÓN DEL PERFIL (SIN TRASLAPE CON EL BANNER) */}
                            <div className="text-center lg:text-left pt-3 lg:pt-0">
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <h1 className="text-3xl lg:text-4xl font-black text-gray-800 leading-normal">
                                        {perfil.nombre || "Usuario FutZone"}
                                    </h1>
                                    <BadgeCheck size={26} className="text-green-600 shrink-0" />
                                </div>
                                <p className="text-gray-500 text-base mt-1">Jugador de FutZone</p>
                                <span className="inline-block mt-3 bg-green-100 text-green-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                                    🟢 Perfil activo
                                </span>
                            </div>
                        </div>

                        {/* BOTÓN EDITAR */}
                        <button
                            onClick={() => setMostrarModalPerfil(true)}
                            className="mt-6 lg:mt-0 bg-white border-2 border-green-600 hover:bg-green-600 hover:text-white text-green-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            <Pencil size={18} />
                            Editar Perfil
                        </button>
                    </div>

                    {/* MODAL EDITAR PERFIL DEPORTIVO CON BOTÓN "X" Y "CANCELAR" */}
                    {mostrarPerfilDeportivo && (
                        <div
                            onClick={() => setMostrarPerfilDeportivo(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                        >
                            {/* e.stopPropagation() evita que al hacer clic dentro del modal este se cierre */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto"
                            >
                                {/* BOTÓN "X" PARA CERRAR EN EL HEADER */}
                                <button
                                    onClick={() => setMostrarPerfilDeportivo(false)}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition cursor-pointer p-2 rounded-full hover:bg-gray-100"
                                    aria-label="Cerrar modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-3xl font-black text-slate-800 mb-6 pr-8">
                                    Editar Perfil Deportivo
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Posición favorita</label>
                                        <select
                                            value={perfilDeportivo.posicion}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, posicion: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Arquero</option>
                                            <option>Defensa</option>
                                            <option>Volante</option>
                                            <option>Delantero</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Pierna dominante</label>
                                        <select
                                            value={perfilDeportivo.pierna}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, pierna: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Derecha</option>
                                            <option>Izquierda</option>
                                            <option>Ambas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Horario favorito</label>
                                        <select
                                            value={perfilDeportivo.horario}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, horario: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>08:00 AM</option>
                                            <option>10:00 AM</option>
                                            <option>02:00 PM</option>
                                            <option>04:00 PM</option>
                                            <option>06:00 PM</option>
                                            <option>08:00 PM</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Tipo de cancha</label>
                                        <select
                                            value={perfilDeportivo.cancha}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, cancha: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Fútbol 5</option>
                                            <option>Fútbol 6</option>
                                            <option>Fútbol 7</option>
                                            <option>Fútbol 8</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Zona favorita</label>
                                        <select
                                            value={perfilDeportivo.zona}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, zona: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Norte</option>
                                            <option>Centro</option>
                                            <option>Sur</option>
                                            <option>Occidente</option>
                                            <option>Oriente</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Nivel</label>
                                        <select
                                            value={perfilDeportivo.nivel}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, nivel: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Principiante</option>
                                            <option>Intermedio</option>
                                            <option>Avanzado</option>
                                            <option>Profesional</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Modalidad favorita</label>
                                        <select
                                            value={perfilDeportivo.modalidad}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, modalidad: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>Amistoso</option>
                                            <option>Torneo</option>
                                            <option>Entrenamiento</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-semibold text-slate-700 block mb-1">Frecuencia</label>
                                        <select
                                            value={perfilDeportivo.frecuencia}
                                            onChange={(e) => setPerfilDeportivo({ ...perfilDeportivo, frecuencia: e.target.value })}
                                            className="w-full text-gray-700 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option>1 vez/semana</option>
                                            <option>2 veces/semana</option>
                                            <option>3 veces/semana</option>
                                            <option>Todos los días</option>
                                        </select>
                                    </div>
                                </div>

                                {/* BOTONES DE ACCIÓN (CANCELAR Y GUARDAR) */}
                                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setMostrarPerfilDeportivo(false)}
                                        className="px-6 py-3 rounded-xl border border-gray-300 text-white bg-red-500 hover:bg-red-600 font-semibold cursor-pointer transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={guardarPerfilDeportivo}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold cursor-pointer transition shadow-md hover:shadow-lg"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATOS DE CONTACTO */}
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-4">
                            <Mail className="text-green-600" size={22} />
                            <div>
                                <p className="text-xs text-gray-500">Correo</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {perfil.correo || "No configurado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-4">
                            <Phone className="text-green-600" size={22} />
                            <div>
                                <p className="text-xs text-gray-500">Teléfono</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {perfil.telefono || "No configurado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-4">
                            <MapPin className="text-green-600" size={22} />
                            <div>
                                <p className="text-xs text-gray-500">Ciudad</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {perfil.ciudad || "Popayán"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ESTADÍSTICAS REALES DENTRO DE LA PLATAFORMA */}
            <section className="mt-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Tus estadísticas</h2>
                    <p className="text-gray-600 text-sm mt-1">Un resumen de tu actividad en FutZone.</p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Reservas</p>
                                <h2 className="text-4xl font-black text-gray-800 mt-2">{totalReservas}</h2>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                <CalendarCheck className="text-green-600" size={28} />
                            </div>
                        </div>
                        <p className="text-green-600 mt-4 font-semibold text-sm">Reservas realizadas</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Canchas</p>
                                <h2 className="text-4xl font-black text-gray-800 mt-2">{canchasVisitadas}</h2>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                                <MapPinned className="text-blue-600" size={28} />
                            </div>
                        </div>
                        <p className="text-blue-600 mt-4 font-semibold text-sm">Canchas visitadas</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Promedio</p>
                                <h2 className="text-4xl font-black text-gray-800 mt-2">5.0</h2>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
                                <Star className="text-yellow-500" size={28} />
                            </div>
                        </div>
                        <p className="mt-4 font-bold text-[#ca8a04] text-sm">Calificación otorgada</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-green-200 shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Miembro</p>
                                <h2 className="text-3xl font-black text-gray-800 mt-2">2026</h2>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                                <Clock3 className="text-purple-600" size={28} />
                            </div>
                        </div>
                        <p className="text-purple-600 mt-4 font-semibold text-sm">Desde tu registro</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN PRÓXIMA RESERVA (DINÁMICA) */}
            <section className="mt-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Próxima reserva</h2>
                    <p className="text-gray-600 text-sm mt-1">Información de tu siguiente partido.</p>
                </div>

                {proximaReserva ? (
                    <div className="bg-white rounded-[30px] border border-gray-200 shadow-md overflow-hidden">
                        <div className="grid lg:grid-cols-3">
                            <div className="relative h-[220px] lg:h-full">
                                <Image
                                    src={proximaReserva.imagen || "/images/cancha1.jpg"}
                                    alt="Cancha"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="lg:col-span-2 p-8">
                                <div className="flex justify-between items-start flex-wrap gap-4">
                                    <div>
                                        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-semibold text-xs">
                                            {proximaReserva.estado || "Confirmada"}
                                        </span>
                                        <h2 className="text-3xl font-black text-gray-800 mt-3">
                                            {proximaReserva.canchaNombre || proximaReserva.cancha || "Cancha Deportiva"}
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Popayán • Cancha Sintética
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-gray-100 rounded-2xl p-4">
                                        <CalendarDays className="text-green-600 mb-2" size={24} />
                                        <p className="text-xs text-gray-500">Fecha</p>
                                        <h3 className="font-bold text-gray-800 mt-1 text-sm">
                                            {proximaReserva.fecha || "Por definir"}
                                        </h3>
                                    </div>

                                    <div className="bg-gray-100 rounded-2xl p-4">
                                        <Clock3 className="text-blue-600 mb-2" size={24} />
                                        <p className="text-xs text-slate-500">Hora</p>
                                        <h3 className="font-bold text-slate-800 mt-1 text-sm">
                                            {proximaReserva.hora || "Por definir"}
                                        </h3>
                                    </div>

                                    <div className="bg-gray-100 rounded-2xl p-4">
                                        <MapPinned className="text-red-500 mb-2" size={24} />
                                        <p className="text-xs text-slate-500">Dirección</p>
                                        <h3 className="font-bold text-slate-800 mt-1 text-sm">
                                            Popayán, Cauca
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        <p className="font-semibold text-lg">No tienes reservas activas en este momento.</p>
                        <p className="text-sm text-gray-400 mt-1">Reserva una cancha desde el catálogo para ver los detalles aquí.</p>
                    </div>
                )}
            </section>

            {/* PERFIL DEPORTIVO VISUAL */}
            <section className="mt-8 mb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-800">Perfil Deportivo</h2>
                    <p className="text-slate-500 text-sm mt-1">Tus preferencias deportivas registradas.</p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">⚽</div>
                        <p className="text-slate-500 text-xs mt-3">Posición favorita</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.posicion}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">🦶</div>
                        <p className="text-slate-500 text-xs mt-3">Pierna dominante</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.pierna}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">🕒</div>
                        <p className="text-slate-500 text-xs mt-3">Horario favorito</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.horario}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">🏟️</div>
                        <p className="text-slate-500 text-xs mt-3">Tipo de cancha</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.cancha}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">📍</div>
                        <p className="text-slate-500 text-xs mt-3">Zona favorita</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.zona}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">🏅</div>
                        <p className="text-slate-500 text-xs mt-3">Nivel</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.nivel}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">🔥</div>
                        <p className="text-slate-500 text-xs mt-3">Modalidad</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.modalidad}</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6">
                        <div className="text-4xl">📅</div>
                        <p className="text-slate-500 text-xs mt-3">Frecuencia</p>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{perfilDeportivo.frecuencia}</h3>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setMostrarPerfilDeportivo(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition cursor-pointer text-sm"
                    >
                        Editar Perfil Deportivo
                    </button>
                </div>
            </section>
        </>
    );
}