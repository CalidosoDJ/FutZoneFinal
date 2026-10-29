
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, House } from "lucide-react";
import Link from "next/link";

export default function LoginComponent() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    const sesion = localStorage.getItem("usuarioLogueado");
    const sesionArbitro = localStorage.getItem("arbitroSesion");

    if (sesion) {
      const usuario = JSON.parse(sesion);

      if (usuario.rol === "admin") {
        router.replace("/admin");
      } else if (usuario.rol === "arbitro") {
        router.replace("/arbitro/dashboard");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    if (sesionArbitro) {
      router.replace("/arbitro/dashboard");
      return;
    }

    const adminExiste = localStorage.getItem("admin");

    if (!adminExiste) {
      const admin = {
        nombre: "Administrador",
        usuario: "admin",
        celular: "3106021273",
        correo: "admin@futzone.com",
        password: "admin123",
        rol: "admin",
      };

      localStorage.setItem("admin", JSON.stringify(admin));
    }
  }, [router]);

  const iniciarSesion = (e) => {
    e.preventDefault();

    const correoIngresado = correo.trim().toLowerCase();

    // ADMINISTRADOR
    const admin = JSON.parse(localStorage.getItem("admin") || "null");

    if (
      admin &&
      admin.correo?.trim().toLowerCase() === correoIngresado &&
      admin.password === password
    ) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(admin));
      router.replace("/admin");
      return;
    }

    // ÁRBITROS REGISTRADOS
    const usuariosArbitro = JSON.parse(
      localStorage.getItem("usuariosArbitro") || "[]"
    );

    const arbitroEncontrado = usuariosArbitro.find(
      (arbitro) =>
        arbitro.correo?.trim().toLowerCase() === correoIngresado &&
        arbitro.password === password &&
        arbitro.rol === "arbitro"
    );

    if (arbitroEncontrado) {
      localStorage.setItem("arbitroSesion", JSON.stringify(arbitroEncontrado));
      localStorage.setItem("usuarioLogueado", JSON.stringify(arbitroEncontrado));
      router.replace("/arbitro/dashboard");
      return;
    }

    // ÁRBITRO DE PRUEBA (MAIN)
    if (correoIngresado === "arbitro@futzone.com" && password === "123") {
      const arbitro = {
        nombre: "Árbitro FutZone",
        correo: "arbitro@futzone.com",
        rol: "arbitro",
      };

      localStorage.setItem("arbitroSesion", JSON.stringify(arbitro));
      localStorage.setItem("usuarioLogueado", JSON.stringify(arbitro));
      router.replace("/arbitro/dashboard");
      return;
    }

    // USUARIOS REGISTRADOS
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.correo?.trim().toLowerCase() === correoIngresado &&
        usuario.password === password
    );

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
      router.replace("/dashboard");
      return;
    }

    alert("Correo o contraseña incorrectos");
  };

  return (
    <section className="min-h-screen flex bg-black">
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-8 py-8">
        <form onSubmit={iniciarSesion} className="w-full max-w-lg">

          {/* VOLVER AL HOME */}
          <Link
            href="/?omitirSplash=true"
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
          >
            <House size={22} />
            <span className="text-sm font-semibold">
              Volver al inicio
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Fut<span className="text-green-500">Zone</span>
            </h1>
            <p className="text-black text-xl">
              Inicia sesión para continuar
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="correo" className="text-black block mb-2">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
              required
              className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="text-black block mb-2 font-medium">
              Contraseña
            </label>

            <div className="relative flex items-center">
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-gray-300 border border-black text-black p-4 pr-12 rounded-2xl outline-none focus:border-gray-950 transition"
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-4 text-gray-700 hover:text-black cursor-pointer p-1"
              >
                {mostrarPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-2xl text-lg font-semibold"
          >
            Iniciar sesión
          </button>

          <p className="text-gray-500 mt-6 text-center">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-green-600 cursor-pointer hover:text-green-700 font-semibold"
            >
              Regístrate
            </button>
          </p>
        </form>
      </div>

      <div
        className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/login3.avif')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h2 className="text-6xl font-bold mb-5 leading-tight">
            Vive la pasión del fútbol
          </h2>
          <p className="text-xl text-gray-300 max-w-xl">
            Reserva canchas, organiza torneos y disfruta la mejor experiencia
            deportiva con FutZone.
          </p>
        </div>
      </div>
    </section>
  );
}
