
"use client";

import { useState } from "react";

import NavBar from "@/app/components/publico/NavBar";
import ContenidoPrincipal from "@/app/components/publico/ContenidoPrincipal";
import Footer from "@/app/components/publico/Footer";
import SplashScreen from "./components/publico/SplashScreen";

export default function Home() {
    const [mostrarSplash, setMostrarSplash] = useState(true);

    // VALIDACIÓN DE SESIÓN EN EL HOME
    useEffect(() => {
        // Obtenemos el ID activo guardado en el login
        const userIdActive = localStorage.getItem("usuarioLogueadoId");
        const rawUserData = userIdActive
            ? localStorage.getItem(`perfilUsuario_${userIdActive}`) || localStorage.getItem("usuarioLogueado")
            : localStorage.getItem("usuarioLogueado");

        if (rawUserData) {
            try {
                const user = JSON.parse(rawUserData);

                // Mapear según id_rol de MySQL (1: admin, 2: jugador, 3: arbitro)
                const rol = user.id_rol || user.rol;

                if (rol === 1 || rol === "admin") {
                    router.replace("/admin");
                } else if (rol === 3 || rol === "arbitro") {
                    router.replace("/arbitro/dashboard");
                } else if (rol === 2 || rol === "jugador") {
                    router.replace("/dashboard");
                }
            } catch (e) {
                // Si el formato de localStorage está corrupto, limpiamos
                localStorage.removeItem("usuarioLogueado");
                localStorage.removeItem("usuarioLogueadoId");
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
