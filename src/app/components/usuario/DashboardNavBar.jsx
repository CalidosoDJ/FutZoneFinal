"use client";

import { Bell, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function DashboardNavbar() {

    const router = useRouter();

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        const usuarioLogueado = JSON.parse(
            localStorage.getItem("usuarioLogueado")
        );

        setUsuario(usuarioLogueado);

    }, []);

    const cerrarSesion = () => {

        localStorage.removeItem("usuarioLogueado");

        router.push("/login");

    };
    const [sinLeer, setSinLeer] = useState(0);

    useEffect(() => {

        const datos = localStorage.getItem("notificacionesJugador");

        if (datos) {

            const lista = JSON.parse(datos);

            setSinLeer(
                lista.filter(item => !item.leida).length
            );

        }

    }, []);

    return (

        <nav
            className="
            sticky
            top-0
            z-50
            bg-gray-950
            text-white
            px-8
            py-4
            shadow-lg
            "
        >

            <div className="flex justify-between items-center ">

                {/* Logo */}

                <div
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                >
                    <h1 className="text-3xl font-bold">

                        Fut
                        <span className="text-green-500">
                            Zone
                        </span>

                    </h1>
                </div>

                {/* Menú */}

                <div className="hidden md:flex gap-8">

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="hover:text-green-500 transition"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => router.push("/mis-reservas")}
                        className="hover:text-green-500 transition"
                    >
                        Mis Reservas
                    </button>


                    

                    <button
                        onClick={() => router.push("/canchas")}
                        className="hover:text-green-500 transition"
                    >
                        Canchas
                    </button>

                    <button
                        onClick={() => router.push("/mapa")}
                        className="hover:text-green-500 transition"
                    >
                        Mapa
                    </button>


                    <button
                        onClick={() => router.push("/perfil")}
                        className="hover:text-green-500 transition"
                    >
                        Mi Perfil
                    </button>

                    
                </div>

                {/* Usuario */}

                <div className="flex items-center gap-5">

                    {/* Notificaciones */}

                    <Link href="/notificaciones">

                        <div className="relative cursor-pointer">

                            <Bell
                                size={24}
                                className="hover:text-green-500 transition"
                            />

                            {sinLeer > 0 && (

                                <span
                                    className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                font-bold
                w-5
                h-5
                rounded-full
                flex
                items-center
                justify-center
                "
                                >
                                    {sinLeer}
                                </span>

                            )}

                        </div>

                    </Link>

                    {/* Avatar */}

                    <div
                        className="
                        w-10
                        h-10
                        rounded-full
                        bg-green-600
                        flex
                        items-center
                        justify-center
                        "
                    >
                        <User size={20} />
                    </div>

                    {/* Nombre */}

                    <div className="hidden md:block">

                        <p className="font-semibold">
                            {usuario?.nombre}
                        </p>

                        <p className="text-xs text-gray-400">
                            Usuario
                        </p>

                    </div>

                    {/* Cerrar Sesión */}

                    <button
                        onClick={cerrarSesion}
                        className="
                        flex
                        items-center
                        gap-2
                        bg-red-600
                        hover:bg-red-700
                        px-4
                        py-2
                        rounded-xl
                        transition
                        "
                    >
                        <LogOut size={18} />
                        Salir
                    </button>

                </div>

            </div>

        </nav>

    );

}