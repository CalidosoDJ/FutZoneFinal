
import { notFound } from "next/navigation";
import ReservaCancha from "@/app/components/publico/ReservaCancha";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
    const { id } = await params;
    const idCancha = Number(id);

    if (!Number.isInteger(idCancha) || idCancha <= 0) {
        notFound();
    }

    try {
        const [respuestaCanchas, respuestaSedes] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/canchas/", {
                cache: "no-store",
            }),
            fetch("http://127.0.0.1:8000/api/sedes/", {
                cache: "no-store",
            }),
        ]);

        if (!respuestaCanchas.ok || !respuestaSedes.ok) {
            throw new Error("No se pudieron consultar las canchas y sedes.");
        }

        const [datosCanchas, datosSedes] = await Promise.all([
            respuestaCanchas.json(),
            respuestaSedes.json(),
        ]);

        const canchas = Array.isArray(datosCanchas)
            ? datosCanchas
            : datosCanchas.results || [];

        const sedes = Array.isArray(datosSedes)
            ? datosSedes
            : datosSedes.results || [];

        const datosCancha = canchas.find(
            (item) => Number(item.id_cancha) === idCancha
        );

        if (!datosCancha) {
            notFound();
        }

        const sede = sedes.find(
            (item) =>
                Number(item.id_sede) === Number(datosCancha.id_sede)
        );

        const cancha = {
            id: Number(datosCancha.id_cancha),
            nombre: datosCancha.nombre,
            precio: Number(datosCancha.precio_hora),
            zona: datosCancha.zona || "Cancha sintética",
            direccion: sede
                ? `${sede.direccion}, ${sede.ciudad}, ${sede.departamento}`
                : "Ubicación no disponible",
            telefono: sede?.telefono || "",
            imagen: datosCancha.imagen || "/images/cancha1.jpg",
            calificacion: datosCancha.calificacion ?? null,
            descripcion:
                datosCancha.descripcion ||
                "Cancha sintética disponible para reservar.",
            servicios: Array.isArray(datosCancha.servicios)
                ? datosCancha.servicios
                : [],
            estado: datosCancha.estado,
            id_sede: datosCancha.id_sede,
            id_tipo: datosCancha.id_tipo,
        };

        return <ReservaCancha cancha={cancha} />;
    } catch (error) {
        console.error("Error al cargar la cancha desde Django:", error);

        throw error;
    }
}
