import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/firebase/admin";

const USER_TYPES = new Set(["Lawyer or LPP", "Party", "Affiliate"]);

function clean(value) {
  return String(value ?? "").trim();
}

export async function POST(request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Beta requests are not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const body = await request.json();
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const userType = clean(body.userType);

  if (!firstName || !lastName || !email || !userType) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }
  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!USER_TYPES.has(userType)) {
    return NextResponse.json(
      { error: "Please choose a valid user type." },
      { status: 400 },
    );
  }

  const doc = await getAdminDb().collection("betaRequests").add({
    firstName,
    lastName,
    email,
    phone,
    userType,
    status: "new",
    source: "clearoutcome.com",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, id: doc.id }, { status: 201 });
}
