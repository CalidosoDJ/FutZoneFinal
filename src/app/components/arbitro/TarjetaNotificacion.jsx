"use client";

export default function TarjetaNotificacion({
  icono,
  titulo,
  descripcion,
  tiempo,
  leida,
}) {
 
return (
  <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
          {icono}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {titulo}
          </h3>

          <p className="text-slate-600 mt-1">
            {descripcion}
          </p>

          <span className="inline-block mt-3 text-sm text-slate-500">
            {tiempo}
          </span>
        </div>
      </div>

      {!leida && (
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      )}
    </div>
  </article>
);
}