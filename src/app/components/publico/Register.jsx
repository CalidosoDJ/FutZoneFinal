"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { House, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function RegisterForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmPassword, setVerConfirmPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const sesion = localStorage.getItem("usuarioLogueado");
    if (!sesion) return;

    try {
      const usuarioActivo = JSON.parse(sesion);
      const rol = Number(usuarioActivo?.id_rol);

      if (rol === 1) router.replace("/admin");
      else if (rol === 3) router.replace("/arbitro/dashboard");
      else if (rol === 2) router.replace("/dashboard");
      else localStorage.removeItem("usuarioLogueado");
    } catch {
      localStorage.removeItem("usuarioLogueado");
    }
  }, [router]);

  const registrarUsuario = async (e) => {
    e.preventDefault();
    if (cargando) return;

    const nombreNormalizado = nombre.trim();
    const usuarioNormalizado = usuario.trim();
    const correoNormalizado = correo.trim().toLowerCase();
    const celularNormalizado = celular.trim();

    if (
      !nombreNormalizado ||
      !usuarioNormalizado ||
      !correoNormalizado ||
      !celularNormalizado ||
      !password ||
      !confirmPassword
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/registro/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_completo: nombreNormalizado,
          username: usuarioNormalizado,
          email: correoNormalizado,
          password,
          telefono: celularNormalizado,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        if (datos.email) {
          alert("Este correo ya está registrado o no es válido.");
        } else if (datos.username) {
          alert("Este nombre de usuario ya existe o no es válido.");
        } else if (datos.password) {
          alert(
            Array.isArray(datos.password)
              ? datos.password.join(" ")
              : String(datos.password),
          );
        } else {
          alert(
            datos.non_field_errors?.[0] ||
              datos.detail ||
              "No se pudo registrar el usuario.",
          );
        }
        return;
      }

      alert("Usuario registrado correctamente. Inicia sesión.");
      router.push("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("No se pudo conectar con el servidor Django.");
    } finally {
      setCargando(false);
    }
  };

  const estiloInput =
    "w-full p-2.5 text-sm rounded-xl border border-black focus:outline-none focus:border-gray-500 text-black bg-gray-200";

  return (
    <section className="min-h-screen lg:h-screen w-full flex bg-black">
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-6 py-6 lg:h-full lg:overflow-y-auto">
        <form
          onSubmit={registrarUsuario}
          className="w-full max-w-md my-auto flex flex-col justify-center"
        >
          <Link
            href="/?omitirSplash=true"
            aria-label="Volver al inicio"
            className="inline-flex items-center gap-2 self-start text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <House size={22} />
            <span className="text-sm font-semibold">Volver al inicio</span>
          </Link>

          <div className="mb-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Fut<span className="text-green-600">Zone</span>
            </h1>
            <p className="text-gray-700 mt-0.5 text-base font-medium">
              Únete a la comunidad futbolera
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Ingrese su Nombre Completo"
              aria-label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              className={estiloInput}
              required
            />

            <input
              type="text"
              placeholder="Ingrese su Nombre de Usuario"
              aria-label="Nombre de usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              className={estiloInput}
              required
            />

            <input
              type="email"
              placeholder="Ingrese su Correo electrónico"
              aria-label="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
              className={estiloInput}
              required
            />

            <input
              type="tel"
              placeholder="Número Celular"
              aria-label="Número celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              autoComplete="tel"
              className={estiloInput}
              required
            />

            <div className="relative flex items-center">
              <input
                type={verPassword ? "text" : "password"}
                placeholder="Contraseña"
                aria-label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={`${estiloInput} pr-11`}
                required
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                aria-label={
                  verPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-3 text-gray-700 cursor-pointer"
              >
                {verPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type={verConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                aria-label="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`${estiloInput} pr-11`}
                required
              />
              <button
                type="button"
                onClick={() => setVerConfirmPassword(!verConfirmPassword)}
                aria-label={
                  verConfirmPassword
                    ? "Ocultar confirmación"
                    : "Mostrar confirmación"
                }
                className="absolute right-3 text-gray-700 cursor-pointer"
              >
                {verConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white p-2.5 rounded-xl font-semibold transition text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {cargando ? "Registrando..." : "Registrarse"}
          </button>

          <p className="text-center text-gray-500 mt-4 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      <div
        className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative h-full items-end"
        style={{
          backgroundImage: "url('/images/registrarse.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col p-12 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            Únete a la comunidad FutZone
          </h2>

          <p className="text-base text-gray-300 max-w-xl">
            Crea tu cuenta y administra reservas, partidos y torneos desde una
            sola plataforma.
          </p>
        </div>
      </div>
    </section>
  );
}
