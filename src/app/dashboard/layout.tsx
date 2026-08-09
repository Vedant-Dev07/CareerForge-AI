import Sidebar from "@/components/dashboard/sidebar";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
