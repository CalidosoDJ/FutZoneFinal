"use client";

export default function InfoItem({ icon, titulo, valor }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
      <div className="text-green-600 text-2xl">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{titulo}</p>

        <h3 className="font-semibold text-slate-800">{valor}</h3>
      </div>
    </div>
  );
}
