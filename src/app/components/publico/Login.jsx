"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginComponent() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  // Crear el administrador inicial si todavía no existe.
  useEffect(() => {
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
  }, []);

  const iniciarSesion = (e) => {
    e.preventDefault();

    const correoIngresado = correo.trim().toLowerCase();
    const passwordIngresada = password;

    // 1. VALIDAR ADMINISTRADOR
    const adminGuardado = localStorage.getItem("admin");
    const admin = adminGuardado ? JSON.parse(adminGuardado) : null;

    if (
      admin &&
      admin.correo?.trim().toLowerCase() === correoIngresado &&
      admin.password === passwordIngresada
    ) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(admin));

      router.push("/admin");
      return;
    }

    // 2. VALIDAR ÁRBITRO REGISTRADO
    const usuariosArbitro = JSON.parse(
      localStorage.getItem("usuariosArbitro") || "[]",
    );

    const arbitroEncontrado = usuariosArbitro.find(
      (arbitro) =>
        arbitro.correo?.trim().toLowerCase() === correoIngresado &&
        arbitro.password === passwordIngresada &&
        arbitro.rol === "arbitro",
    );

    if (arbitroEncontrado) {
      localStorage.setItem(
        "arbitroSesion",
        JSON.stringify(arbitroEncontrado),
      );

      router.push("/arbitro/dashboard");
      return;
    }

    // 3. VALIDAR USUARIO REGISTRADO
    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    );

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.correo?.trim().toLowerCase() === correoIngresado &&
        usuario.password === passwordIngresada,
    );

    if (usuarioEncontrado) {
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(usuarioEncontrado),
      );

      router.push("/dashboard");
      return;
    }

    // 4. SI NO COINCIDE NINGUNA CUENTA
    alert("Correo o contraseña incorrectos");
  };

  return (
    <section className="min-h-screen flex bg-black">
      {/* FORMULARIO */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-8">
        <form onSubmit={iniciarSesion} className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Fut<span className="text-green-500">Zone</span>
            </h1>

            <p className="text-black text-xl">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Correo */}
          <div className="mb-5">
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

          {/* Contraseña */}
          <div className="mb-8">
            <label htmlFor="password" className="text-black block mb-2">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-gray-300 border border-black text-black p-4 rounded-2xl outline-none focus:border-gray-950 transition"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-2xl text-lg font-semibold"
          >
            Iniciar sesión
          </button>

          {/* Registro */}
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

      {/* IMAGEN */}
      <div
        className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/login3.avif')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Texto */}
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