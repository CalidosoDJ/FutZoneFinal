import NotificacionesJugador from "../components/publico/NotificacionesJugador";
import DashboardNavbar from "../components/usuario/DashboardNavBar";


export default function Page() {
    return (
        <>
            <DashboardNavbar />
            <div className="min-h-screen bg-slate-100 py-10">


                <div className="max-w-7xl mx-auto px-8">


                    <NotificacionesJugador />

                </div>

            </div>
        </>
    );
}