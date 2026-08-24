"use client";

import { usePathname } from "next/navigation";
import DashboardNavbar from "../usuario/DashboardNavBar";


export default function NavBarWrapper() {
    const pathname = usePathname();

    const rutasOcultas = [
        "/",
        "/login",
      
        "/register",
    ];

    if (rutasOcultas.includes(pathname)) {
        return null;
    }

    return <DashboardNavbar />;
}