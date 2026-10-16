"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import NavBar from "@/app/components/publico/NavBar";
import ContenidoPrincipal from "@/app/components/publico/ContenidoPrincipal";
import Footer from "@/app/components/publico/Footer";
import SplashScreen from "./components/publico/SplashScreen";

export default function Home() {
    const router = useRouter();
    const [mostrarSplash, setMostrarSplash] = useState(true);

    // VALIDACIÓN DE SESIÓN EN EL HOME
    useEffect(() => {
        const usuarioLogueado = localStorage.getItem("usuarioLogueado");

        if (usuarioLogueado) {
            try {
                const user = JSON.parse(usuarioLogueado);

                // Redirigir según el rol del usuario para evitar el acceso al Home si ya hay sesión
                if (user.rol === "admin") {
                    router.replace("/admin");
                } else if (user.rol === "arbitro") {
                    router.replace("/arbitro/dashboard");
                } else {
                    router.replace("/dashboard");
                }
            } catch (e) {
                // Si el formato de localStorage está corrupto, limpiarlo
                localStorage.removeItem("usuarioLogueado");
            }
        }
    }, [router]);

    return (
        <>
            {mostrarSplash ? (
                <SplashScreen
                    onFinish={() => setMostrarSplash(false)}
                />
            ) : (
                <>
                    <NavBar />

                    <ContenidoPrincipal />

                    <Footer />
                </>
            )}
        </>
    );
}