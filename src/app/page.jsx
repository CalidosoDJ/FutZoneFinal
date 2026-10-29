"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import NavBar from "@/app/components/publico/NavBar";
import ContenidoPrincipal from "@/app/components/publico/ContenidoPrincipal";
import ComoFunciona from "@/app/components/publico/como_funciona";
import Footer from "@/app/components/publico/Footer";
import SplashScreen from "./components/publico/SplashScreen";

function ContenidoHome() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const omitirSplash = searchParams.get("omitirSplash") === "true";

  const [splashFinalizado, setSplashFinalizado] = useState(false);

  const mostrarSplash = !omitirSplash && !splashFinalizado;

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
        <SplashScreen onFinish={() => setSplashFinalizado(true)} />
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ContenidoHome />
    </Suspense>
  );
}
