import { redirect } from "next/navigation";
import { AdminLoginForm } from "../../../components/AdminLoginForm";
import { verifyAdminSession } from "../../../lib/auth/session";

export default async function AdminLoginPage() {
  const session = await verifyAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="admin-page admin-login-page">
      <section className="admin-login-card">
        <a className="admin-brand" href="/">
          <img src="/clearoutcome-wordmark.png" alt="ClearOutcome" />
        </a>
        <p className="eyebrow">Admin</p>
        <h1>Sign in</h1>
        <p className="admin-muted">View ClearOutcome beta user requests.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
