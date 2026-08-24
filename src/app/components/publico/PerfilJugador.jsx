"use client";
import Image from "next/image";
import {
    Mail,
    Phone,
    MapPin,
    Camera,
    Pencil,
    BadgeCheck,
} from "lucide-react";
import {
    CalendarCheck,
    MapPinned,
    Star,
    Clock3
} from "lucide-react";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
export default function PerfilJugador() {

    const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);

    const [perfil, setPerfil] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        ciudad: "a",
    });
    useEffect(() => {

        const datos = JSON.parse(localStorage.getItem("perfilUsuario"));

        if (datos) {

            setPerfil(datos);

        }

    }, []);
    const guardarPerfil = () => {

        localStorage.setItem(
            "perfilUsuario",
            JSON.stringify(perfil)
        );

        setMostrarModalPerfil(false);

        alert("Perfil actualizado correctamente.");

    };
    const [mostrarPerfilDeportivo, setMostrarPerfilDeportivo] = useState(false);

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
    useEffect(() => {

        const datos = JSON.parse(
            localStorage.getItem("perfilDeportivo")
        );

        if (datos) {

            setPerfilDeportivo(datos);

        }

    }, []);
    const guardarPerfilDeportivo = () => {

        localStorage.setItem(
            "perfilDeportivo",
            JSON.stringify(perfilDeportivo)
        );

        setMostrarPerfilDeportivo(false);

    };
    const [fotoPerfil, setFotoPerfil] = useState("/images/login.jpg");

    useEffect(() => {
        const fotoGuardada = localStorage.getItem("fotoPerfil");

        if (fotoGuardada) {
            setFotoPerfil(fotoGuardada);
        }
    }, []);

    const cambiarFoto = (e) => {
        const archivo = e.target.files?.[0];

        if (!archivo) return;

        const lector = new FileReader();

        lector.onloadend = () => {
            const nuevaFoto = lector.result;

            setFotoPerfil(nuevaFoto);

            localStorage.setItem(
                "fotoPerfil",
                nuevaFoto
            );
        };

        lector.readAsDataURL(archivo);
    };

    return (
        <>
            {mostrarPerfilDeportivo && (

                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8">

                        <h2 className="text-3xl font-black text-slate-800 mb-8">

                            Editar Perfil Deportivo

                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Posición */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Posición favorita

                                </label>

                                <select
                                    value={perfilDeportivo.posicion}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            posicion: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Arquero</option>
                                    <option>Defensa</option>
                                    <option>Volante</option>
                                    <option>Delantero</option>
                                </select>

                            </div>

                            {/* Pierna */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Pierna dominante

                                </label>

                                <select
                                    value={perfilDeportivo.pierna}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            pierna: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Derecha</option>
                                    <option>Izquierda</option>
                                    <option>Ambas</option>
                                </select>

                            </div>

                            {/* Horario */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Horario favorito

                                </label>

                                <select
                                    value={perfilDeportivo.horario}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            horario: e.target.value,
                                        })
                                    }
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

                            {/* Tipo */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Tipo de cancha

                                </label>

                                <select
                                    value={perfilDeportivo.cancha}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            cancha: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Fútbol 5</option>
                                    <option>Fútbol 6</option>
                                    <option>Fútbol 7</option>
                                    <option>Fútbol 8</option>
                                </select>

                            </div>

                            {/* Zona */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Zona favorita

                                </label>

                                <select
                                    value={perfilDeportivo.zona}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            zona: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Norte</option>
                                    <option>Centro</option>
                                    <option>Sur</option>
                                    <option>Occidente</option>
                                    <option>Oriente</option>
                                </select>

                            </div>

                            {/* Nivel */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Nivel

                                </label>

                                <select
                                    value={perfilDeportivo.nivel}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            nivel: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Principiante</option>
                                    <option>Intermedio</option>
                                    <option>Avanzado</option>
                                    <option>Profesional</option>
                                </select>

                            </div>

                            {/* Modalidad */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Modalidad favorita

                                </label>

                                <select
                                    value={perfilDeportivo.modalidad}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            modalidad: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>Amistoso</option>
                                    <option>Torneo</option>
                                    <option>Entrenamiento</option>
                                </select>

                            </div>

                            {/* Frecuencia */}

                            <div>

                                <label className="font-semibold text-slate-700">

                                    Frecuencia

                                </label>

                                <select
                                    value={perfilDeportivo.frecuencia}
                                    onChange={(e) =>
                                        setPerfilDeportivo({
                                            ...perfilDeportivo,
                                            frecuencia: e.target.value,
                                        })
                                    }
                                    className="w-full text-gray-700 mt-2 border rounded-xl p-3"
                                >
                                    <option>1 vez/semana</option>
                                    <option>2 veces/semana</option>
                                    <option>3 veces/semana</option>
                                    <option>Todos los días</option>
                                </select>

                            </div>

                        </div>

                        <div className="flex justify-end gap-4 mt-10">

                            <button
                                onClick={() => setMostrarPerfilDeportivo(false)}
                                className="px-6 py-3 rounded-xl border font-semibold"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={guardarPerfilDeportivo}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
                            >
                                Guardar cambios
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <section className="bg-white rounded-[35px] shadow-lg border border-slate-200">

                {/* PORTADA */}

                <div className="h-52 relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950 to-emerald-800">

                    {/* EFECTOS DE LUZ */}

                    <div className="absolute -top-20 -right-10 w-72 h-72 bg-green-500/30 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>


                    {/* LÍNEAS DECORATIVAS */}

                    <div className="absolute inset-0 opacity-10">

                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                                backgroundSize: "45px 45px"
                            }}
                        />

                    </div>


                    {/* DECORACIÓN DE CAMPO */}

                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white/10 rounded-full"></div>

                    <div className="absolute right-28 top-0 h-full w-px bg-white/10"></div>

                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/10 rounded-full"></div>


                    {/* SOMBRA */}

                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>

                </div>

                <div className="px-10 pb-10">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end -mt-20">

                        {/* FOTO Y DATOS */}

                        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">

                            {/* FOTO DE PERFIL */}

                            <div className="relative">

                                <Image
                                    src={fotoPerfil}
                                    alt="Foto de perfil"
                                    width={170}
                                    height={170}
                                    unoptimized={fotoPerfil.startsWith("data:")}
                                    className="w-[170px] h-[170px] rounded-full border-[7px] border-white object-cover shadow-2xl"
                                />

                                {/* INPUT OCULTO PARA SELECCIONAR FOTO */}

                                <input
                                    type="file"
                                    id="cambiarFoto"
                                    accept="image/*"
                                    onChange={cambiarFoto}
                                    className="hidden"
                                />

                                {/* BOTÓN DE CÁMARA */}

                                <label
                                    htmlFor="cambiarFoto"
                                    className="absolute bottom-3 right-3
            w-12 h-12 rounded-full
            bg-green-600 hover:bg-green-700
            flex items-center justify-center
            text-white shadow-lg cursor-pointer
            hover:scale-110 transition duration-300"
                                >

                                    <Camera size={22} />

                                </label>

                            </div>


                            {/* INFORMACIÓN DEL PERFIL */}

                            <div className="text-center lg:text-left">

                                <div className="flex items-center justify-center lg:justify-start gap-3">

                                    <h1 className="text-4xl font-black text-gray-800">

                                        {perfil.nombre || "Nombre no disponible"}

                                    </h1>

                                    <BadgeCheck
                                        size={28}
                                        className="text-green-600"
                                    />

                                </div>

                                <p className="text-gray-500 text-lg mt-2">

                                    Jugador de FutZone

                                </p>

                                <span
                                    className="inline-block mt-4
            bg-green-100
            text-green-700
            font-semibold
            px-5
            py-2
            rounded-full"
                                >

                                    🟢 Perfil activo

                                </span>

                            </div>

                        </div>

                        {/* BOTÓN */}

                        <button
                            onClick={() => setMostrarModalPerfil(true)}
                            className="mt-8 lg:mt-0
    bg-white
    border-2
    border-green-600
    hover:bg-green-600
    hover:text-white
    text-green-600
    px-8
    py-4
    rounded-2xl
    font-bold
    flex
    items-center
    gap-3
    transition"
                        >

                            <Pencil size={20} />

                            Editar Perfil

                        </button>

                    </div>
                    {mostrarModalPerfil && (

                        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">

                            <div className="bg-white rounded-3xl p-8 w-[500px]">

                                <h2 className="text-3xl text-green-600 font-bold mb-8">

                                    Editar Perfil

                                </h2>

                                <input
                                    type="text"
                                    value={perfil.nombre}
                                    onChange={(e) =>
                                        setPerfil({
                                            ...perfil,
                                            nombre: e.target.value
                                        })
                                    }
                                    placeholder="Nombre"
                                    className="w-full text-gray-800 border rounded-xl p-3 mb-4"
                                />

                                <input
                                    type="email"
                                    value={perfil.correo}
                                    onChange={(e) =>
                                        setPerfil({
                                            ...perfil,
                                            correo: e.target.value
                                        })
                                    }
                                    placeholder="Correo"
                                    className="w-full text-gray-800 border rounded-xl p-3 mb-4"
                                />

                                <input
                                    type="text"
                                    value={perfil.telefono}
                                    onChange={(e) =>
                                        setPerfil({
                                            ...perfil,
                                            telefono: e.target.value
                                        })
                                    }
                                    placeholder="Teléfono"
                                    className="w-full text-gray-800 border rounded-xl p-3 mb-4"
                                />

                                <input
                                    type="text"
                                    value={perfil.ciudad}
                                    onChange={(e) =>
                                        setPerfil({
                                            ...perfil,
                                            ciudad: e.target.value
                                        })
                                    }
                                    placeholder="Ciudad"
                                    className="w-full text-gray-800 border rounded-xl p-3"
                                />

                                <div className="flex gap-4 mt-8">

                                    <button
                                        onClick={guardarPerfil}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-gray-800 py-3 rounded-xl font-bold"
                                    >

                                        Guardar

                                    </button>

                                    <button
                                        onClick={() => setMostrarModalPerfil(false)}
                                        className="flex-1 border rounded-xl text-gray-800"
                                    >

                                        Cancelar

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* DATOS */}

                    <div className="grid md:grid-cols-3 gap-6 mt-10">

                        <div className="flex items-center gap-4 bg-gray-100 rounded-2xl p-5">

                            <Mail className="text-green-600" />

                            <div>

                                <p className="text-sm text-gray-500">

                                    Correo

                                </p>

                                <p className="font-semibold text-gray-800">

                                    {perfil.correo || "Correo no disponible"}

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 bg-gray-100 rounded-2xl p-5">

                            <Phone className="text-green-600" />

                            <div>

                                <p className="text-sm text-gray-500">

                                    Teléfono

                                </p>

                                <p className="font-semibold text-gray-800">

                                    {perfil.telefono || "Teléfono no disponible"}

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-4 bg-gray-100 rounded-2xl p-5">

                            <MapPin className="text-green-600" />

                            <div>

                                <p className="text-sm text-gray-500">

                                    Ciudad

                                </p>

                                <p className="font-semibold text-gray-800">

                                    {perfil.ciudad || "Ciudad no disponible"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            <section className="mt-10">

                <div className="mb-8">

                    <h2 className="text-3xl font-black text-gray-800">

                        Tus estadísticas

                    </h2>

                    <p className="text-gray-600 mt-2">

                        Un resumen de tu actividad dentro de FutZone.

                    </p>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* RESERVAS */}

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-7 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-600 fon-size-sm font-fam">

                                    Reservas

                                </p>

                                <h2 className="text-5xl font-black text-gray-800 mt-3">

                                    18

                                </h2>

                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                                <CalendarCheck className="text-green-600" size={34} />

                            </div>

                        </div>

                        <p className="text-green-600 mt-6 font-semibold">

                            Reservas realizadas

                        </p>

                    </div>

                    {/* CANCHAS */}

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-7 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-600 fon-size-sm font-fam    
                                ">

                                    Canchas

                                </p>

                                <h2 className="text-5xl font-black text-gray-800 mt-3">

                                    6

                                </h2>

                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                                <MapPinned className="text-blue-600" size={34} />

                            </div>

                        </div>

                        <p className="text-blue-600 mt-6 font-semibold">

                            Canchas visitadas

                        </p>

                    </div>

                    {/* CALIFICACIÓN */}


                    <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-7 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-600 fon-size-sm font-fam    
                                ">

                                    Promedio

                                </p>

                                <h2 className="text-5xl font-black text-gray-800 mt-3">

                                    4.9

                                </h2>

                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">

                                <Star className="text-yellow-500" size={34} />

                            </div>

                        </div>

                        <p className="mt-6 font-bold text-[#ca8a04]">
                            Calificación otorgada
                        </p>

                    </div>

                    {/* TIEMPO */}

                    <div className="bg-white rounded-3xl border border-green-200 shadow-md p-7 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-gray-600 fon-size-sm font-fam    
                                ">

                                    Miembro

                                </p>

                                <h2 className="text-4xl font-black text-gray-800 mt-3">

                                    2026

                                </h2>

                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">

                                <Clock3 className="text-purple-600" size={34} />

                            </div>

                        </div>

                        <p className="text-purple-600 mt-6 font-semibold">

                            Desde tu registro

                        </p>

                    </div>

                </div>

            </section>
            {/* PRÓXIMA RESERVA */}

            <section className="mt-12">

                <div className="mb-8">

                    <h2 className="text-3xl font-black text-gray-800">

                        Próxima reserva

                    </h2>

                    <p className="text-gray-600 mt-2">

                        Consulta rápidamente la información de tu siguiente partido.

                    </p>

                </div>

                <div className="bg-white rounded-[30px] border border-gray-200 shadow-md overflow-hidden">

                    <div className="grid lg:grid-cols-3">

                        {/* Imagen */}

                        <div className="relative h-[280px] lg:h-full">

                            <Image
                                src="/images/cancha1.jpg"
                                alt="Cancha"
                                fill
                                className="object-cover"
                            />

                        </div>

                        {/* Información */}

                        <div className="lg:col-span-2 p-10">

                            <div className="flex justify-between items-start flex-wrap gap-4">

                                <div>

                                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                                        Confirmada

                                    </span>

                                    <h2 className="text-4xl font-black text-gray-800 mt-5">

                                        Cancha El Cubo

                                    </h2>

                                    <p className="text-gray-600 mt-2">

                                        Popayán • Cancha Sintética

                                    </p>

                                </div>

                            </div>

                            {/* Datos */}

                            <div className="grid md:grid-cols-3 gap-5 mt-10">

                                <div className="bg-gray-100 rounded-2xl p-5">

                                    <CalendarDays
                                        className="text-green-600 mb-3"
                                        size={28}
                                    />

                                    <p className="text-gray-600">

                                        Fecha

                                    </p>

                                    <h3 className="font-bold text-gray-800 mt-2">

                                        30 Julio 2026

                                    </h3>

                                </div>

                                <div className="bg-gray-100 rounded-2xl p-5">

                                    <Clock3
                                        className="text-blue-600 mb-3"
                                        size={28}
                                    />

                                    <p className="text-slate-500">

                                        Hora

                                    </p>

                                    <h3 className="font-bold text-slate-800 mt-2">

                                        06:00 PM

                                    </h3>

                                </div>

                                <div className="bg-gray-100 rounded-2xl p-5">

                                    <MapPinned
                                        className="text-red-500 mb-3"
                                        size={28}
                                    />

                                    <p className="text-slate-500">

                                        Dirección

                                    </p>

                                    <h3 className="font-bold text-slate-800 mt-2">

                                        Popayán, Cauca

                                    </h3>

                                </div>

                            </div>

                            {/* Botón */}

                            <div className="mt-10">

                                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl duration-300">

                                    Ver detalles

                                </button>

                            </div>

                        </div>

                    </div>


                </div>

            </section>
            {/* PERFIL DEPORTIVO */}

            <section className="mt-12">

                <div className="mb-8">

                    <h2 className="text-3xl font-black text-slate-800">

                        Perfil Deportivo

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Personaliza tus preferencias para disfrutar una mejor experiencia en FutZone.

                    </p>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* POSICIÓN */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">⚽</div>

                        <p className="text-slate-500 mt-5">

                            Posición favorita

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.posicion || "Delantero"}

                        </h3>

                    </div>

                    {/* PIERNA */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">🦶</div>

                        <p className="text-slate-500 mt-5">

                            Pierna dominante

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.pierna || "Derecha"}

                        </h3>

                    </div>

                    {/* HORARIO */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">🕒</div>

                        <p className="text-slate-500 mt-5">

                            Horario favorito

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.horario || "6:00 PM"}

                        </h3>

                    </div>

                    {/* TIPO */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">🏟️</div>

                        <p className="text-slate-500 mt-5">

                            Tipo de cancha

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.cancha || "Fútbol 6"}

                        </h3>

                    </div>

                    {/* ZONA */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">📍</div>

                        <p className="text-slate-500 mt-5">

                            Zona favorita

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.zona || "Norte"}

                        </h3>

                    </div>

                    {/* NIVEL */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">🏅</div>

                        <p className="text-slate-500 mt-5">

                            Nivel

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.nivel || "Intermedio"}

                        </h3>

                    </div>

                    {/* MODALIDAD */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">🔥</div>

                        <p className="text-slate-500 mt-5">

                            Modalidad

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.modalidad || "Amistoso"}

                        </h3>

                    </div>

                    {/* FRECUENCIA */}

                    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl duration-300">

                        <div className="text-5xl">📅</div>

                        <p className="text-slate-500 mt-5">

                            Frecuencia

                        </p>

                        <h3 className="text-2xl font-black text-slate-800 mt-2">

                            {perfilDeportivo.frecuencia || "2 veces/semana"}
                        </h3>

                    </div>

                </div>

                <div className="flex justify-center mt-10">

                    <button
                        onClick={() => setMostrarPerfilDeportivo(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition"
                    >
                        Editar Perfil Deportivo
                    </button>

                </div>

            </section>


        </>

    );

}

