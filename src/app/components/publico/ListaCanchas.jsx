import CanchaCard from "@/app/components/publico/CanchaCard";

export default function ListaCanchas() {
    const canchas = [
        {
            id: 1,
            nombre: "Cancha 1 - Fútbol 5",
            imagen: "/images/cancha1.jpg",
            precio: "$70.000 / hora",
        },
        {
            id: 2,
            nombre: "Cancha 2 - Fútbol 5",
            imagen: "/images/cancha2.jpg",
            precio: "$65.000 / hora",
        },
        {
            id: 3,
            nombre: "Cancha 3 - Fútbol 8",
            imagen: "/images/cancha3.webp",
            precio: "$90.000 / hora",
        },
        {
            id: 4,
            nombre: "Cancha 4 - Fútbol 11",
            imagen: "/images/cancha4.webp",
            precio: "$120.000 / hora",
        },
        {
            id: 5,
            nombre: "Cancha 5 - Fútbol 11",
            imagen: "/images/cancha5.webp",
            precio: "$120.000 / hora",
        },
    ];

    return (
        <section className="bg-slate-100 py-4">

            <div className="max-w-7xl mx-auto px-6">

                <h1 className="text-5xl font-bold text-center text-green-700 mb-1 m-0">
                    Canchas Disponibles⚽
                </h1>

                <p className="text-center text-black text-xl mb-10">
                    Reserva fácilmente tu cancha favorita.
                </p>

                {/* CONTENEDOR CON SCROLL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {canchas.map((cancha) => (
                        <CanchaCard
                        key={cancha.id}
                        cancha={cancha} />
                    ))}

                </div>

            </div>

        </section>
    );
}