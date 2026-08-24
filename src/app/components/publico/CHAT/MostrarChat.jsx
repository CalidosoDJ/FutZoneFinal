"use client";

import { usePathname } from "next/navigation";
import ChatButton from "./ChatButton";


export default function MostrarChat() {
    const pathname = usePathname();

    const rutasOcultas = [
        "/",
        "/login",
      
        "/register",
    ];

    if (rutasOcultas.includes(pathname)) {
        return null;
    }

    return <ChatButton />;
}