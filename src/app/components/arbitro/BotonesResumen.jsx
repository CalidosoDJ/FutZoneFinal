"use client";

export default function BotonesResumen({
  onCancelar,

  onGuardar,
}) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancelar}
        className="flex-1 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-950 font-bold text-sm transition shadow-sm"
      >
        Cancelar
      </button>

      <button
        onClick={onGuardar}
        className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition shadow-sm"
      >
        Guardar Resumen
      </button>
    </div>
  );
}
