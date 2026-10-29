

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { House } from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const sesion = localStorage.getItem("usuarioLogueado");
    const sesionArbitro = localStorage.getItem("arbitroSesion");

    if (sesion) {
      const usuarioActivo = JSON.parse(sesion);

      if (usuarioActivo.rol === "admin") {
        router.replace("/admin");
      } else if (usuarioActivo.rol === "arbitro") {
        router.replace("/arbitro/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } else if (sesionArbitro) {
      router.replace("/arbitro/dashboard");
    }
  }, [router]);

  const registrarUsuario = (e) => {
    e.preventDefault();

    const correoNormalizado = correo.trim().toLowerCase();
    const nombreNormalizado = nombre.trim();
    const usuarioNormalizado = usuario.trim();
    const celularNormalizado = celular.trim();

    if (!nombreNormalizado || !usuarioNormalizado || !correoNormalizado) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuariosArbitro = JSON.parse(
      localStorage.getItem("usuariosArbitro") || "[]"
    );

    // Validar duplicados en ambos tipos de cuentas
    const cuentas = [...usuarios, ...usuariosArbitro];

    const existeCorreo = cuentas.some(
      (u) => u.correo?.trim().toLowerCase() === correoNormalizado
    );

    const admin = JSON.parse(localStorage.getItem("admin") || "null");

    if (
      existeCorreo ||
      admin?.correo?.trim().toLowerCase() === correoNormalizado
    ) {
      alert("Este correo ya está registrado");
      return;
    }

    const existeUsuario = cuentas.some(
      (u) =>
        u.usuario?.trim().toLowerCase() === usuarioNormalizado.toLowerCase()
    );

    if (
      existeUsuario ||
      admin?.usuario?.trim().toLowerCase() === usuarioNormalizado.toLowerCase()
    ) {
      alert("Este nombre de usuario ya existe");
      return;
    }

    // Mantener la identificación de árbitros de Duperly
    const esArbitro = correoNormalizado.endsWith("@futzone.com");

    const nuevaCuenta = {
      id: Date.now(),
      nombre: nombreNormalizado,
      usuario: usuarioNormalizado,
      celular: celularNormalizado,
      correo: correoNormalizado,
      password,
      rol: esArbitro ? "arbitro" : "usuario",
    };

    if (esArbitro) {
      usuariosArbitro.push(nuevaCuenta);
      localStorage.setItem(
        "usuariosArbitro",
        JSON.stringify(usuariosArbitro)
      );

      alert("Árbitro registrado correctamente. Inicia sesión.");
    } else {
      usuarios.push(nuevaCuenta);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert("Usuario registrado correctamente. Inicia sesión.");
    }

    router.push("/login");
  };

  const estiloInput =
    "w-full p-2.5 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200";

  return (
    <section className="min-h-screen lg:h-screen w-full flex bg-black">
      {/* FORMULARIO */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-6 py-6 lg:h-full lg:overflow-y-auto">
        <form
          onSubmit={registrarUsuario}
          className="w-full max-w-md my-auto flex flex-col justify-center"
        >
          {/* VOLVER A LA PÁGINA PRINCIPAL */}
          <Link
            href="/?omitirSplash=true"
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="inline-flex items-center gap-2 self-start text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <House size={22} />
            <span className="text-sm font-semibold">
              Volver al inicio
            </span>
          </Link>

          <div className="mb-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Fut<span className="text-green-600">Zone</span>
            </h1>

            <p className="text-gray-700 mt-0.5 text-base font-medium">
              Únete a la comunidad futbolera
            </p>
          </div>

          {/* CAMPOS */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Ingrese su Nombre Completo"
              aria-label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={estiloInput}
              required
            />

            <input
              type="text"
              placeholder="Ingrese su Nombre de Usuario"
              aria-label="Nombre de usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={estiloInput}
              required
            />

            <input
              type="email"
              placeholder="Ingrese su Correo electrónico"
              aria-label="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={estiloInput}
              required
            />

            <input
              type="tel"
              placeholder="Número Celular"
              aria-label="Número celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className={estiloInput}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={estiloInput}
              required
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              aria-label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={estiloInput}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl font-semibold transition text-sm cursor-pointer"
          >
            Registrarse
          </button>

          {/* REDES SOCIALES */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-black"></div>
            <span className="px-3 text-black text-xs font-medium">
              o continúa con
            </span>
            <div className="flex-1 border-t border-black"></div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              aria-label="Facebook"
              className="flex justify-center items-center p-2.5 border rounded-xl bg-blue-700 hover:bg-blue-600 text-white"
            >
              <FaFacebook size={18} />
            </button>

            <button
              type="button"
              aria-label="Google"
              className="flex justify-center items-center p-2.5 border bg-gray-300 rounded-xl hover:bg-gray-400"
            >
              <FcGoogle size={18} />
            </button>

            <button
              type="button"
              aria-label="Twitter"
              className="flex justify-center items-center p-2.5 border bg-black rounded-xl hover:bg-gray-800 text-white"
            >
              <FaTwitter size={18} />
            </button>
          </div>

          <p className="text-center text-gray-500 mt-3 text-xs">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-green-600 font-semibold cursor-pointer hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </form>
      </div>

      {/* IMAGEN */}
      <div
        className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative h-full items-end"
        style={{
          backgroundImage: "url('/images/registrarse.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col p-12 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            Únete a la comunidad FutZone
          </h2>

          <p className="text-base text-gray-300 max-w-xl">
            Crea tu cuenta y administra reservas, partidos y torneos desde
            una sola plataforma.
          </p>
        </div>
      </div>
    </section>
  );
}
