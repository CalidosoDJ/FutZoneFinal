import ReservaCard from "@/app/components/publico/ReservaCard";

export default function Page() {

    return (

        <main className="min-h-screen bg-slate-100 py-12">

            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-10">

                    <h1 className="text-5xl font-black text-gray-800">

                        Mis Reservas

                    </h1>

                    <p className="text-gray-500 mt-3 text-lg">

                        Consulta todas las reservas realizadas en FutZone.

                    </p>

                </div>

                <ReservaCard />

            </div>

        </main>

    );

}