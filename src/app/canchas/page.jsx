import HeaderCanchas from "../components/publico/HeaderCanchas";
import ListaCanchas from "../components/publico/ListaCanchas";


export default function CanchasPage() {
    return (
        <main className="min-h-screen bg-[#08111f]">

            {/* Header + Hero */}
            <HeaderCanchas />

            {/* Lista de canchas */}
            <ListaCanchas />

        </main>
    );
}