
import { Search, CalendarCheck, Trophy } from "lucide-react";

export default function ComoFunciona() {
  const pasos = [
    {
      icono: Search,
      titulo: "1. Explora",
      descripcion:
        "Encuentra la cancha ideal según tu ubicación y preferencias.",
    },
    {
      icono: CalendarCheck,
      titulo: "2. Reserva",
      descripcion:
        "Selecciona la cancha, fecha y horario que prefieras.",
    },
    {
      icono: Trophy,
      titulo: "3. Juega",
      descripcion:
        "Reúne a tu equipo y disfruta tu partido.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 bg-gray-50 py-20 px-6"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          ¿Cómo funciona FutZone?
        </h2>

        <p className="text-gray-600 text-lg mb-12">
          Reserva tu cancha en tres sencillos pasos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pasos.map((paso) => {
            const Icono = paso.icono;

            return (
              <div
                key={paso.titulo}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Icono className="w-8 h-8 text-green-700" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {paso.titulo}
                </h3>

                <p className="text-gray-600">
                  {paso.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
