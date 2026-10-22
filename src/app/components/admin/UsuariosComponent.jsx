
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
} from "react-icons/fa";

const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";

const formularioInicial = {
  nombre_completo: "",
  username: "",
  email: "",
  telefono: "",
  password: "",
  id_rol: 2,
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
      const [respuestaUsuarios, respuestaReservas] =
        await Promise.all([
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
      [name]: value,
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
      id_rol: usuario.id_rol?.id_rol ?? usuario.id_rol ?? 2,
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
      const url = editando
        ? `${API_USUARIOS}${usuarioSeleccionado.id_usuario}/`
        : `${API_USUARIOS}registro/`;

      const metodo = editando ? "PATCH" : "POST";
      const datos = { ...formulario };

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
        const detalle = Object.entries(resultado)
          .map(([campo, mensajes]) => {
            const texto = Array.isArray(mensajes)
              ? mensajes.join(", ")
              : String(mensajes);

            return `${campo}: ${texto}`;
          })
          .join("\n");

        throw new Error(
          detalle || "No se pudo guardar el usuario."
        );
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

    if (!confirm(`¿Seguro que deseas eliminar a ${usuario.nombre_completo || usuario.username}?`)) {
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
        reserva.id_usuario?.id_usuario ??
        reserva.id_usuario;

      return Number(idReserva) === Number(idUsuario);
    }).length;
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
          <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los jugadores registrados en FutZone.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <FaPlus /> Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Usuarios registrados</span>
            <FaUsers className="text-2xl text-blue-500" />
          </div>
          <p className="mt-3 text-3xl font-bold">{usuarios.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Usuarios activos</span>
            <FaUserCheck className="text-2xl text-green-500" />
          </div>
          <p className="mt-3 text-3xl font-bold">{usuariosActivos}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Reservas registradas</span>
            <FaCalendarCheck className="text-2xl text-purple-500" />
          </div>
          <p className="mt-3 text-3xl font-bold">{totalReservas}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="relative mb-5">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, usuario, correo o teléfono..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-green-500"
          />
        </div>

        {cargando ? (
          <p className="py-10 text-center text-gray-500">
            Cargando usuarios...
          </p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No se encontraron usuarios.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Reservas</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr
                    key={usuario.id_usuario}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <p className="font-semibold">
                        {usuario.nombre_completo || "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{usuario.username || "sin_usuario"}
                      </p>
                    </td>

                    <td className="p-3">{usuario.email || "Sin correo"}</td>
                    <td className="p-3">{usuario.telefono || "Sin teléfono"}</td>
                    <td className="p-3">{contarReservas(usuario.id_usuario)}</td>

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
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>

                        <button
                          title="Editar usuario"
                          onClick={() => abrirEditar(usuario)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <FaEdit />
                        </button>

                        <button
                          title="Eliminar usuario"
                          onClick={() => eliminarUsuario(usuario)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editando ? "Editar usuario" : "Registrar usuario"}
              </h2>

              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={guardarUsuario} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre completo</label>
                <input
                  required
                  name="nombre_completo"
                  value={formulario.nombre_completo}
                  onChange={cambiarCampo}
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Nombre de usuario</label>
                <input
                  required
                  name="username"
                  value={formulario.username}
                  onChange={cambiarCampo}
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Correo electrónico</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={cambiarCampo}
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Teléfono</label>
                <input
                  name="telefono"
                  value={formulario.telefono}
                  onChange={cambiarCampo}
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  {editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                </label>
                <input
                  required={!editando}
                  type="password"
                  name="password"
                  value={formulario.password}
                  onChange={cambiarCampo}
                  className="w-full rounded-lg border p-3 outline-none focus:border-green-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : editando
                    ? "Guardar cambios"
                    : "Registrar usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarDetalle && usuarioSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Detalles del usuario</h2>
              <button
                onClick={() => setMostrarDetalle(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre_completo || "No disponible"}</p>
              <p><strong>Usuario:</strong> {usuarioSeleccionado.username || "No disponible"}</p>
              <p><strong>Correo:</strong> {usuarioSeleccionado.email || "No disponible"}</p>
              <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono || "No disponible"}</p>
              <p><strong>Reservas:</strong> {contarReservas(usuarioSeleccionado.id_usuario)}</p>
              <p><strong>ID:</strong> {usuarioSeleccionado.id_usuario}</p>
            </div>

            <button
              onClick={() => setMostrarDetalle(false)}
              className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
