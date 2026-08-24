"use client";

export default function InputPerfil({
  icon,
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block font-semibold mb-2">
        {label}
      </label>

      <div className="flex items-center border rounded-xl px-4">
        <div className="text-green-600">
          {icon}
        </div>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 outline-none"
        />
      </div>
    </div>
  );
}