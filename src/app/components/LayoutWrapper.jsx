"use client";

import { usePathname } from "next/navigation";

import NavBarWrapper from "./publico/NavBarWrapper";
import ChatButton from "./publico/CHAT/ChatButton";
import Footer from "./publico/Footer";
import BotonFlotanteComunidad from "./publico/BotonFlotanteComunidad";


export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    const esArbitro = pathname.startsWith("/arbitro");

    const rutasOcultas = [
        "/",
        "/login",
        "/registro",
        "/mapa",
        "/mis-reservas",
        "/dashboard",
        "/admin",
    ];

    const ocultarFooter =
        esArbitro ||
        rutasOcultas.some(
            (ruta) =>
                pathname === ruta ||
                (ruta !== "/" && pathname.startsWith(`${ruta}/`))
        );

    return (
        <>
            {!esArbitro && (
                <>
                    <NavBarWrapper />
                    <ChatButton />
                    {/* Botón flotante de la comunidad (solo aparece si el usuario es jugador) */}
                    <BotonFlotanteComunidad />
                </>
            )}

            <main className="flex-1">
                {children}
            </main>

            {!ocultarFooter && <Footer/>}
        </>
    );
}