import { redirect } from "next/navigation";
import { AdminDeleteRequestButton } from "../../components/AdminDeleteRequestButton";
import { AdminSignOutButton } from "../../components/AdminSignOutButton";
import { AdminStatusSelect } from "../../components/AdminStatusSelect";
import { verifyAdminSession } from "../../lib/auth/session";
import { getAdminDb, isFirebaseAdminConfigured } from "../../lib/firebase/admin";
import { formatPhoneNumber } from "../../lib/phone";

export const dynamic = "force-dynamic";

async function getBetaRequests() {
  if (!isFirebaseAdminConfigured()) {
    return { configured: false, entries: [] };
  }

  const snap = await getAdminDb()
    .collection("betaRequests")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  const entries = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: formatPhoneNumber(data.phone),
      userType: data.userType ?? "",
      status: data.status ?? "new",
      createdAt: data.createdAt?.toDate?.().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Denver",
        timeZoneName: "short",
      }) ?? "Pending",
    };
  });

  return { configured: true, entries };
}

export default async function AdminPage() {
  const session = await verifyAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { configured, entries } = await getBetaRequests();

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <a className="admin-brand" href="/">
              <img src="/clearoutcome-wordmark.png" alt="ClearOutcome" />
            </a>
            <div className="admin-title-row">
              <p className="eyebrow">Admin</p>
            </div>
          </div>
          <AdminSignOutButton />
        </header>

        {!configured ? (
          <div className="admin-empty">
            Firebase is not configured yet. Add the Firebase environment variables in
            Vercel to save and view beta requests.
          </div>
        ) : entries.length === 0 ? (
          <div className="admin-empty">No beta requests yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>User type</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th className="admin-actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const requesterName = `${entry.firstName} ${entry.lastName}`.trim();

                  return (
                    <tr key={entry.id}>
                      <td>
                        {entry.firstName} {entry.lastName}
                      </td>
                      <td>
                        <a href={`mailto:${entry.email}`}>{entry.email}</a>
                      </td>
                      <td>{entry.phone || "-"}</td>
                      <td>{entry.userType}</td>
                      <td>
                        <AdminStatusSelect requestId={entry.id} status={entry.status} />
                      </td>
                      <td>{entry.createdAt}</td>
                      <td className="admin-actions-cell">
                        <AdminDeleteRequestButton
                          requestId={entry.id}
                          requesterName={requesterName}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
