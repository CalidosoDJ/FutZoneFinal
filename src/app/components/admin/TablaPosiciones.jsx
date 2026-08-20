"use client";

import { FaTimes } from "react-icons/fa";

export default function TablaPosiciones({

    mostrarTabla,
    setMostrarTabla,
    torneo,
    torneos,
    setTorneos,

}) {

    if (!mostrarTabla || !torneo) return null;

    const equipos = torneo.equipos || [];

    const tabla = equipos.map((equipo) => ({

        nombre: equipo.nombre,
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
    }));


    const resultados = torneo.resultados || {};

    Object.values(resultados).forEach((partido) => {

        if (!partido.ganador) return;

        const local = tabla.find(

            e => e.nombre === partido.local

        );

        const visitante = tabla.find(

            e => e.nombre === partido.visitante

        );

        if (!local || !visitante) return;

        const golesLocal = Number(partido.localMarcador || 0);

        const golesVisitante = Number(partido.visitanteMarcador || 0);

        local.pj++;
        visitante.pj++;
        local.gf += golesLocal;
        local.gc += golesVisitante;
        visitante.gf += golesVisitante;
        visitante.gc += golesLocal;
        local.dg = local.gf - local.gc;
        visitante.dg = visitante.gf - visitante.gc;

        if (partido.ganador === local.nombre) {

            local.pg++;
            local.pts += 3;
            visitante.pp++;

        }

        else if (partido.ganador === visitante.nombre) {

            visitante.pg++;
            visitante.pts += 3;
            local.pp++;

        }

        else {

            local.pe++;
            visitante.pe++;
            local.pts++;
            visitante.pts++;

        }
    });

    tabla.sort((a, b) => {

        if (b.pts !== a.pts)

            return b.pts - a.pts;

        return b.dg - a.dg;

    });

    const clasificarSemifinal = () => {
        if (tabla.length < 4) {
            alert("Se necesitan al menos 4 equipos.");
            return;
        }

        const semifinales = [

            {
                id: 1,
                local: tabla[0].nombre,
                visitante: tabla[3].nombre,
                localMarcador: "",
                visitanteMarcador: "",
                ganador: "",
            },

            {
                id: 2,
                local: tabla[1].nombre,
                visitante: tabla[2].nombre,
                localMarcador: "",
                visitanteMarcador: "",
                ganador: "",
            }

        ];

        const nuevosTorneos = torneos.map((t) =>
            t.id === torneo.id
                ? {
                    ...t,
                    semifinales,
                }
                : t
        );

        setTorneos(nuevosTorneos);

        localStorage.setItem(
            "torneos",
            JSON.stringify(nuevosTorneos)
        );

        alert("Semifinales generadas correctamente.");
    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-6 text-gray-700">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Tabla de Posiciones
                        </h2>
                        <p className="text-gray-500">

                            {torneo.nombre}

                        </p>

                    </div>

                    <button

                        onClick={() => setMostrarTabla(false)}

                    >

                        <FaTimes className="text-red-600 text-2xl" />

                    </button>

                </div>

                <div className="p-8 overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-600 text-white">

                                <th className="py-3">#</th>

                                <th>Equipo</th>

                                <th>PJ</th>

                                <th>PG</th>

                                <th>PE</th>

                                <th>PP</th>

                                <th>GF</th>

                                <th>GC</th>

                                <th>DG</th>

                                <th>PTS</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                tabla.map((equipo, index) => (

                                    <tr

                                        key={index}

                                        className="text-center border-b"

                                    >

                                        <td>{index + 1}</td>

                                        <td className="font-semibold">

                                            🏆 {equipo.nombre}

                                        </td>

                                        <td>{equipo.pj}</td>

                                        <td>{equipo.pg}</td>

                                        <td>{equipo.pe}</td>

                                        <td>{equipo.pp}</td>

                                        <td>{equipo.gf}</td>

                                        <td>{equipo.gc}</td>

                                        <td>{equipo.dg}</td>

                                        <td className="font-bold text-green-600">

                                            {equipo.pts}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>
                    </table>
                </div>

                <div className="border-t p-6 flex justify-between">

                    <button
                        onClick={clasificarSemifinal}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >
                        🏅 Clasificar a Semifinales
                    </button>

                    <button

                        onClick={() => setMostrarTabla(false)}

                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"

                    >

                        Cerrar

                    </button>

                </div>

            </div>

        </div>

    );

}