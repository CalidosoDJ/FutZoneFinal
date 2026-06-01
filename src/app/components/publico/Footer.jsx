import Link from "next/link";

export default function Footer() {

  return (
    <footer className="bg-gray-950 flex justify-center">

      <div className="bg-gray-900 text-white w-[100%] px-10 py-4 shadow-2xl border border-gray-800">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Logo */}
          <div className="max-w-sm">

            <h1 className="text-4xl font-bold text-white-500 mb-4">
              FutZone
            </h1>

            <p className="text-gray-400 leading-relaxed">
              Reserva canchas sintéticas,
              organiza torneos y vive
              la mejor experiencia futbolera.
            </p>

          </div>

          {/* Links */}
          <div>

            <h2 className="text-xl font-semibold mb-5">
              Navegación
            </h2>

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition"
                >
                  Inicio
                </Link>
              </li>

              <li>
                <Link
                  href="/mis-canchas"
                  className="hover:text-blue-400 transition"
                >
                  Lista de Canchas
                </Link>
              </li>

              <li>
                <Link
                  href="/torneos"
                  className="hover:text-blue-400 transition"
                >
                  Nosotros
                </Link>
              </li>

            </ul>

          </div>

          {/* Redes */}
          <div>

            <h2 className="text-xl font-semibold mb-5">
              Redes Sociales
            </h2>

            <div className="flex gap-4">

              <button className="bg-gray-800 hover:bg-blue-600 transition p-4 rounded-2xl text-2xl">
                <img alt="Facebook" src="/icons/facebook.png" className="w-8" />
              </button>

              <button className="bg-gray-800 hover:bg-pink-600 transition p-4 rounded-2xl text-2xl">
                <img alt="Instagram" src="/icons/instagram.png" className="w-8" />
              </button>

              <button className="bg-gray-800 hover:bg-sky-500 transition p-4 rounded-2xl text-2xl">
                <img alt="Twitter" src="/icons/twiter.png" className="w-8" />
              </button>

              <button className="bg-gray-800 hover:bg-green-600 transition p-4 rounded-2xl text-2xl">
                <img alt="WhatsApp" src="/icons/whatsapp.png" className="w-8" />
              </button>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-5 text-center text-gray-500 text-sm">

          © 2026 FutZone - Todos los derechos reservados

        </div>

      </div>

    </footer>
  );
}