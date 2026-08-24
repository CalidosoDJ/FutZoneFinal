export default function FooterComponent() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold text-green-500">
            ⚽ FutZone
          </h3>

          <p className="text-gray-400 text-center">
            Reserva canchas, administra convenios y disfruta la mejor
            experiencia deportiva.
          </p>

          <div className="border-t border-gray-700 w-full pt-4 text-center">
            <p className="text-sm text-gray-400">
              © 2026 FutZone. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}