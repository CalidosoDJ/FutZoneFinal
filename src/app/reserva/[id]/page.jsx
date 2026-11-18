
import { notFound } from "next/navigation";
import ReservaCancha from "@/app/components/publico/ReservaCancha";

export const dynamic = "force-dynamic";

const API = "http://127.0.0.1:8000";

export default async function Page({ params }) {
    const { id } = await params;
    const idCancha = Number(id);

    if (!Number.isInteger(idCancha) || idCancha <= 0) {
        notFound();
    }

    try {
        const [respuestaCanchas, respuestaSedes] = await Promise.all([
            fetch(`${API}/api/canchas/`, { cache: "no-store" }),
            fetch(`${API}/api/sedes/`, { cache: "no-store" }),
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

        // Utilizar el mismo campo de imagen de ListaCanchas.jsx
        const rutaImagen =
            datosCancha.imagen_url || datosCancha.imagen || "";

        const imagen = rutaImagen
            ? rutaImagen.startsWith("http")
                ? rutaImagen
                : `${API}/media/${rutaImagen
                    .replace(/^\/?media\//, "")
                    .replace(/^\//, "")}`
            : "/images/cancha1.jpg";

        const cancha = {
            id: Number(datosCancha.id_cancha),
            nombre: datosCancha.nombre,
            precio: Number(datosCancha.precio_hora),
            zona: datosCancha.zona || "Cancha sintética",
            direccion: sede
                ? `${sede.direccion}, ${sede.ciudad}, ${sede.departamento}`
                : "Ubicación no disponible",
            telefono: sede?.telefono || "",
            imagen,
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

        console.log("CANCHA SELECCIONADA:", {
            id: cancha.id,
            nombre: cancha.nombre,
            imagen: cancha.imagen,
        });

        return <ReservaCancha cancha={cancha} />;
    } catch (error) {
        console.error("Error al cargar la cancha desde Django:", error);
        throw error;
    }
}
