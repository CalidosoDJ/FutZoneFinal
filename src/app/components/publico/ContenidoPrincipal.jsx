import Link from "next/link";

export default function ContenidoPrincipal() {
  
  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center "
      style={{
        backgroundImage: "url('/images/fondo homepage 2.jpg')",
        backgroundPosition: "center 100%",
      }}
    >
      <div className="w-full min-h-screen bg-black/70 flex items-center px-16">

        <div className="max-w-2xl text-white mb-0">

          <h1 className="text-6xl font-bold leading-tight mb-6">

            Vive el fútbol con
            <span className="text-green-700">
              {" "}FutZone
            </span>

          </h1>

          <p className="text-gray-300 text-xl mb-8">

            Reserva canchas sintéticas,
            organiza torneos y disfruta
            la mejor experiencia deportiva.

          </p>

          <div className="flex gap-5">

            <Link
              href="/login"
              className="bg-green-700 hover:bg-green-600 transition px-8 py-3 rounded-xl text-lg"
            >
              Ver Canchas
            </Link>

            <Link
              href="/register"
              className="border border-white hover:bg-white hover:text-black transition px-8 py-3 rounded-xl text-lg"
            >
              Crear Cuenta
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}