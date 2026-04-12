import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin Login — Barlow Custom Engravings" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-text">Barlow Custom Engravings</h1>
          <p className="text-text-muted font-body text-sm mt-1">Admin access</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
