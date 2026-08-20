import AdminSideBar from "@/app/components/admin/AdminSideBar";
import AdminNavBar from "@/app/components/admin/AdminNavBar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSideBar />

      {/* Contenido */}
      <div className="flex-1 flex flex-col">

        <AdminNavBar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}