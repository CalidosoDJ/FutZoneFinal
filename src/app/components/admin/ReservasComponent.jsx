
"use client";

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaMoneyBillWave,
  FaCheck,
  FaBan,
} from "react-icons/fa";

import ReservaModal from "./ReservaModal";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";
const API_PAGOS = "http://127.0.0.1:8000/api/pagos/";

const formularioInicial = {
  id_usuario: "",
  id_cancha: "",
  fecha_reserva: "",
  hora_inicio: "",
  hora_fin: "",
};

const estadosReserva = [
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "rechazada", label: "Rechazada" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "no_asistio", label: "No asistió" },
];

export default function ReservasComponent() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [pagos, setPagos] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [reservaPago, setReservaPago] = useState(null);

  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardandoPago, setGuardandoPago] = useState(false);

  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==========================================
  // CARGAR RESERVAS, USUARIOS, CANCHAS Y PAGOS
  // ==========================================

  async function cargarDatos() {
    setCargando(true);
    setError("");

    try {
      const [
        resReservas,
        resUsuarios,
        resCanchas,
        resPagos,
      ] = await Promise.all([
        fetch(API_RESERVAS),
        fetch(API_USUARIOS),
        fetch(API_CANCHAS),
        fetch(API_PAGOS),
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
      const datosPagos = resPagos.ok
        ? await resPagos.json()
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

      setPagos(
        Array.isArray(datosPagos)
          ? datosPagos
          : datosPagos.results || []
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

  // ==========================================
  // FUNCIONES AUXILIARES
  // ==========================================

  function obtenerId(valor, campoId) {
    if (valor && typeof valor === "object") {
      return valor[campoId] ?? "";
    }

    return valor ?? "";
  }

  function obtenerNombreUsuario(reserva) {
    const usuario = reserva.id_usuario ?? reserva.usuario;

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
    return String(
      reserva.hora_inicio || reserva.hora || ""
    ).slice(0, 5);
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

  // ==========================================
  // FUNCIONES DE PAGOS
  // ==========================================

  function obtenerPagoReserva(reserva) {
    const idReserva = Number(obtenerIdReserva(reserva));

    return pagos.find((pago) => {
      const idPago = obtenerId(
        pago.id_reserva ?? pago.reserva,
        "id_reserva"
      );

      return Number(idPago) === idReserva;
    });
  }

  function obtenerEstadoPago(reserva) {
    const pago = obtenerPagoReserva(reserva);

    if (pago?.estado === "Pagado") {
      return "Pagada";
    }

    return "No pagada";
  }
  function obtenerEtiquetaEstado(estado) {
    return (
      estadosReserva.find((e) => e.value === estado)?.label ||
      "Pendiente"
    );
  }

  function obtenerColorEstado(estado) {
    const colores = {
      pendiente: "bg-amber-100 text-amber-700",
      confirmada: "bg-blue-100 text-blue-700",
      rechazada: "bg-red-100 text-red-700",
      en_curso: "bg-purple-100 text-purple-700",
      finalizada: "bg-green-100 text-green-700",
      cancelada: "bg-gray-100 text-gray-700",
      no_asistio: "bg-orange-100 text-orange-700",
    };

    return colores[estado] || "bg-gray-100 text-gray-700";
  }

  // Abrir modal de pago
  function abrirModalPago(reserva) {
    setReservaPago(reserva);
    setMetodoPago("Efectivo");
    setError("");
    setMostrarModalPago(true);
  }

  // Registrar pago
  async function registrarPago(e) {
    e.preventDefault();

    if (!reservaPago) return;

    setGuardandoPago(true);
    setError("");

    try {
      const respuesta = await fetch(API_PAGOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_reserva: Number(obtenerIdReserva(reservaPago)),
          metodo_pago: metodoPago,
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
          detalle || "No se pudo registrar el pago."
        );
      }

      setMostrarModalPago(false);
      setReservaPago(null);

      await cargarDatos();

    } catch (err) {
      console.error("Error registrando pago:", err);
      setError(err.message);
    } finally {
      setGuardandoPago(false);
    }
  }

  // Aprobar o rechazar pago
  async function gestionarPago(pago, accion) {
    const idPago = pago.id_pago ?? pago.id;

    if (!idPago) {
      setError("No se encontró el identificador del pago.");
      return;
    }

    const mensaje =
      accion === "aprobar"
        ? "¿Confirmas que recibiste el pago por Nequi?"
        : "¿Seguro que deseas rechazar este pago?";

    if (!confirm(mensaje)) return;

    setError("");

    try {
      const respuesta = await fetch(
        `${API_PAGOS}${idPago}/${accion}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          resultado.detail ||
          `No se pudo ${accion} el pago.`
        );
      }

      await cargarDatos();

    } catch (err) {
      console.error("Error gestionando pago:", err);
      setError(err.message);
    }
  }

  // ==========================================
  // CAMBIAR ESTADO DE RESERVA
  // ==========================================



  async function cambiarEstadoReserva(reserva, nuevoEstado) {
    const idReserva = obtenerIdReserva(reserva);

    try {
      const respuesta = await fetch(`${API_RESERVAS}${idReserva}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      });

      const textoRespuesta = await respuesta.text();

      console.log("HTTP:", respuesta.status);
      console.log("RESPUESTA DJANGO:", textoRespuesta);

      if (!respuesta.ok) {
        alert(
          `Error HTTP ${respuesta.status}:\n${textoRespuesta}`
        );
        return;
      }

      await cargarDatos();

    } catch (error) {
      console.error("ERROR REAL:", error);
      alert(`Error: ${error.message}`);
    }
  }



  // ==========================================
  // CREAR Y EDITAR RESERVAS
  // ==========================================

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
      setError(
        "Completa el usuario, la cancha, la fecha y los horarios."
      );
      return;
    }

    if (formulario.hora_fin <= formulario.hora_inicio) {
      setError(
        "La hora de finalización debe ser posterior a la hora de inicio."
      );
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
      setError(
        err.message || "Ocurrió un error al guardar la reserva."
      );
    } finally {
      setGuardando(false);
    }
  }

  // ==========================================
  // ELIMINAR RESERVA
  // ==========================================

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

  // ==========================================
  // BUSCADOR
  // ==========================================

  const reservasFiltradas = reservas.filter((reserva) => {
    const texto = busqueda.toLowerCase();

    return (
      obtenerNombreUsuario(reserva).toLowerCase().includes(texto) ||
      obtenerNombreCancha(reserva).toLowerCase().includes(texto) ||
      obtenerFecha(reserva).toLowerCase().includes(texto) ||
      String(reserva.estado || "").toLowerCase().includes(texto) ||
      obtenerEstadoPago(reserva).toLowerCase().includes(texto)
    );
  });

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div className="space-y-6 text-gray-800">

      {/* ENCABEZADO */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Reservas
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Administra las reservas y pagos registrados en FutZone.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          <FaPlus />
          Nueva Reserva
        </button>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BUSCADOR */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar por cliente, cancha, fecha, estado o pago..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border p-3 pl-12 outline-none focus:border-green-500"
        />
      </div>

      {/* TABLA DE RESERVAS */}
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
          <table className="w-full min-w-[1050px] text-sm">

            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-5 py-4 text-left">Cliente</th>
                <th className="px-5 py-4 text-left">Cancha</th>
                <th className="px-5 py-4 text-center">Fecha</th>
                <th className="px-5 py-4 text-center">Horario</th>
                <th className="px-5 py-4 text-center">Total</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-center">Pago</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((reserva) => {
                const id = obtenerIdReserva(reserva);
                const pago = obtenerPagoReserva(reserva);

                return (
                  <tr
                    key={id}
                    className="border-b border-gray-100 transition hover:bg-green-50/60"
                  >

                    {/* CLIENTE */}
                    <td className="p-4">
                      {obtenerNombreUsuario(reserva)}
                    </td>

                    {/* CANCHA */}
                    <td className="p-4">
                      {obtenerNombreCancha(reserva)}
                    </td>

                    {/* FECHA */}
                    <td className="p-4">
                      {obtenerFecha(reserva) || "Sin fecha"}
                    </td>

                    {/* HORARIO */}
                    <td className="p-4">
                      {obtenerHora(reserva) || "Sin hora"}

                      {obtenerHoraFin(reserva)
                        ? ` - ${obtenerHoraFin(reserva)}`
                        : ""}
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-bold text-green-600">
                      ${obtenerTotal(reserva).toLocaleString("es-CO")}
                    </td>

                    {/* ESTADO DE RESERVA */}

                    {/* ESTADO DE RESERVA */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-2">

                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${obtenerColorEstado(reserva.estado)}`}
                        >
                          {obtenerEtiquetaEstado(reserva.estado)}
                        </span>

                        <select
                          value={reserva.estado || "pendiente"}
                          onChange={(e) =>
                            cambiarEstadoReserva(reserva, e.target.value)
                          }
                          className="w-[125px] cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-600 outline-none transition hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          title="Cambiar estado"
                        >
                          {estadosReserva.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>

                      </div>
                    </td>


                    {/* ESTADO DEL PAGO */}

                    {/* PAGO */}
                    <td className="px-4 py-4">
                      <div className="flex min-w-[145px] flex-col items-center gap-2">

                        {/* PAGO PENDIENTE DE APROBACIÓN */}
                        {pago?.estado === "Pendiente" && (
                          <>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                              Pendiente
                            </span>

                            <div className="flex gap-1">
                              <button
                                type="button"
                                title="Aprobar pago"
                                onClick={() => gestionarPago(pago, "aprobar")}
                                className="rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-700"
                              >
                                <FaCheck />
                              </button>

                              <button
                                type="button"
                                title="Rechazar pago"
                                onClick={() => gestionarPago(pago, "rechazar")}
                                className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                              >
                                <FaBan />
                              </button>
                            </div>
                          </>
                        )}

                        {/* PAGO APROBADO */}
                        {pago?.estado === "Pagado" && (
                          <div className="flex flex-col items-center gap-1">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Pagado
                            </span>

                            <span className="text-xs text-gray-500">
                              {pago.metodo_pago}
                            </span>
                          </div>
                        )}

                        {/* SIN PAGO */}
                        {!pago && (
                          <button
                            type="button"
                            onClick={() => abrirModalPago(reserva)}
                            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <FaMoneyBillWave />
                            Registrar
                          </button>
                        )}

                        {/* PAGO RECHAZADO */}
                        {pago?.estado === "Rechazado" && (
                          <div className="flex flex-col items-center gap-2">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Rechazado
                            </span>

                            <button
                              type="button"
                              onClick={() => abrirModalPago(reserva)}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              Reintentar
                            </button>
                          </div>
                        )}

                      </div>
                    </td>


                    {/* ACCIONES */}
                    <td className="p-4">
                      <div className="flex justify-center gap-3">

                        <button
                          type="button"
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
                          type="button"
                          title="Editar reserva"
                          onClick={() => abrirEditar(reserva)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
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

      {/* MODAL CREAR Y EDITAR RESERVA */}
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

      {/* MODAL REGISTRAR PAGO */}
      {mostrarModalPago && reservaPago && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Registrar pago
              </h2>

              <button
                type="button"
                onClick={() => setMostrarModalPago(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-green-50 p-4">

              <p className="text-sm text-gray-600">
                Cliente
              </p>

              <p className="font-semibold">
                {obtenerNombreUsuario(reservaPago)}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                Total de la reserva
              </p>

              <p className="text-2xl font-bold text-green-700">
                ${obtenerTotal(reservaPago).toLocaleString("es-CO")}
              </p>

            </div>

            <form onSubmit={registrarPago}>

              <label className="mb-2 block font-semibold">
                Método de pago
              </label>

              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="mb-5 w-full rounded-xl border p-3 outline-none focus:border-green-500"
              >
                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Nequi">
                  Nequi
                </option>
              </select>

              <div className="mb-5 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
                {metodoPago === "Efectivo"
                  ? "El pago quedará registrado inmediatamente como pagado."
                  : "El pago quedará pendiente hasta que el administrador confirme su recepción."}
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalPago(false);
                    setReservaPago(null);
                  }}
                  className="w-full rounded-xl bg-gray-200 px-4 py-3 hover:bg-gray-300"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardandoPago}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {guardandoPago
                    ? "Registrando..."
                    : "Guardar pago"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL DETALLE DE RESERVA */}
      {mostrarDetalle && reservaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Detalle de la reserva
              </h2>

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
                <strong>Estado de reserva:</strong>{" "}
                {estadosReserva.find(
                  (e) => e.value === reservaSeleccionada.estado
                )?.label || reservaSeleccionada.estado || "Registrada"}
              </p>

              <hr />

              <p>
                <strong>Estado del pago:</strong>{" "}
                {obtenerEstadoPago(reservaSeleccionada)}
              </p>

              <p>
                <strong>Método de pago:</strong>{" "}
                {obtenerPagoReserva(reservaSeleccionada)?.metodo_pago ||
                  "Sin registrar"}
              </p>

              {obtenerPagoReserva(reservaSeleccionada)?.estado === "Pendiente" && (
                <p className="font-semibold text-amber-600">
                  El pago está pendiente de aprobación.
                </p>
              )}

              {obtenerPagoReserva(reservaSeleccionada)?.estado === "Rechazado" && (
                <p className="font-semibold text-red-600">
                  El pago fue rechazado.
                </p>
              )}

            </div>

            <button
              onClick={() => setMostrarDetalle(false)}
              className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-gray-800"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
