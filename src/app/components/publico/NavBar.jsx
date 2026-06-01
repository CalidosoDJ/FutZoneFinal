import AuthButtons from "./AuthButtons";

export default function NavBar() {

  return (
    <nav className="bg-gray-950 text-white px-10 py-4 flex items-center justify-between">

      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-white-500">
          FutZone
        </h1>
      </div>

      {/* Menú */}
      <ul className="hidden md:flex gap-8 text-lg">

        <li className="hover:text-gray-400 transition cursor-pointer">
          Inicio
        </li>

        <li className="hover:text-gray-400 transition cursor-pointer">
          Lista de Canchas
        </li>

        <li className="hover:text-gray-400 transition cursor-pointer">
          Ubicación
        </li>

        <li className="hover:text-gray-400 transition cursor-pointer">
          Nosotros
        </li>

      </ul>

      {/* Botones */}
      <AuthButtons />

    </nav>
  );
}