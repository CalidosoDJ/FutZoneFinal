import Link from "next/link";

export default function HeaderComponent() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-500">
            ⚽ FutZone
          </Link>

          {/* Menú */}
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-green-400">
              Inicio
            </Link>

            <Link href="/reservas" className="hover:text-green-400">
              Reservas
            </Link>

            <Link href="/convenios" className="hover:text-green-400">
              Convenios
            </Link>

            <Link href="/faq" className="hover:text-green-400">
              FAQ
            </Link>

            <Link href="/contacto" className="hover:text-green-400">
              Contacto
            </Link>
          </nav>

          {/* Botón */}
          <Link
            href="/login"
            className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}