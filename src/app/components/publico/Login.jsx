"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, House } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function LoginComponent() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const redirigirPorRol = (usuario) => {
    const idRol = Number(
      typeof usuario.id_rol === "object"
        ? (usuario.id_rol?.id_rol ?? usuario.id_rol?.id)
        : usuario.id_rol,
    );

    switch (idRol) {
      case 1:
        router.replace("/admin");
        break;
      case 3:
        router.replace("/arbitro/dashboard");
        break;
      case 2:
        router.replace("/dashboard");
        break;
      default:
        alert("El usuario no tiene un rol válido.");
    }
  };

  useEffect(() => {
    const sesion = localStorage.getItem("usuarioLogueado");

    if (!sesion) return;

    try {
      const usuario = JSON.parse(sesion);

      if (usuario?.id_usuario && usuario?.id_rol) {
        redirigirPorRol(usuario);
      } else {
        localStorage.removeItem("usuarioLogueado");
      }
    } catch {
      localStorage.removeItem("usuarioLogueado");
    }
    // La redirección se realiza al montar el componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (cargando) return;

    const correoIngresado = correo.trim().toLowerCase();

    if (!correoIngresado || !password) {
      alert("Ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: correoIngresado,
          password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        const errores = datos.non_field_errors;

        alert(
          errores?.[0] || datos.detail || "Correo o contraseña incorrectos.",
        );
        return;
      }

      if (!datos.usuario) {
        alert("El servidor no devolvió los datos del usuario.");
        return;
      }

      const usuario = datos.usuario;

      const idRol = Number(
        typeof usuario.id_rol === "object"
          ? (usuario.id_rol?.id_rol ?? usuario.id_rol?.id)
          : usuario.id_rol,
      );

      if (![1, 2, 3].includes(idRol)) {
        alert("El usuario no tiene un rol válido.");
        return;
      }

      const usuarioSesion = {
        ...usuario,
        id_rol: idRol,
        rol: idRol === 1 ? "admin" : idRol === 3 ? "arbitro" : "jugador",
      };

      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSesion));

      if (idRol === 3) {
        localStorage.setItem("arbitroSesion", JSON.stringify(usuarioSesion));
      } else {
        localStorage.removeItem("arbitroSesion");
      }

      redirigirPorRol(usuarioSesion);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert(
        "No fue posible conectar con el servidor Django. Verifica que esté funcionando.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="min-h-screen flex bg-black">
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-8 py-8">
        <form onSubmit={iniciarSesion} className="w-full max-w-lg">
          <Link
            href="/?omitirSplash=true"
            aria-label="Volver al inicio"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
          >
            <House size={22} />
            <span className="text-sm font-semibold">Volver al inicio</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Fut<span className="text-green-500">Zone</span>
            </h1>

            <p className="text-black text-xl">Inicia sesión para continuar</p>
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
            <label
              htmlFor="password"
              className="text-black block mb-2 font-medium"
            >
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
                aria-label={
                  mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-4 text-gray-700 hover:text-black cursor-pointer p-1"
              >
                {mostrarPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 transition text-white p-4 rounded-2xl text-lg font-semibold disabled:cursor-not-allowed"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="text-gray-500 mt-6 text-center">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>

      <div
        className="hidden lg:flex lg:w-[60%] bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/login3.avif')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

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
