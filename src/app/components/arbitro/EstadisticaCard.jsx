"use client";

export default function EstadisticaCard({
    titulo,
    valor,
    icono,
    color
}) {

    return (

        <article
            className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                p-6
                border
                border-gray-100
                hover:-translate-y-1
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-500 text-sm">

                        {titulo}

                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-slate-800">

                        {valor}

                    </h2>

                </div>

                <div
                    className={`
                        ${color}
                        w-16
                        h-16
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-white
                        text-2xl
                        shadow-lg
                    `}
                >

                    {icono}

                </div>

            </div>

        </article>

    );

}

