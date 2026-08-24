import Link from "next/link";

export default function HeaderTorneoAdmin() {

    
    return (
        <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-xl">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        ⚽ FutZone
                    </h1>

                    <p className="text-green-100">
                        Administrador de Torneos
                    </p>
                </div>

                <nav className="hidden md:flex gap-6 font-semibold">
                    <Link
                        href="/"
                        className="hover:text-yellow-300 transition"
                    >
                        Inicio
                    </Link>

                    <Link
                        href="/torneo"
                        className="hover:text-yellow-300 transition"
                    >
                        Torneos
                    </Link>

                    <Link
                        href="#"
                        className="hover:text-yellow-300 transition"
                    >
                        Equipos
                    </Link>
                </nav>
            </div>
        </header>
    );
}