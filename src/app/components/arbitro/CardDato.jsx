"use client";

export default function CardDato({
  icon,
  titulo,
  valor,
  color,
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 text-center hover:shadow-lg transition">
      <div className={`text-4xl mb-4 ${color}`}>
        {icon}
      </div>

      <h3 className="text-gray-500">
        {titulo}
      </h3>

      <p className="text-3xl font-bold mt-2 text-slate-800">
        {valor}
      </p>
    </div>
  );
}