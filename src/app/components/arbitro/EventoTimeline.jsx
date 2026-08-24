"use client";

export default function EventoTimeline({ tipo, jugador, minuto, equipo }) {
  function obtenerIcono() {
    switch (tipo) {
      case "Gol":
        return "⚽";

      case "Tarjeta Amarilla":
        return "🟨";

      case "Tarjeta Roja":
        return "🟥";

      case "Cambio":
        return "🔄";

      case "Lesión":
        return "🤕";

      case "Penal":
        return "🎯";

      case "Tiempo Agregado":
        return "⏱";

      default:
        return "📌";
    }
  }

  return (
    <article className="border border-slate-200 rounded-2xl bg-white p-5 transition-all duration-300 hover:shadow-lg hover:border-green-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{obtenerIcono()}</span>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{tipo}</h3>

            <p className="text-sm text-slate-600">{jugador}</p>
          </div>
        </div>

        <span className="rounded-full bg-green-100 px-4 py-2 text-lg font-bold text-green-700">
          {minuto}
        </span>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {equipo}
        </span>
      </div>
    </article>
  );
}
