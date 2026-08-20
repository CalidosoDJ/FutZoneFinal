const actividad = [

    "Nuevo usuario registrado",

    "Reserva realizada",

    "Cancha editada",

    "Reserva cancelada",

];

export default function ActividadReciente() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-700">

            <h2 className="text-xl font-bold mb-5">

                Actividad Reciente

            </h2>

            <div className="space-y-4">

                {actividad.map((a, i) => (

                    <div
                        key={i}
                        className="border-l-4 border-green-600 pl-4"
                    >

                        {a}

                    </div>

                ))}

            </div>

        </div>

    );
}