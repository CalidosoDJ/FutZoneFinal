import DashboardNavbar from "@/app/components/usuario/DashboardNavBar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">

            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

        </div>
    );
}