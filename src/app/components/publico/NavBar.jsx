import AuthButtons from "./AuthButtons";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {

  return (
    <nav className="bg-gray-950 text-white px-10 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer">

        <Image
          src="/icons/futzone logo.jpeg"
          alt="Logo FutZone"
          width={50}
          height={50}
          className="object-contain rounded-full"
        />

        <h1 className="text-3xl font-bold">
          Fut<span className="text-green-500">Zone</span>
        </h1>

      </div>

      {/* Menú */}
      <ul className="hidden md:flex items-center gap-10 text-lg font-medium">

        <li>
          <Link
            href="/"
            className="hover:text-green-500 transition duration-300"
          >
            Inicio
          </Link>
        </li>

        <li>
          <Link
            href="/canchas"
            className="hover:text-green-500 transition duration-300"
          >
            Canchas
          </Link>
        </li>

        <li>
          <Link
            href="/ubicacion"
            className="hover:text-green-500 transition duration-300"
          >
            Ubicación
          </Link>
        </li>

        <li>
          <Link
            href="/nosotros"
            className="hover:text-green-500 transition duration-300"
          >
            Nosotros
          </Link>
        </li>

      </ul>

      {/* Botones */}
      <AuthButtons />

    </nav>
  );
}