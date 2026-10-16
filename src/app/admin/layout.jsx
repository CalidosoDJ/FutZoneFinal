"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft } from "lucide-react";

import AdminSideBar from "@/app/components/admin/AdminSideBar";
import AdminNavBar from "@/app/components/admin/AdminNavBar";

export default function AdminLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificar si existe la sesión en localStorage
    const usuario = localStorage.getItem("usuarioLogueado");

    if (!usuario) {
      // 2. Redirigir al login y reemplazar la ruta actual en el historial
      router.replace("/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  // Bloquear el renderizado hasta verificar las credenciales
  if (!autorizado) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-gray-950 text-white font-semibold text-lg">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================================= */}
      {/* BOTÓN DEL SIDEBAR OCULTO */}
      {/* ================================= */}

      {!sidebarVisible && (
        <div
          onMouseEnter={() => setSidebarVisible(true)}
          className="
            fixed
            left-0
            top-1/2
            -translate-y-1/2
            z-50
            w-9
            h-16
            bg-gray-950
            rounded-r-2xl
            shadow-lg
            flex
            items-center
            justify-center
            cursor-pointer
            hover:w-11
            transition-all
            duration-300
          "
        >
          <PanelLeft size={20} className="text-green-500" />
        </div>
      )}

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <div
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
        className={`
          fixed
          left-0
          top-0
          h-screen
          z-40
          overflow-y-auto
          transition-transform
          duration-300
          ease-in-out
          ${sidebarVisible ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AdminSideBar />
      </div>

      {/* ================================= */}
      {/* CONTENIDO */}
      {/* ================================= */}

      <div
        className={`
          min-h-screen
          flex
          flex-col
          transition-all
          duration-300
          ease-in-out
          ${sidebarVisible ? "ml-65" : "ml-0"}
        `}
      >
        <AdminNavBar />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}