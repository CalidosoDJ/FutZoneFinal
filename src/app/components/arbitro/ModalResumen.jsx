"use client";

export default function ModalResumen({
  abierto,
  onClose,
  onConfirmar,

  partido,
  golesLocal,
  golesVisitante,
  observaciones,
  calificacion,
  eventos,
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <section
        className="
bg-white
rounded-2xl
shadow-xl
w-full
max-w-3xl
max-h-[90vh]
overflow-y-auto
p-8
"
      >
        <div className="border-b border-slate-200 pb-5 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Confirmar Resumen
          </h2>

          <p className="text-slate-600 mt-2">
            Verifica la información antes de guardar el acta del partido.
          </p>
        </div>

        {/* Información */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500 uppercase">
              Equipo Local
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {partido.local}
            </h3>
          </article>

          <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500 uppercase">
              Equipo Visitante
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {partido.visitante}
            </h3>
          </article>

          <article className="rounded-xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm font-semibold text-green-700 uppercase">
              Marcador Final
            </p>

            <h3 className="mt-2 text-4xl font-extrabold text-green-700">
              {golesLocal} - {golesVisitante}
            </h3>
          </article>

          <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm font-semibold text-yellow-700 uppercase">
              Calificación
            </p>

            <h3 className="mt-2 text-3xl font-bold text-yellow-600">
              ⭐ {calificacion}/5
            </h3>
          </article>
        </section>

        {/* Eventos */}

        <section className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-5">
            📋 Eventos Registrados
          </h3>

          {eventos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-slate-600 font-medium">
                No se han registrado eventos para este partido.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:shadow-md transition"
                >
                  <p className="text-slate-800 font-semibold">
                   <strong>{evento.minuto}&apos;</strong> - {evento.tipo}
                  </p>

                  <p className="text-slate-700">{evento.jugador}</p>

                  <p className="text-slate-600">{evento.equipo}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Observaciones */}

        <section className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-5">
            📝 Observaciones del Árbitro
          </h3>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 min-h-28">
            <p className="text-slate-700 leading-relaxed">
              {observaciones ||
                "No se registraron observaciones para este encuentro."}
            </p>
          </div>
        </section>

        {/* Botones */}

        <div className="flex justify-end gap-4 mt-10 border-t border-slate-200 pt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-slate-700 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
          >
            Confirmar Resumen
          </button>
        </div>
      </section>
    </div>
  );
}