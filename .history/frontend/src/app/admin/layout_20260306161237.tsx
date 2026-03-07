import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <div className="flex flex-col flex-1">

        <AdminNavbar />

        <main className="flex-1 bg-gray-100 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}