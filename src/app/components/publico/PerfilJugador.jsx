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
const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
    const [promedioCalificacion, setPromedioCalificacion] = useState(null);
    const [anioRegistro, setAnioRegistro] = useState("—");
    const [cargandoEstadisticas, setCargandoEstadisticas] = useState(true);

    // CARGAR DATOS DE LA SESIÓN (respuesta del login de Django)
    useEffect(() => {
        try {
            const sesion = localStorage.getItem("usuarioLogueado");
            if (!sesion) return;

            const user = JSON.parse(sesion);
            if (!user || typeof user !== "object") return;

            // Django puede entregar id_usuario; algunas versiones del frontend usan id.
            const userId = user.id_usuario ?? user.id ?? user.pk ?? user.usuario_id ?? user.username ?? user.email;
            const usuario = { ...user, id: userId };
            setUsuarioLogueado(usuario);
            // Consultar los datos actuales del usuario en Django.
            if (user.id_usuario) {
                fetch(`${API_BASE}/usuarios/${user.id_usuario}/`)
                    .then(async (response) => {
                        if (!response.ok) {
                            throw new Error("No se pudo consultar el perfil en Django.");
                        }

                        return response.json();
                    })
                    .then((datos) => {
                        setUsuarioLogueado((actual) => ({
                            ...actual,
                            ...datos,
                        }));

                        setPerfil((actual) => ({
                            ...actual,
                            nombre: datos.nombre_completo || "",
                            correo: datos.email || "",
                            telefono: datos.telefono || "",
                        }));

                        setFotoPerfil(
                            datos.foto_url || "/images/login.jpg"
                        );
                    })
                    .catch((error) => {
                        console.error("Error consultando el perfil:", error);
                    });
            }

            const perfilGuardadoRaw = localStorage.getItem(`perfilUsuario_${userId}`);
            const perfilGuardado = perfilGuardadoRaw ? JSON.parse(perfilGuardadoRaw) : {};

            // Los campos del backend tienen prioridad para que aparezcan los datos del login.
            setPerfil({
                ...perfilGuardado,
                nombre: user.nombre_completo || user.nombre || user.full_name || user.username || perfilGuardado.nombre || "",
                correo: user.email || user.correo || perfilGuardado.correo || "",
                telefono: user.telefono || user.celular || user.phone || perfilGuardado.telefono || "",
                ciudad: user.ciudad || perfilGuardado.ciudad || "Popayán",
            });

            const deportivoGuardado = localStorage.getItem(`perfilDeportivo_${userId}`);
            if (deportivoGuardado) setPerfilDeportivo((actual) => ({ ...actual, ...JSON.parse(deportivoGuardado) }));

            const fotoGuardada = localStorage.getItem(`fotoPerfil_${userId}`);
            setFotoPerfil(fotoGuardada || user.foto_url || user.foto || "/images/login.jpg");

            // Las reservas siguen leyendo el almacenamiento local que usa actualmente la página.
            const reservasGuardadas = JSON.parse(localStorage.getItem("reservas") || "[]");
            const emailUsuario = user.email || user.correo || "";
            // Consultar estadísticas y próxima reserva desde Django.
            const cargarEstadisticas = async () => {
                setCargandoEstadisticas(true);

                try {
                    const response = await fetch(`${API_BASE}/reservas/`);

                    if (!response.ok) {
                        throw new Error("No se pudieron consultar las reservas.");
                    }

                    const respuesta = await response.json();

                    // Funciona tanto con listas normales como con respuestas paginadas.
                    const reservas = Array.isArray(respuesta)
                        ? respuesta
                        : respuesta.results || [];

                    const idUsuario = user.id_usuario ?? user.id;
                    const emailUsuario = user.email || user.correo || "";

                    // Cada jugador consulta únicamente sus propias reservas.
                    const misReservas = reservas.filter((reserva) =>
                        String(reserva.id_usuario) === String(idUsuario) ||
                        (
                            emailUsuario &&
                            String(reserva.email || reserva.correo || "").toLowerCase() ===
                            emailUsuario.toLowerCase()
                        )
                    );

                    const estadoReserva = (reserva) =>
                        String(reserva.estado || "").trim().toLowerCase();

                    // No contar reservas canceladas como reservas realizadas.
                    const reservasValidas = misReservas.filter(
                        (reserva) => estadoReserva(reserva) !== "cancelada"
                    );

                    setTotalReservas(reservasValidas.length);

                    // Las canchas visitadas se calculan con reservas finalizadas.
                    const reservasFinalizadas = misReservas.filter((reserva) =>
                        ["finalizada", "finalizado", "completada", "completado"]
                            .includes(estadoReserva(reserva))
                    );

                    const canchasUnicas = new Set(
                        reservasFinalizadas
                            .map((reserva) => reserva.id_cancha)
                            .filter((id) => id !== null && id !== undefined)
                            .map(String)
                    );

                    setCanchasVisitadas(canchasUnicas.size);

                    // Encontrar la reserva futura más cercana que siga activa.
                    const ahora = new Date();

                    const siguientesReservas = misReservas
                        .filter((reserva) =>
                            ["pendiente", "confirmada", "confirmado", "activa", "activo"]
                                .includes(estadoReserva(reserva))
                        )
                        .map((reserva) => {
                            const fecha = reserva.fecha_reserva || reserva.fecha;
                            const hora = reserva.hora_inicio || "00:00:00";

                            return {
                                ...reserva,
                                fecha,
                                hora,
                                fechaHora: fecha ? new Date(`${fecha}T${hora}`) : null,
                                canchaNombre:
                                    reserva.nombre_cancha ||
                                    reserva.cancha_nombre ||
                                    reserva.cancha?.nombre ||
                                    "Cancha deportiva",
                            };
                        })
                        .filter((reserva) =>
                            reserva.fechaHora &&
                            !Number.isNaN(reserva.fechaHora.getTime()) &&
                            reserva.fechaHora >= ahora
                        )
                        .sort((a, b) => a.fechaHora - b.fechaHora);

                    setProximaReserva(siguientesReservas[0] || null);

                    // Consultar la fecha real de registro del usuario.
                    if (user.id_usuario) {
                        const usuarioResponse = await fetch(
                            `${API_BASE}/usuarios/${user.id_usuario}/`
                        );

                        if (usuarioResponse.ok) {
                            const datosUsuario = await usuarioResponse.json();

                            if (datosUsuario.fecha_registro) {
                                setAnioRegistro(
                                    String(datosUsuario.fecha_registro).slice(0, 4)
                                );
                            }
                        }
                    }

                    // El promedio se mantiene vacío hasta conectarlo con las
                    // calificaciones reales de Django.
                    setPromedioCalificacion(null);
                } catch (error) {
                    console.error("Error cargando estadísticas:", error);
                } finally {
                    setCargandoEstadisticas(false);
                }
            };

            cargarEstadisticas();
        } catch (error) {
            console.error("No se pudieron cargar los datos del perfil:", error);
        }
    }, []);

    // GUARDAR PERFIL PERSONAL EN ESTE NAVEGADOR.
    // Para persistir los cambios en MySQL se necesita un endpoint de actualización en Django.
    const guardarPerfil = async () => {
        if (!usuarioLogueado?.id_usuario) {
            alert("No se encontró el ID del usuario. Inicia sesión nuevamente.");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/usuarios/${usuarioLogueado.id_usuario}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre_completo: perfil.nombre.trim(),
                        email: perfil.correo.trim(),
                        telefono: perfil.telefono.trim(),
                    }),
                }
            );

            const datos = await response.json();

            if (!response.ok) {
                const mensaje = Object.entries(datos)
                    .map(([campo, errores]) =>
                        `${campo}: ${Array.isArray(errores)
                            ? errores.join(", ")
                            : errores
                        }`
                    )
                    .join("\n");

                throw new Error(
                    mensaje || "Django no pudo actualizar el perfil."
                );
            }

            setUsuarioLogueado((actual) => ({
                ...actual,
                ...datos,
            }));

            setPerfil((actual) => ({
                ...actual,
                nombre: datos.nombre_completo || "",
                correo: datos.email || "",
                telefono: datos.telefono || "",
            }));

            localStorage.setItem(
                "usuarioLogueado",
                JSON.stringify({
                    ...usuarioLogueado,
                    ...datos,
                })
            );

            setMostrarModalPerfil(false);
            alert("Perfil actualizado correctamente en la base de datos.");
        } catch (error) {
            console.error("Error guardando perfil:", error);
            alert(`No se pudo guardar el perfil: ${error.message}`);
        }
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
            {/* MODAL PARA EDITAR DATOS PERSONALES */}
            {mostrarModalPerfil && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8">
                        <h2 className="text-2xl font-black text-slate-800 mb-6">Editar mi perfil</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nombre completo</label>
                                <input value={perfil.nombre} onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })} className="w-full border rounded-xl p-3 text-gray-800" />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Correo electrónico</label>
                                <input type="email" value={perfil.correo} onChange={(e) => setPerfil({ ...perfil, correo: e.target.value })} className="w-full border rounded-xl p-3 text-gray-800" />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                                <input value={perfil.telefono} onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })} className="w-full border rounded-xl p-3 text-gray-800" />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Ciudad</label>
                                <input value={perfil.ciudad} onChange={(e) => setPerfil({ ...perfil, ciudad: e.target.value })} className="w-full border rounded-xl p-3 text-gray-800" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setMostrarModalPerfil(false)} className="px-5 py-3 rounded-xl border font-semibold text-gray-700">Cancelar</button>
                            <button onClick={guardarPerfil} className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">Guardar cambios</button>
                        </div>
                    </div>
                </div>
            )}

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
                                    unoptimized={fotoPerfil.startsWith("data:") || fotoPerfil.startsWith("http://") || fotoPerfil.startsWith("https://")}
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
                                <h2 className="text-4xl font-black text-gray-800 mt-2">
                                    {promedioCalificacion === null
                                        ? "—"
                                        : Number(promedioCalificacion).toFixed(1)}
                                </h2>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
                                <Star className="text-yellow-500" size={28} />
                            </div>
                        </div>

                        <p className="mt-4 font-bold text-[#ca8a04] text-sm">
                            Calificación otorgada
                        </p>
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