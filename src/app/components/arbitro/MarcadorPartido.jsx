export default function MarcadorPartido({
  local,
  visitante,
  cancha,
  fecha,
  hora,
  categoria,
  golesLocal,
  setGolesLocal,
  golesVisitante,
  setGolesVisitante,
}) {

  return (


          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Bloque del Marcador */}
              <div className="flex items-center justify-center flex-1 w-full md:w-auto">
                {/* Equipo Local */}
                <div className="text-center w-5/12">
                  <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-wide break-words">
                    {local}
                  </h2>
                  <div className="flex justify-center mt-3">
                    <input
                      type="number"
                      min="0"
                      value={golesLocal}
                      // CORRECCIÓN: Parseo explícito a número entero para que React procese el arreglo de goles adecuadamente
                      onChange={(e) =>
                        setGolesLocal(
                          Math.max(0, parseInt(e.target.value) || 0),
                        )
                      }
                      className="w-20 text-center font-black text-2xl border-2 border-slate-300 rounded-xl p-2 bg-slate-50 text-slate-950 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Divisor Versus */}
                <div className="text-lg font-black text-slate-500 mx-4 self-end pb-3">
                  VS
                </div>

                {/* Equipo Visitante */}
                <div className="text-center w-5/12">
                  <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-wide break-words">
                    {visitante}
                  </h2>
                  <div className="flex justify-center mt-3">
                    <input
                      type="number"
                      min="0"
                      value={golesVisitante}
                      // CORRECCIÓN: Parseo explícito a número entero
                      onChange={(e) =>
                        setGolesVisitante(
                          Math.max(0, parseInt(e.target.value) || 0),
                        )
                      }
                      className="w-20 text-center font-black text-2xl border-2 border-slate-300 rounded-xl p-2 bg-slate-50 text-slate-950 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Separador visual */}
              <div className="hidden md:block w-px h-16 bg-gray-200"></div>

              {/* Información de entorno (Texto oscurecido para total legibilidad) */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-900 w-full md:w-auto font-bold bg-slate-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span>📍</span> {cancha}
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span> {fecha}
                </div>
                <div className="flex items-center gap-2">
                  <span>🕒</span> {hora}
                </div>
                <div className="flex items-center gap-2">
                  <span>⚽</span> Cat: {categoria}
                </div>
              </div>
            </div>
          </div>

        );
}

