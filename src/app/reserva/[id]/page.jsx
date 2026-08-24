import { notFound } from "next/navigation";
import ReservaCancha from "@/app/components/publico/ReservaCancha";
import canchas from "@/data/canchas";

export default async function Page({ params }) {

    const { id } = await params;

    const cancha = canchas.find((c) => c.id === Number(id));

    if (!cancha) {
        notFound();
    }

    return <ReservaCancha cancha={cancha} />;
}