import Link from "next/link";

export default function AuthButtons() {

  return (
    <div className="flex gap-4">

      <Link
        href="/login"
        className="border border-green-100 px-5 py-2 rounded-xl hover:bg-blue-500 transition"
      >
        Iniciar Sesión
      </Link>

      <Link
        href="/register"
        className="bg-green-700 px-5 py-2 rounded-xl hover:bg-green-600 transition"
      >
        Registrarse
      </Link>

    </div>
  );
}