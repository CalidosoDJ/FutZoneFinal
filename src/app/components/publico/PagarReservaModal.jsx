"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaQrcode, FaMoneyBillWave } from "react-icons/fa";

export default function PagarReservaModal({
  mostrarModal,
  setMostrarModal,
  reservaSeleccionada,
  onPagoExitoso
}) {
  const [metodo, setMetodo] = useState("Nequi");
  const [referenciaNequi, setReferenciaNequi] = useState("");
  const [comprobante, setComprobante] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!mostrarModal || !reservaSeleccionada) return null;

  // Generar referencia única de pago
  const generarReferencia = () => {
    const fecha = new Date();
    const codigo = Math.floor(1000 + Math.random() * 9000);
    return `FTZ-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, "0")}${String(fecha.getDate()).padStart(2, "0")}-${codigo}`;
  };

  const referenciaSistema = generarReferencia();

  // Calcular valor de la reserva
  const valorReserva = Number(
    reservaSeleccionada.total ||
    reservaSeleccionada.precio_total ||
    reservaSeleccionada.valor_total ||
    reservaSeleccionada.valor ||
    50000 // Valor por defecto en caso de que venga limpio
  );

  const cargarComprobante = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!["image/jpeg", "image/png", "application/pdf"].includes(archivo.type)) {
      alert("Solo se permiten archivos JPG, PNG o PDF.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert("El archivo no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setComprobante(reader.result);
    };
    reader.readAsDataURL(archivo);
  };

  const confirmarPago = async () => {
    if (metodo === "Nequi") {
      if (!referenciaNequi.trim()) {
        alert("Por favor ingresa la referencia de la transacción de Nequi.");
        return;
      }
      if (!comprobante) {
        alert("Por favor adjunta el comprobante de pago.");
        return;
      }
    }

    setEnviando(true);
    const idReserva = reservaSeleccionada.id_reserva || reservaSeleccionada.id;
    const estadoNuevo = metodo === "Nequi" ? "Pendiente" : "Confirmada";

    try {
      const datosPago = {
        id_reserva: idReserva,
        valor: valorReserva,
        metodo: metodo,
        referenciaSistema,
        referenciaNequi: metodo === "Nequi" ? referenciaNequi : "EFECTIVO",
        comprobante: metodo === "Nequi" ? comprobante : null,
        estado: metodo === "Nequi" ? "Pendiente" : "Pagado",
        fechaRegistro: new Date().toISOString(),
      };

      // 1. Registrar pago en Django (/api/pagos/)
      await fetch("http://127.0.0.1:8000/api/pagos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_reserva: idReserva,
          monto: valorReserva,
          metodo_pago: metodo,
          referencia: metodo === "Nequi" ? referenciaNequi : referenciaSistema,
          estado: metodo === "Nequi" ? "Pendiente" : "Pagado",
        }),
      }).catch(() => null);

      // 2. Actualizar el estado de la reserva en Django (/api/reservas/<id>/)
      await fetch(`http://127.0.0.1:8000/api/reservas/${idReserva}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: estadoNuevo }),
      }).catch(() => null);

      // 3. Respaldo en localStorage
      const pagosAnteriores = JSON.parse(localStorage.getItem("pagos") || "[]");
      localStorage.setItem("pagos", JSON.stringify([...pagosAnteriores, datosPago]));

      alert(
        metodo === "Nequi"
          ? "¡Comprobante enviado con éxito! Quedará aprobado tras la verificación del administrador."
          : "¡Reserva registrada para pago en efectivo en sede!"
      );

      if (onPagoExitoso) onPagoExitoso(datosPago);
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      alert("Hubo un error al registrar el pago.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 z-50 text-slate-700 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Cabecera */}
        <div className="flex justify-between items-center border-b p-6 bg-emerald-600 text-white">
          <div>
            <h2 className="text-xl md:text-2xl font-black">Pasarela de Pago FutZone</h2>
            <p className="text-xs text-emerald-100 font-medium">Reserva #{reservaSeleccionada.id_reserva || reservaSeleccionada.id}</p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarModal(false)}
            className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-6">

          {/* Resumen de la Reserva */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Cancha:</span>
              <span className="font-bold text-slate-800">
                {reservaSeleccionada.cancha?.nombre_cancha || reservaSeleccionada.nombre_cancha || "Cancha FutZone"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha y Hora:</span>
              <span className="font-bold text-slate-800">
                {reservaSeleccionada.fecha_reserva || reservaSeleccionada.fecha || "Horario programado"}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-base">
              <span className="font-bold text-slate-700">Total a Pagar:</span>
              <span className="font-black text-emerald-600">
                ${valorReserva.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          {/* Selección de Método */}
          <div>
            <label className="font-bold text-sm text-slate-800 block mb-3">Selecciona el Método de Pago</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodo("Nequi")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition cursor-pointer ${metodo === "Nequi"
                  ? "border-emerald-600 bg-emerald-50/60 text-emerald-800 font-bold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
              >
                <FaQrcode size={22} className="text-emerald-600" />
                <span className="text-xs">Nequi (QR / Transferencia)</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodo("Efectivo")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition cursor-pointer ${metodo === "Efectivo"
                  ? "border-emerald-600 bg-emerald-50/60 text-emerald-800 font-bold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
              >
                <FaMoneyBillWave size={22} className="text-emerald-600" />
                <span className="text-xs">Pago en Sede (Efectivo)</span>
              </button>
            </div>
          </div>

          {/* Si elige Nequi */}
          {metodo === "Nequi" && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-emerald-900 text-center">Escanea el código QR o transfiere al número indicado</h3>

              <div className="flex justify-center">
                <Image
                  src="/images/qr.webp"
                  width={180}
                  height={180}
                  alt="QR Nequi FutZone"
                  className="rounded-2xl shadow-sm bg-white p-2 border border-emerald-100"
                />
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1.5 text-xs">
                <p><strong>Número Nequi:</strong> <span className="text-emerald-800 font-bold">3106021273</span></p>
                <p><strong>Monto exacto:</strong> <span className="text-emerald-800 font-bold">${valorReserva.toLocaleString("es-CO")}</span></p>
                <p><strong>Ref. Interna:</strong> <span className="text-emerald-700 font-bold">{referenciaSistema}</span></p>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">Número o ID de comprobante Nequi</label>
                <input
                  type="text"
                  placeholder="Ej: 985632147"
                  value={referenciaNequi}
                  onChange={(e) => setReferenciaNequi(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">Adjuntar captura del comprobante</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={cargarComprobante}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />
              </div>

              {comprobante && (
                <div className="text-xs text-emerald-700 font-semibold bg-white p-2.5 rounded-xl border border-emerald-100 text-center">
                  ✅ Comprobante adjuntado correctamente
                </div>
              )}
            </div>
          )}

          {metodo === "Efectivo" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1">
              <p className="font-bold">💡 Nota importante:</p>
              <p>Tu reserva quedará registrada como pendiente de pago presencial. Debes cancelar el valor directamente en la sede antes de ingresar a la cancha.</p>
            </div>
          )}

        </div>

        {/* Pie del Modal */}
        <div className="border-t p-5 flex justify-end gap-3 bg-slate-50 rounded-b-3xl">
          <button
            type="button"
            onClick={() => setMostrarModal(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-xs cursor-pointer transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={enviando}
            onClick={confirmarPago}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 cursor-pointer transition flex items-center justify-center"
          >
            {enviando ? "Procesando..." : metodo === "Nequi" ? "Enviar Comprobante" : "Confirmar Reserva"}
          </button>
        </div>

      </div>
    </div>
  );
}