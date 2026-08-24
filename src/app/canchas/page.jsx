import Footer from "../components/publico/Footer";
import ListaCanchas from "../components/publico/ListaCanchas";


export default function CanchasPage() {
    return (
        <main className="min-h-screen bg-[#08111f]">

            
           

            {/* Lista de canchas */}
            <ListaCanchas />
            <Footer/>

        </main>
    );
}