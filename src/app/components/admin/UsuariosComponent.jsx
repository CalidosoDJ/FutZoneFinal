"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaCalendarCheck,
  FaUserCheck,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUserShield,
  FaUserCheck as FaUserIcon,
  FaWhistle,
} from "react-icons/fa";
import { UserPlus, User, ShieldCheck, Award, Lock, Mail, Phone, X } from "lucide-react";

const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";

const formularioInicial = {
  nombre_completo: "",
  username: "",
  email: "",
  telefono: "",
  password: "",
  id_rol: 2, // 1: Admin, 2: Jugador, 3: Árbitro
};

export default function UsuariosComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError("");

    try {
      const [respuestaUsuarios, respuestaReservas] = await Promise.all([
        fetch(API_USUARIOS),
        fetch(API_RESERVAS),
      ]);

      if (!respuestaUsuarios.ok) {
        throw new Error("No se pudieron cargar los usuarios.");
      }

      const datosUsuarios = await respuestaUsuarios.json();
      const datosReservas = respuestaReservas.ok
        ? await respuestaReservas.json()
        : [];

      setUsuarios(
        Array.isArray(datosUsuarios)
          ? datosUsuarios
          : datosUsuarios.results || []
      );

      setReservas(
        Array.isArray(datosReservas)
          ? datosReservas
          : datosReservas.results || []
      );
    } catch (err) {
      console.error("Error cargando gestión de usuarios:", err);
      setError(
        "No fue posible conectar con Django. Verifica que el backend esté ejecutándose."
      );
    } finally {
      setCargando(false);
    }
  }

  function cambiarCampo(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: name === "id_rol" ? Number(value) : value,
    }));
  }

  function abrirCrear() {
    setFormulario(formularioInicial);
    setEditando(false);
    setUsuarioSeleccionado(null);
    setError("");
    setMostrarModal(true);
  }

  function abrirEditar(usuario) {
    setFormulario({
      nombre_completo: usuario.nombre_completo || "",
      username: usuario.username || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      password: "",
      id_rol: Number(usuario.id_rol?.id_rol ?? usuario.id_rol ?? 2),
    });

    setUsuarioSeleccionado(usuario);
    setEditando(true);
    setError("");
    setMostrarModal(true);
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      let url = "";
      let metodo = "";

      if (editando) {
        url = `${API_USUARIOS}${usuarioSeleccionado.id_usuario}/`;
        metodo = "PATCH";
      } else {
        // Usa la ruta interna de Next.js configurada en src/app/api/admin/crear-usuario/route.js
        url = "/api/admin/crear-usuario";
        metodo = "POST";
      }

      const datos = {
        ...formulario,
        id_rol: Number(formulario.id_rol)
      };

      if (editando && !datos.password) {
        delete datos.password;
      }

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(resultado.message || resultado.detail || "No se pudo guardar el usuario.");
      }

      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarUsuario(usuario) {
    const id = usuario.id_usuario;

    if (!id) {
      setError("No se encontró el identificador del usuario.");
      return;
    }

    if (
      !confirm(
        `¿Seguro que deseas eliminar a ${usuario.nombre_completo || usuario.username
        }?`
      )
    ) {
      return;
    }

    setError("");

    try {
      const respuesta = await fetch(`${API_USUARIOS}${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const resultado = await respuesta.json().catch(() => ({}));
        throw new Error(
          resultado.detail || "No se pudo eliminar el usuario."
        );
      }

      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar el usuario.");
    }
  }

  function contarReservas(idUsuario) {
    return reservas.filter((reserva) => {
      const idReserva =
        reserva.id_usuario?.id_usuario ?? reserva.id_usuario;

      return Number(idReserva) === Number(idUsuario);
    }).length;
  }

  function obtenerEtiquetaRol(idRol) {
    const rol = Number(idRol?.id_rol ?? idRol);
    if (rol === 1)
      return {
        texto: "Administrador",
        clase: "bg-purple-100 text-purple-700 border-purple-200",
      };
    if (rol === 3)
      return {
        texto: "Árbitro",
        clase: "bg-amber-100 text-amber-700 border-amber-200",
      };
    return {
      texto: "Jugador",
      clase: "bg-blue-100 text-blue-700 border-blue-200",
    };
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busqueda.toLowerCase();

    return (
      (usuario.nombre_completo || "").toLowerCase().includes(texto) ||
      (usuario.username || "").toLowerCase().includes(texto) ||
      (usuario.email || "").toLowerCase().includes(texto) ||
      (usuario.telefono || "").toLowerCase().includes(texto)
    );
  });

  const totalReservas = reservas.length;
  const usuariosActivos = usuarios.filter(
    (usuario) =>
      usuario.estado === true ||
      usuario.estado === "Activo" ||
      usuario.estado === "activo" ||
      usuario.estado === 1
  ).length;

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra administradores, jugadores y árbitros registrados en FutZone.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 shadow-md shadow-green-600/20 cursor-pointer"
        >
          <FaPlus /> Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TARJETAS INFORMATIVAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Usuarios registrados</span>
            <FaUsers className="text-2xl text-blue-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{usuarios.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Usuarios activos</span>
            <FaUserCheck className="text-2xl text-green-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{usuariosActivos}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Reservas registradas</span>
            <FaCalendarCheck className="text-2xl text-purple-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{totalReservas}</p>
        </div>
      </div>

      {/* TABLA Y BÚSQUEDA */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="relative mb-5">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, usuario, correo o teléfono..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-green-500 transition text-sm"
          />
        </div>

        {cargando ? (
          <p className="py-10 text-center text-gray-500">Cargando usuarios...</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No se encontraron usuarios.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Reservas</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario) => {
                  const rolBadge = obtenerEtiquetaRol(usuario.id_rol);
                  return (
                    <tr
                      key={usuario.id_usuario}
                      className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <p className="font-semibold text-gray-900">
                          {usuario.nombre_completo || "Sin nombre"}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{usuario.username || "sin_usuario"}
                        </p>
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${rolBadge.clase}`}
                        >
                          {rolBadge.texto}
                        </span>
                      </td>

                      <td className="p-3">{usuario.email || "Sin correo"}</td>
                      <td className="p-3">{usuario.telefono || "Sin teléfono"}</td>
                      <td className="p-3 font-semibold">{contarReservas(usuario.id_usuario)}</td>

                      <td className="p-3">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {usuario.estado === false ||
                            usuario.estado === "Inactivo" ||
                            usuario.estado === "inactivo"
                            ? "Inactivo"
                            : "Activo"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            title="Ver detalles"
                            onClick={() => {
                              setUsuarioSeleccionado(usuario);
                              setMostrarDetalle(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEye size={16} />
                          </button>

                          <button
                            title="Editar usuario"
                            onClick={() => abrirEditar(usuario)}
                            className="text-amber-600 hover:text-amber-800 transition"
                          >
                            <FaEdit size={16} />
                          </button>

                          <button
                            title="Eliminar usuario"
                            onClick={() => eliminarUsuario(usuario)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🌟 MODAL BLANCO 100% RESPONSIVO Y LIMPIO (SIN CATEGORÍA ÁRBITRO) */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-gray-200 p-6 md:p-7 shadow-2xl flex flex-col max-h-[90vh]">

            {/* HEADER FIJO DEL MODAL */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 border border-green-200 rounded-2xl text-green-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900">
                    {editando ? "Editar usuario" : "Registrar nuevo usuario"}
                  </h2>
                  <p className="text-[11px] md:text-xs text-gray-500 font-medium">
                    Configura el rol y las credenciales de acceso
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMostrarModal(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* CUERPO DEL FORMULARIO CON SCROLL AUTONOMO SI SE SOBREPASA */}
            <form onSubmit={guardarUsuario} className="space-y-4 overflow-y-auto pr-1 flex-1">

              {/* SELECTOR DE ROL INTERACTIVO Y RESPONSIVO */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Selecciona el Rol
                </label>

                <div className="grid grid-cols-3 gap-2.5 m-1">
                  {[
                    { id: 1, label: "Admin", desc: "ID 1", icon: ShieldCheck },
                    { id: 2, label: "Jugador", desc: "ID 2", icon: User },
                    { id: 3, label: "Árbitro", desc: "ID 3", icon: Award },
                  ].map((rol) => {
                    const IconoRol = rol.icon;
                    const seleccionado = Number(formulario.id_rol) === rol.id;

                    return (
                      <button
                        key={rol.id}
                        type="button"
                        onClick={() => setFormulario({ ...formulario, id_rol: rol.id })}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${seleccionado
                          ? "bg-green-50 border-green-600 text-green-700 shadow-sm scale-[1.02] ring-2 ring-green-600/20"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                      >
                        <IconoRol size={20} className={seleccionado ? "text-green-600" : "text-gray-500"} />
                        <span className="font-extrabold text-xs mt-1.5">{rol.label}</span>
                        <span className="text-[10px] opacity-75 font-semibold">{rol.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CAMPOS NOMBRE & USERNAME */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      name="nombre_completo"
                      placeholder="Ej. Juan Pérez"
                      value={formulario.nombre_completo}
                      onChange={cambiarCampo}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">@</span>
                    <input
                      required
                      name="username"
                      placeholder="juanperez"
                      value={formulario.username}
                      onChange={cambiarCampo}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-8 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* CAMPOS CORREO & TELÉFONO */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formulario.email}
                      onChange={cambiarCampo}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="telefono"
                      placeholder="3101234567"
                      value={formulario.telefono}
                      onChange={cambiarCampo}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* CAMPO CONTRASEÑA */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  {editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required={!editando}
                    type="password"
                    name="password"
                    placeholder={editando ? "Dejar en blanco para conservar" : "••••••••"}
                    value={formulario.password}
                    onChange={cambiarCampo}
                    className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* BOTONES DE ACCIÓN FIJOS EN LA PARTE INFERIOR */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-2xl bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-green-600/20 hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
                >
                  {guardando
                    ? "Guardando..."
                    : editando
                      ? "Guardar cambios"
                      : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLES */}
      {mostrarDetalle && usuarioSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="mb-5 flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">Detalles del usuario</h2>
              <button
                onClick={() => setMostrarDetalle(false)}
                className="text-gray-400 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre_completo || "No disponible"}</p>
              <p><strong>Usuario:</strong> @{usuarioSeleccionado.username || "No disponible"}</p>
              <p><strong>Rol:</strong> {obtenerEtiquetaRol(usuarioSeleccionado.id_rol).texto}</p>
              <p><strong>Correo:</strong> {usuarioSeleccionado.email || "No disponible"}</p>
              <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono || "No disponible"}</p>
              <p><strong>Reservas realizadas:</strong> {contarReservas(usuarioSeleccionado.id_usuario)}</p>
              <p><strong>ID Usuario:</strong> {usuarioSeleccionado.id_usuario}</p>
            </div>

            <button
              onClick={() => setMostrarDetalle(false)}
              className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-bold text-white hover:bg-black transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}