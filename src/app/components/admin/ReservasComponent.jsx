
"use client";

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import ReservaModal from "./ReservaModal";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";

const formularioInicial = {
  id_usuario: "",
  id_cancha: "",
  fecha_reserva: "",
  hora_inicio: "",
  hora_fin: "",
};

export default function ReservasComponent() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError("");

    try {
      const [resReservas, resUsuarios, resCanchas] = await Promise.all([
        fetch(API_RESERVAS),
        fetch(API_USUARIOS),
        fetch(API_CANCHAS),
      ]);

      if (!resReservas.ok) {
        throw new Error("No se pudieron cargar las reservas.");
      }

      const datosReservas = await resReservas.json();
      const datosUsuarios = resUsuarios.ok
        ? await resUsuarios.json()
        : [];
      const datosCanchas = resCanchas.ok
        ? await resCanchas.json()
        : [];

      setReservas(
        Array.isArray(datosReservas)
          ? datosReservas
          : datosReservas.results || []
      );

      setUsuarios(
        Array.isArray(datosUsuarios)
          ? datosUsuarios
          : datosUsuarios.results || []
      );

      setCanchas(
        Array.isArray(datosCanchas)
          ? datosCanchas
          : datosCanchas.results || []
      );
    } catch (err) {
      console.error("Error cargando reservas:", err);
      setError(
        "No se pudieron cargar las reservas. Comprueba que Django esté funcionando y que las rutas de la API sean correctas."
      );
    } finally {
      setCargando(false);
    }
  }

  function obtenerId(valor, campoId) {
    if (valor && typeof valor === "object") {
      return valor[campoId] ?? "";
    }

    return valor ?? "";
  }

  function obtenerNombreUsuario(reserva) {
    const usuario =
      reserva.id_usuario ?? reserva.usuario;

    if (usuario && typeof usuario === "object") {
      return (
        usuario.nombre_completo ||
        usuario.username ||
        usuario.nombre ||
        "Usuario"
      );
    }

    const encontrado = usuarios.find(
      (u) => Number(u.id_usuario) === Number(usuario)
    );

    return encontrado
      ? encontrado.nombre_completo || encontrado.username
      : "Usuario";
  }

  function obtenerNombreCancha(reserva) {
    const cancha = reserva.id_cancha ?? reserva.cancha;

    if (cancha && typeof cancha === "object") {
      return cancha.nombre || cancha.nombre_cancha || "Cancha";
    }

    const encontrada = canchas.find(
      (c) => Number(c.id_cancha ?? c.id) === Number(cancha)
    );

    return encontrada
      ? encontrada.nombre || encontrada.nombre_cancha
      : "Cancha";
  }

  function obtenerFecha(reserva) {
    return reserva.fecha_reserva || reserva.fecha || "";
  }

  function obtenerHora(reserva) {
    return String(reserva.hora_inicio || reserva.hora || "").slice(0, 5);
  }

  function obtenerHoraFin(reserva) {
    return String(reserva.hora_fin || "").slice(0, 5);
  }

  function obtenerTotal(reserva) {
    return Number(
      reserva.total ??
      reserva.precio_total ??
      reserva.precio ??
      0
    );
  }

  function obtenerIdReserva(reserva) {
    return reserva.id_reserva ?? reserva.id;
  }

  function abrirCrear() {
    setFormulario(formularioInicial);
    setEditando(false);
    setReservaSeleccionada(null);
    setError("");
    setMostrarModal(true);
  }

  function abrirEditar(reserva) {
    setFormulario({
      id_usuario: obtenerId(
        reserva.id_usuario ?? reserva.usuario,
        "id_usuario"
      ),
      id_cancha: obtenerId(
        reserva.id_cancha ?? reserva.cancha,
        "id_cancha"
      ),
      fecha_reserva: obtenerFecha(reserva),
      hora_inicio: obtenerHora(reserva),
      hora_fin: obtenerHoraFin(reserva),
    });

    setReservaSeleccionada(reserva);
    setEditando(true);
    setError("");
    setMostrarModal(true);
  }

  async function guardarReserva(e) {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    if (
      !formulario.id_usuario ||
      !formulario.id_cancha ||
      !formulario.fecha_reserva ||
      !formulario.hora_inicio ||
      !formulario.hora_fin
    ) {
      setError("Completa el usuario, la cancha, la fecha y los horarios.");
      return;
    }

    if (formulario.hora_fin <= formulario.hora_inicio) {
      setError("La hora de finalización debe ser posterior a la hora de inicio.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const url = editando
        ? `${API_RESERVAS}${obtenerIdReserva(reservaSeleccionada)}/`
        : API_RESERVAS;

      const respuesta = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: Number(formulario.id_usuario),
          id_cancha: Number(formulario.id_cancha),
          fecha_reserva: formulario.fecha_reserva,
          hora_inicio: formulario.hora_inicio,
          hora_fin: formulario.hora_fin,
        }),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        const detalle = Object.entries(resultado)
          .map(([campo, mensajes]) => {
            const texto = Array.isArray(mensajes)
              ? mensajes.join(", ")
              : typeof mensajes === "object"
                ? JSON.stringify(mensajes)
                : String(mensajes);

            return `${campo}: ${texto}`;
          })
          .join("\n");

        throw new Error(
          detalle || "Django no pudo guardar la reserva."
        );
      }

      setMostrarModal(false);
      setFormulario(formularioInicial);
      setReservaSeleccionada(null);
      setEditando(false);

      await cargarDatos();
    } catch (err) {
      console.error("Error guardando reserva:", err);
      setError(err.message || "Ocurrió un error al guardar la reserva.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarReserva(reserva) {
    const id = obtenerIdReserva(reserva);

    if (!id) {
      setError("No se encontró el identificador de la reserva.");
      return;
    }

    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) {
      return;
    }

    setError("");

    try {
      const respuesta = await fetch(`${API_RESERVAS}${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const resultado = await respuesta.json().catch(() => ({}));
        throw new Error(
          resultado.detail || "No se pudo eliminar la reserva."
        );
      }

      await cargarDatos();
    } catch (err) {
      console.error("Error eliminando reserva:", err);
      setError(err.message || "Error al eliminar la reserva.");
    }
  }

  const reservasFiltradas = reservas.filter((reserva) => {
    const texto = busqueda.toLowerCase();

    return (
      obtenerNombreUsuario(reserva).toLowerCase().includes(texto) ||
      obtenerNombreCancha(reserva).toLowerCase().includes(texto) ||
      obtenerFecha(reserva).toLowerCase().includes(texto) ||
      String(reserva.estado || "").toLowerCase().includes(texto)
    );
  });

  return (
    <div className="space-y-6 text-gray-800">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las reservas registradas en FutZone.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          <FaPlus /> Nueva Reserva
        </button>
      </div>

      {error && (
        <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cliente, cancha, fecha o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border p-3 pl-12 outline-none focus:border-green-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        {cargando ? (
          <p className="py-10 text-center text-gray-500">
            Cargando reservas...
          </p>
        ) : reservasFiltradas.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No hay reservas para mostrar.
          </p>
        ) : (
          <table className="w-full min-w-[850px] text-center text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Cancha</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((reserva) => {
                const id = obtenerIdReserva(reserva);

                return (
                  <tr
                    key={id}
                    className="border-b transition hover:bg-green-50"
                  >
                    <td className="p-4">
                      {obtenerNombreUsuario(reserva)}
                    </td>

                    <td>{obtenerNombreCancha(reserva)}</td>
                    <td>{obtenerFecha(reserva) || "Sin fecha"}</td>
                    <td>
                      {obtenerHora(reserva) || "Sin hora"}
                      {obtenerHoraFin(reserva)
                        ? ` - ${obtenerHoraFin(reserva)}`
                        : ""}
                    </td>

                    <td className="font-bold text-green-600">
                      ${obtenerTotal(reserva).toLocaleString("es-CO")}
                    </td>

                    <td>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {reserva.estado || "Registrada"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          title="Ver detalles"
                          onClick={() => {
                            setReservaSeleccionada(reserva);
                            setMostrarDetalle(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>

                        <button
                          title="Editar reserva"
                          onClick={() => abrirEditar(reserva)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FaEdit />
                        </button>

                        <button
                          title="Eliminar reserva"
                          onClick={() => eliminarReserva(reserva)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ReservaModal
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        formulario={formulario}
        setFormulario={setFormulario}
        guardarReserva={guardarReserva}
        actualizarReserva={guardarReserva}
        editando={editando}
        usuarios={usuarios}
        canchas={canchas}
        guardando={guardando}
      />

      {mostrarDetalle && reservaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Detalle de la reserva</h2>
              <button
                onClick={() => setMostrarDetalle(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Cliente:</strong>{" "}
                {obtenerNombreUsuario(reservaSeleccionada)}
              </p>
              <p>
                <strong>Cancha:</strong>{" "}
                {obtenerNombreCancha(reservaSeleccionada)}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {obtenerFecha(reservaSeleccionada)}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {obtenerHora(reservaSeleccionada)} -{" "}
                {obtenerHoraFin(reservaSeleccionada)}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                ${obtenerTotal(reservaSeleccionada).toLocaleString("es-CO")}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {reservaSeleccionada.estado || "Registrada"}
              </p>
            </div>

            <button
              onClick={() => setMostrarDetalle(false)}
              className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
