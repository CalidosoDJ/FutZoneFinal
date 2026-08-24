"use client";

import { useState } from "react";

import NavBar from "@/app/components/publico/NavBar";
import ContenidoPrincipal from "@/app/components/publico/ContenidoPrincipal";
import Footer from "@/app/components/publico/Footer";
import SplashScreen from "./components/publico/SplashScreen";

export default function Home() {


    const [mostrarSplash, setMostrarSplash] = useState(true);

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

