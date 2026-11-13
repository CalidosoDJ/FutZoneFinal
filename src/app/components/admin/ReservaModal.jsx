
"use client";

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function ReservaModal({
  mostrarModal,
  setMostrarModal,
  formulario,
  setFormulario,
  guardarReserva,
  actualizarReserva,
  editando,
  usuarios = [],
  canchas = [],
  guardando = false,
}) {
  const formularioSeguro = formulario || {};

  const idCanchaSeleccionada = String(
    formularioSeguro.id_cancha ?? ""
  );

  const canchaSeleccionada = canchas.find(
    (cancha) =>
      String(cancha.id_cancha ?? cancha.id) ===
      idCanchaSeleccionada
  );

  const precioCancha = Number(
    canchaSeleccionada?.precio_hora ??
    canchaSeleccionada?.precio ??
    canchaSeleccionada?.precio_por_hora ??
    0
  );

  const horaInicio = formularioSeguro.hora_inicio || "";
  const horaFin = formularioSeguro.hora_fin || "";

  const calcularDuracion = () => {
    if (!horaInicio || !horaFin) return 0;

    const [hora1, minuto1] = horaInicio.split(":").map(Number);
    const [hora2, minuto2] = horaFin.split(":").map(Number);

    return (
      hora2 * 60 +
      minuto2 -
      hora1 * 60 -
      minuto1
    ) / 60;
  };

  const duracion = calcularDuracion();
  const totalCalculado =
    duracion > 0 ? precioCancha * duracion : 0;

  useEffect(() => {
    if (!mostrarModal) return;

    setFormulario((anterior) => ({
      ...anterior,
      hora_fin: anterior.hora_fin || "",
    }));
  }, [mostrarModal, setFormulario]);

  if (!mostrarModal) return null;

  function cambiarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function manejarEnvio(e) {
    e.preventDefault();

    if (!formularioSeguro.id_usuario) {
      alert("Selecciona un cliente.");
      return;
    }

    if (!formularioSeguro.id_cancha) {
      alert("Selecciona una cancha.");
      return;
    }

    if (!formularioSeguro.fecha_reserva) {
      alert("Selecciona la fecha de la reserva.");
      return;
    }

    if (!horaInicio || !horaFin) {
      alert("Selecciona la hora de inicio y finalización.");
      return;
    }

    if (horaFin <= horaInicio) {
      alert("La hora final debe ser posterior a la inicial.");
      return;
    }

    if (typeof guardarReserva === "function") {
      guardarReserva(e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 text-gray-700">
      <div className="my-6 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-8 flex items-center justify-between rounded-xl bg-green-600 p-4 text-white">
          <h2 className="text-2xl font-bold">
            {editando ? "Editar reserva" : "Nueva reserva"}
          </h2>

          <button
            type="button"
            onClick={() => setMostrarModal(false)}
            className="rounded-lg p-2 hover:bg-green-700"
            aria-label="Cerrar formulario"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="mb-5">
            <label className="mb-2 block font-semibold">
              Cliente
            </label>

            <select
              required
              value={formularioSeguro.id_usuario ?? ""}
              onChange={(e) =>
                cambiarCampo("id_usuario", e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">Selecciona un cliente</option>

              {usuarios.map((usuario) => (
                <option
                  key={usuario.id_usuario}
                  value={usuario.id_usuario}
                >
                  {usuario.nombre_completo ||
                    usuario.username ||
                    usuario.email ||
                    `Usuario ${usuario.id_usuario}`}
                </option>
              ))}
            </select>

            {usuarios.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                No se encontraron usuarios. Verifica la API de usuarios.
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-semibold">
              Cancha
            </label>

            <select
              required
              value={idCanchaSeleccionada}
              onChange={(e) => {
                cambiarCampo("id_cancha", e.target.value);
              }}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Selecciona una cancha</option>

              {canchas.map((cancha) => (
                <option
                  key={cancha.id_cancha ?? cancha.id}
                  value={cancha.id_cancha ?? cancha.id}
                >
                  {cancha.nombre ||
                    cancha.nombre_cancha ||
                    `Cancha ${cancha.id_cancha ?? cancha.id}`}
                </option>
              ))}
            </select>

            {canchas.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                No se encontraron canchas. Verifica la API de canchas.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Fecha
              </label>

              <input
                required
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={formularioSeguro.fecha_reserva ?? ""}
                onChange={(e) =>
                  cambiarCampo("fecha_reserva", e.target.value)
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Hora de inicio
              </label>

              <select
                required
                value={horaInicio}
                onChange={(e) =>
                  cambiarCampo("hora_inicio", e.target.value)
                }
                className="w-full rounded-xl border bg-white p-3"
              >
                <option value="">Selecciona la hora</option>

                {[
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                ].map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Hora de finalización
              </label>

              <select
                required
                value={horaFin}
                onChange={(e) =>
                  cambiarCampo("hora_fin", e.target.value)
                }
                className="w-full rounded-xl border bg-white p-3"
              >
                <option value="">Selecciona la hora</option>

                {[
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                  "22:00",
                ]
                  .filter((hora) => !horaInicio || hora > horaInicio)
                  .map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Duración
              </label>

              <div className="rounded-xl border bg-gray-50 p-3">
                {duracion > 0
                  ? `${duracion} ${duracion === 1 ? "hora" : "horas"}`
                  : "Selecciona los horarios"}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-green-50 p-5">
            <p className="text-sm text-gray-600">
              Precio por hora
            </p>

            <p className="text-lg font-semibold">
              ${precioCancha.toLocaleString("es-CO")}
            </p>

            <h3 className="mt-3 text-lg font-bold">
              Total estimado
            </h3>

            <p className="text-3xl font-bold text-green-700">
              ${totalCalculado.toLocaleString("es-CO")}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              El total se calcula según el precio de la cancha y la duración.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              className="rounded-xl bg-gray-200 px-6 py-3 hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : editando
                  ? "Actualizar reserva"
                  : "Guardar reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
