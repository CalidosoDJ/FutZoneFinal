
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import NavBar from "@/app/components/publico/NavBar";
import ContenidoPrincipal from "@/app/components/publico/ContenidoPrincipal";
import ComoFunciona from "@/app/components/publico/como_funciona";
import Footer from "@/app/components/publico/Footer";
import SplashScreen from "./components/publico/SplashScreen";

export default function Home() {
  const router = useRouter();
  const [mostrarSplash, setMostrarSplash] = useState(true);

  // Validar si existe una sesión activa
  useEffect(() => {
    const datosUsuario = localStorage.getItem("usuarioLogueado");

    if (!datosUsuario) return;

    try {
      const usuario = JSON.parse(datosUsuario);

      // Redirigir según el rol del usuario
      if (usuario.rol === "admin") {
        router.replace("/admin");
      } else if (usuario.rol === "arbitro") {
        router.replace("/arbitro/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error al validar la sesión:", error);
      localStorage.removeItem("usuarioLogueado");
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

          <ComoFunciona />

          <Footer />
        </>
      )}
    </>
  );
}
