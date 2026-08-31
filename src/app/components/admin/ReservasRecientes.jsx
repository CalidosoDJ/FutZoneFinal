const reservas = [

    {
        usuario: "Juan",
        cancha: "Cancha 1",
        estado: "Confirmada",
    },

    {
        usuario: "María",
        cancha: "Cancha 2",
        estado: "Pendiente",
    },

    {
        usuario: "Carlos",
        cancha: "Cancha 5",
        estado: "Cancelada",
    },

];

export default function ReservasRecientes() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-700">

            <h2 className="text-xl font-bold mb-5">

                Últimas Reservas

            </h2>

            <table className="w-full">

                <thead>

                    <tr className="text-left border-b">

                        <th>Usuario</th>

                        <th>Cancha</th>

                        <th>Estado</th>

                    </tr>

                </thead>

                <tbody>

                    {reservas.map((r, i) => (

                        <tr key={i} className="border-b h-14">

                            <td>{r.usuario}</td>

                            <td>{r.cancha}</td>

                            <td>{r.estado}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}