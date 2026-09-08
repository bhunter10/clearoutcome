import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "../../../../lib/auth/session";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../../lib/firebase/admin";

const REQUEST_STATUSES = new Set(["new", "contacted", "approved", "declined"]);

async function getAuthorizedRequestRef(params) {
  if (!isFirebaseAdminConfigured()) {
    return {
      error: NextResponse.json(
        { error: "Beta requests are not configured yet." },
        { status: 503 },
      ),
    };
  }

  const session = await verifyAdminSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { id } = await params;
  if (!id) {
    return {
      error: NextResponse.json({ error: "Missing request id" }, { status: 400 }),
    };
  }

  return {
    ref: getAdminDb().collection("betaRequests").doc(id),
  };
}

export async function PATCH(request, { params }) {
  const { ref, error } = await getAuthorizedRequestRef(params);
  if (error) return error;

  const body = await request.json();
  const status = String(body.status ?? "").trim();

  if (!REQUEST_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid request status" }, { status: 400 });
  }

  await ref.update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const { ref, error } = await getAuthorizedRequestRef(params);
  if (error) return error;

  await ref.delete();

  return NextResponse.json({ ok: true });
}
