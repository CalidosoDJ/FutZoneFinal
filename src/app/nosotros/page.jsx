import Link from "next/link";
import { ShieldCheck, Trophy, Rocket } from "lucide-react";

export default function NosotrosPage() {

    return (

        <main className="bg-slate-100 min-h-screen">

            {/* HERO */}
            <section className="bg-gray-950 text-white py-15">

                <div className="max-w-6xl mx-auto px-6 text-center">

                    <h1 className="text-6xl font-bold mb-6">
                        Sobre FutZone ⚽
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        FutZone es una plataforma diseñada para facilitar
                        la búsqueda y reserva de canchas sintéticas,
                        brindando una experiencia rápida, segura y moderna
                        para jugadores y administradores.
                    </p>

                </div>

            </section>

            {/* QUIÉNES SOMOS */}
            <section className="max-w-7xl mx-auto py-10 px-6">

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <div>

                        <h2 className="text-5xl font-bold text-green-600 mb-6">
                            ¿Quiénes Somos?
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            FutZone es una plataforma creada para transformar la
                            manera en que los usuarios reservan canchas sintéticas.
                            Buscamos conectar jugadores y complejos deportivos
                            mediante una experiencia rápida y moderna.
                        </p>

                    </div>

                    <img
                        src="/images/nosotros.jpg"
                        alt="Jugadores"
                        className="rounded-3xl shadow-2xl"
                    />

                </div>

            </section>

            {/* MISIÓN Y VISIÓN */}

            <section className="max-w-6xl mx-auto px-6 py-8">

                <div className="grid md:grid-cols-2 gap-8">

                    <div className="bg-white p-8 rounded-3xl shadow-lg">

                        <h3 className="text-3xl font-bold text-green-700 mb-4">
                            Misión
                        </h3>

                        <p className="text-gray-700">
                            Facilitar la gestión y reserva de canchas
                            deportivas mediante una plataforma digital
                            moderna, accesible y eficiente.
                        </p>

                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg">

                        <h3 className="text-3xl font-bold text-green-700 mb-4">
                            Visión
                        </h3>

                        <p className="text-gray-700">
                            Convertirnos en la plataforma líder para la
                            reserva de espacios deportivos en Colombia,
                            promoviendo el deporte y la transformación digital.
                        </p>

                    </div>

                </div>

            </section>

            {/* VALORES */}

            <div className="grid md:grid-cols-3 gap-8">

                <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

                    <ShieldCheck
                        size={60}
                        className="mx-auto text-green-600 mb-4"
                    />

                    <h3 className="text-2xl font-bold text-black">
                        Confianza
                    </h3>

                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

                    <Trophy
                        size={60}
                        className="mx-auto text-green-600 mb-4"
                    />

                    <h3 className="text-2xl font-bold text-black">
                        Calidad
                    </h3>

                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

                    <Rocket
                        size={60}
                        className="mx-auto text-green-600 mb-4"
                    />

                    <h3 className="text-2xl font-bold text-black">
                        Innovación
                    </h3>

                </div>

            </div>
 <br />
            {/* ESTADÍSTICAS */}

            <section className="bg-gray-950 py-20 rounded">

                <div className="max-w-6xl mx-auto">

                    <div className="grid md:grid-cols-4 gap-8">

                        <div className="text-center text-white">
                            <h2 className="text-6xl font-bold text-green-500">
                                5+
                            </h2>

                            <p>Canchas</p>
                        </div>

                        <div className="text-center text-white">
                            <h2 className="text-6xl font-bold text-green-500">
                                500+
                            </h2>

                            <p>Reservas</p>
                        </div>

                        <div className="text-center text-white">
                            <h2 className="text-6xl font-bold text-green-500">
                                100+
                            </h2>

                            <p>Usuarios</p>
                        </div>

                        <div className="text-center text-white">
                            <h2 className="text-6xl font-bold text-green-500">
                                24/7
                            </h2>

                            <p>Disponibilidad</p>
                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="py-16 text-center bg-gray-700 text-white rounded mt-5">

                <h2 className="text-4xl font-bold mb-6 text-white">
                    ¿Listo para jugar?
                </h2>

                <Link
                    href="/canchas"
                    className="
                        inline-block
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-8
                        py-4
                        rounded-xl
                        font-semibold
                    "
                >
                    Reservar Ahora ⚽
                </Link>

            </section>

        </main>

    );
}