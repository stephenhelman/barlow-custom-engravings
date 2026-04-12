import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  );
}
