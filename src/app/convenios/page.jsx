"use client";

import { useState } from "react";

import Link from "next/link";
import {
    ArrowRight,
    Building2,
    Users,
    TrendingUp,
    CreditCard,
    Megaphone,
    BarChart3,
    Handshake,
    CheckCircle2,
    Sparkles,
    Send,
} from "lucide-react";

export default function ConveniosPage() {

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [formulario, setFormulario] = useState({
        empresa: "",
        representante: "",
        correo: "",
        telefono: "",
        tipoNegocio: "",
        ciudad: "",
        descripcion: "",
        motivo: "",
    });

    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value,
        });

    };
    const beneficios = [
        {
            icon: TrendingUp,
            titulo: "Mayor visibilidad",
            descripcion:
                "Haz que tu negocio llegue a más jugadores y usuarios dentro de FutZone.",
        },
        {
            icon: Users,
            titulo: "Más clientes",
            descripcion:
                "Conecta con una comunidad deportiva interesada en nuevos escenarios y servicios.",
        },
        {
            icon: CreditCard,
            titulo: "Gestión digital",
            descripcion:
                "Facilita la gestión de reservas, servicios y futuras opciones de pago.",
        },
        {
            icon: Megaphone,
            titulo: "Promociones",
            descripcion:
                "Publica ofertas y beneficios especiales para la comunidad FutZone.",
        },
        {
            icon: BarChart3,
            titulo: "Seguimiento",
            descripcion:
                "Accede a herramientas para conocer la actividad y el crecimiento de tu negocio.",
        },
        {
            icon: Handshake,
            titulo: "Alianza estratégica",
            descripcion:
                "Forma parte de una red de aliados que impulsa el deporte y la tecnología.",
        },
    ];
    const enviarSolicitud = (e) => {

        e.preventDefault();

        if (
            !formulario.empresa ||
            !formulario.representante ||
            !formulario.correo ||
            !formulario.telefono ||
            !formulario.tipoNegocio ||
            !formulario.ciudad ||
            !formulario.descripcion ||
            !formulario.motivo
        ) {

            alert("Por favor completa todos los campos.");

            return;

        }

        const nuevaSolicitud = {
            id: Date.now(),

            ...formulario,

            estado: "En revisión",

            fechaSolicitud: new Date().toLocaleDateString("es-CO"),
        };

        // Guardar solicitud
        const solicitudes =
            JSON.parse(localStorage.getItem("convenios")) || [];

        localStorage.setItem(
            "convenios",
            JSON.stringify([...solicitudes, nuevaSolicitud])
        );

        // Cerrar formulario
        setMostrarFormulario(false);

        // Mostrar mensaje
        setMostrarMensaje(true);

        // Limpiar formulario
        setFormulario({
            empresa: "",
            representante: "",
            correo: "",
            telefono: "",
            tipoNegocio: "",
            ciudad: "",
            descripcion: "",
            motivo: "",
        });

    };
    return (
        <main className="min-h-screen bg-slate-50">
            {/* MODAL FORMULARIO */}
            

            {mostrarFormulario && (

                <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl">

                        {/* ENCABEZADO */}

                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">

                            <div>

                                <span className="text-green-600 font-bold text-sm tracking-widest">

                                    SOLICITUD DE CONVENIO

                                </span>

                                <h2 className="text-3xl font-black text-gray-800 mt-1">

                                    Cuéntanos sobre tu negocio

                                </h2>

                                <p className="text-gray-500 mt-2">

                                    Completa la información para solicitar un convenio con FutZone.

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setMostrarFormulario(false)}
                                className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 font-bold text-xl transition"
                            >

                                ✕

                            </button>

                        </div>


                        {/* FORMULARIO */}

                        <form
                            onSubmit={enviarSolicitud}
                            className="p-8 md:p-10"
                        >

                            <div className="grid md:grid-cols-2 gap-6">

                                {/* EMPRESA */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Nombre de la empresa o negocio

                                    </label>

                                    <input
                                        type="text"
                                        name="empresa"
                                        value={formulario.empresa}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Canchas El Cubo"
                                        className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                {/* REPRESENTANTE */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Nombre del representante

                                    </label>

                                    <input
                                        type="text"
                                        name="representante"
                                        value={formulario.representante}
                                        onChange={manejarCambio}
                                        placeholder="Nombre completo"
                                        className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                {/* CORREO */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Correo electrónico

                                    </label>

                                    <input
                                        type="email"
                                        name="correo"
                                        value={formulario.correo}
                                        onChange={manejarCambio}
                                        placeholder="correo@ejemplo.com"
                                        className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                {/* TELÉFONO */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Número de contacto

                                    </label>

                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formulario.telefono}
                                        onChange={manejarCambio}
                                        placeholder="300 000 0000"
                                        className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>


                                {/* TIPO DE NEGOCIO */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Tipo de negocio

                                    </label>

                                    <select
                                        name="tipoNegocio"
                                        value={formulario.tipoNegocio}
                                        onChange={manejarCambio}
                                        className=" text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    >

                                        <option value="">
                                            Selecciona una opción
                                        </option>

                                        <option value="Canchas deportivas">
                                            Canchas deportivas
                                        </option>

                                        <option value="Empresa">
                                            Empresa
                                        </option>

                                        <option value="Organizador de torneos">
                                            Organizador de torneos
                                        </option>

                                        <option value="Restaurante o negocio">
                                            Restaurante o negocio
                                        </option>

                                        <option value="Otro">
                                            Otro
                                        </option>

                                    </select>

                                </div>


                                {/* CIUDAD */}

                                <div>

                                    <label className="block font-bold text-gray-700 mb-2">

                                        Ciudad

                                    </label>

                                    <input
                                        type="text"
                                        name="ciudad"
                                        value={formulario.ciudad}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Popayán"
                                        className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-500"
                                    />

                                </div>

                            </div>


                            {/* DESCRIPCIÓN */}

                            <div className="mt-6">

                                <label className="block font-bold text-gray-700 mb-2">

                                    Cuéntanos sobre tu negocio

                                </label>

                                <textarea
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarCambio}
                                    rows={4}
                                    placeholder="Describe brevemente los servicios o productos que ofrece tu negocio..."
                                    className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-green-500"
                                />

                            </div>


                            {/* MOTIVO */}

                            <div className="mt-6">

                                <label className="block font-bold text-gray-700 mb-2">

                                    ¿Por qué deseas realizar un convenio con FutZone?

                                </label>

                                <textarea
                                    name="motivo"
                                    value={formulario.motivo}
                                    onChange={manejarCambio}
                                    rows={4}
                                    placeholder="Cuéntanos qué esperas obtener de esta alianza..."
                                    className="text-gray-700 w-full border border-gray-300 rounded-xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-green-500"
                                />

                            </div>


                            {/* BOTONES */}

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-10 pt-6 border-t border-gray-100">

                                <button
                                    type="button"
                                    onClick={() => setMostrarFormulario(false)}
                                    className="px-7 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition"
                                >

                                    Cancelar

                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition hover:scale-[1.02]"
                                >

                                    <Send size={20} />

                                    Enviar solicitud

                                </button>

                            </div>

                        </form>
                        
                        

                    </div>
                    

                </section>

            )}
            {/* MENSAJE SOLICITUD ENVIADA */}

{mostrarMensaje && (

    <section className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">

        <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl animate-in zoom-in duration-300">

            {/* Fondo decorativo */}

            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500">

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>

            </div>


            <div className="relative px-6 pt-14 pb-6 text-center">

                {/* ICONO */}

                <div className="mx-auto w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center">

                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">

                        <CheckCircle2
                            size={34}
                            className="text-green-600"
                        />

                    </div>

                </div>


                <span className="inline-block mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-xs">

                    🎉 SOLICITUD ENVIADA

                </span>


                <h2 className="text-2xl font-black text-gray-800 mt-4">

                    ¡Todo salió perfecto!

                </h2>


                <p className="text-gray-500 leading-6 mt-3 text-sm">

                    Hemos recibido correctamente tu solicitud de convenio con FutZone.

                </p>


                {/* ESTADO */}

                <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">

                    <div className="flex items-center justify-center gap-2">

                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>

                        <span className="font-black text-yellow-700">

                            Estado: En revisión

                        </span>

                    </div>

                    <p className="text-sm text-yellow-700 mt-2 leading-6">

                        Tu solicitud está siendo revisada por el administrador de FutZone.

                        Te notificaremos cuando tengamos una respuesta.

                    </p>

                </div>


                {/* MENSAJE */}

                <div className="mt-4 bg-gray-50 rounded-2xl p-4">

                    <p className="text-gray-600 text-sm leading-6">

                        🚀 Estamos emocionados por conocer tu propuesta y la posibilidad de crear una nueva alianza junto a FutZone.

                    </p>

                </div>


                {/* BOTÓN */}

                <button
                    onClick={() => setMostrarMensaje(false)}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-500 text-white font-black shadow-lg hover:shadow-green-300 hover:scale-[1.02] transition"
                >

                    Entendido, muchas gracias ⚽

                </button>

            </div>

        </div>

    </section>

)}

            {/* HERO */}

            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950 to-emerald-800">

                {/* EFECTOS DE FONDO */}

                <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl" />

                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* TEXTO */}

                        <div>

                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">

                                <Sparkles
                                    size={18}
                                    className="text-green-400"
                                />

                                <span className="text-green-100 font-semibold">

                                    ALIANZAS FUTZONE

                                </span>

                            </div>

                            <h1 className="text-5xl md:text-6xl font-black text-white mt-8 leading-tight">

                                Hagamos crecer

                                <span className="block text-green-400">

                                    tu negocio juntos.

                                </span>

                            </h1>

                            <p className="text-slate-300 text-lg md:text-xl mt-6 max-w-xl leading-8">

                                Únete a FutZone mediante un convenio y conecta
                                tu negocio con una comunidad apasionada por el
                                deporte, la tecnología y nuevas experiencias.

                            </p>

                            <div className="flex flex-wrap gap-4 mt-10">

                                <a
                                    href="#solicitar"
                                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-105"
                                >

                                    Solicitar convenio

                                    <ArrowRight size={20} />

                                </a>

                                <a
                                    href="#beneficios"
                                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition"
                                >

                                    Ver beneficios

                                </a>

                            </div>

                        </div>


                        {/* TARJETA */}

                        <div className="relative">

                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />

                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[35px] p-8 md:p-10 shadow-2xl">

                                <div className="flex items-center justify-between">

                                    <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">

                                        <Handshake
                                            size={32}
                                            className="text-white"
                                        />

                                    </div>

                                    <span className="px-4 py-2 rounded-full bg-green-400/20 text-green-300 font-bold text-sm">

                                        FUTZONE PARTNERS

                                    </span>

                                </div>

                                <h2 className="text-3xl font-black text-white mt-8">

                                    Crecemos en equipo

                                </h2>

                                <p className="text-slate-300 mt-3 leading-7">

                                    Creamos alianzas con escenarios deportivos,
                                    empresas y negocios que quieran hacer parte
                                    del ecosistema FutZone.

                                </p>

                                <div className="mt-8 space-y-4">

                                    <div className="flex items-center gap-3 text-white">

                                        <CheckCircle2
                                            className="text-green-400"
                                            size={22}
                                        />

                                        Mayor presencia digital

                                    </div>

                                    <div className="flex items-center gap-3 text-white">

                                        <CheckCircle2
                                            className="text-green-400"
                                            size={22}
                                        />

                                        Nuevas oportunidades

                                    </div>

                                    <div className="flex items-center gap-3 text-white">

                                        <CheckCircle2
                                            className="text-green-400"
                                            size={22}
                                        />

                                        Beneficios exclusivos

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* BENEFICIOS */}

            <section
                id="beneficios"
                className="max-w-7xl mx-auto px-6 py-24"
            >

                <div className="max-w-3xl">

                    <span className="text-green-600 font-bold tracking-widest text-sm">

                        BENEFICIOS

                    </span>

                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">

                        Todo lo que puedes obtener con un convenio.

                    </h2>

                    <p className="text-gray-500 text-lg mt-5 leading-8">

                        Ser aliado de FutZone significa acceder a herramientas,
                        visibilidad y oportunidades diseñadas para impulsar tu
                        negocio dentro del ecosistema deportivo.

                    </p>

                </div>


                {/* GRID BENEFICIOS */}

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7 mt-14">

                    {beneficios.map((beneficio, index) => {

                        const Icono = beneficio.icon;

                        return (

                            <div
                                key={index}
                                className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >

                                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors">

                                    <Icono
                                        size={30}
                                        className="text-green-600 group-hover:text-white transition-colors"
                                    />

                                </div>

                                <h3 className="text-2xl font-black text-gray-800 mt-7">

                                    {beneficio.titulo}

                                </h3>

                                <p className="text-gray-500 mt-3 leading-7">

                                    {beneficio.descripcion}

                                </p>

                            </div>

                        );

                    })}

                </div>

            </section>


            {/* TIPOS DE ALIADOS */}

            <section className="bg-white border-y border-slate-100">

                <div className="max-w-7xl mx-auto px-6 py-24">

                    <div className="text-center max-w-3xl mx-auto">

                        <span className="text-green-600 font-bold tracking-widest text-sm">

                            ¿QUIÉNES PUEDEN SER ALIADOS?

                        </span>

                        <h2 className="text-4xl font-black text-gray-900 mt-4">

                            Construyamos una red deportiva.

                        </h2>

                        <p className="text-gray-500 text-lg mt-5">

                            FutZone está pensado para conectar diferentes actores
                            del mundo deportivo.

                        </p>

                    </div>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

                        <div className="rounded-3xl bg-slate-50 border border-slate-100 p-7 text-center hover:shadow-lg hover:-translate-y-1 transition">

                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">

                                ⚽

                            </div>

                            <h3 className="font-black text-gray-800 text-lg mt-5">

                                Canchas deportivas

                            </h3>

                        </div>

                        <div className="rounded-3xl bg-slate-50 border border-slate-100 p-7 text-center hover:shadow-lg hover:-translate-y-1 transition">

                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">

                                🏢

                            </div>

                            <h3 className="font-black text-gray-800 text-lg mt-5">

                                Empresas

                            </h3>

                        </div>

                        <div className="rounded-3xl bg-slate-50 border border-slate-100 p-7 text-center hover:shadow-lg hover:-translate-y-1 transition">

                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">

                                🏆

                            </div>

                            <h3 className="font-black text-gray-800 text-lg mt-5">

                                Organizadores

                            </h3>

                        </div>

                        <div className="rounded-3xl bg-slate-50 border border-slate-100 p-7 text-center hover:shadow-lg hover:-translate-y-1 transition">

                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">

                                🤝

                            </div>

                            <h3 className="font-black text-gray-800 text-lg mt-5">

                                Negocios aliados

                            </h3>

                        </div>

                    </div>

                </div>

            </section>


            {/* SOLICITAR CONVENIO - POR AHORA VISUAL */}

            <section
                id="solicitar"
                className="max-w-7xl mx-auto px-6 py-24"
            >

                <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-10 md:p-16">

                    <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10" />

                    <div className="relative grid lg:grid-cols-2 gap-10 items-center">

                        <div>

                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

                                <Building2
                                    size={32}
                                    className="text-white"
                                />

                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mt-7">

                                ¿Quieres ser aliado de FutZone?

                            </h2>

                            <p className="text-green-50 text-lg mt-5 leading-8">

                                Cuéntanos sobre tu negocio y descubre las
                                oportunidades que podemos construir juntos.

                            </p>

                        </div>

                        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-8">

                            <h3 className="text-2xl font-black text-white">

                                Solicita tu convenio

                            </h3>

                            <p className="text-green-100 mt-3">

                                En el siguiente paso podrás completar toda la
                                información de tu solicitud.

                            </p>

                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="w-full mt-7 bg-white text-green-700 hover:bg-green-50 px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition hover:scale-[1.02]"
                            >

                                <Send size={20} />

                                Comenzar solicitud

                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}