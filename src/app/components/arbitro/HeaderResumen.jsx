export default function HeaderResumen() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          Resumen del Partido
        </h1>

        <p className="text-slate-700 text-sm mt-1">
          Registra el resultado oficial del encuentro.
        </p>
      </div>

      <span className="bg-green-100 text-green-900 border border-green-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
        Partido Oficial
      </span>
    </div>
  );
}