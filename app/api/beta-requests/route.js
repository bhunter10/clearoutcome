import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "../../../lib/firebase/admin";
import { formatPhoneNumber } from "../../../lib/phone";

const USER_TYPES = new Set(["Lawyer or LPP", "Party", "Affiliate"]);
const NOTIFICATION_TO = "team@clearoutcome.com";

function clean(value) {
  return String(value ?? "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatSubmittedAt(date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
    timeZoneName: "short",
  });
}

async function sendBetaRequestEmail(entry) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Skipping beta request email: missing Resend environment variables.");
    return;
  }

  const submittedAt = formatSubmittedAt(new Date());
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/admin`
    : "https://clearoutcome.com/admin";
  const name = `${entry.firstName} ${entry.lastName}`;
  const phone = entry.phone || "-";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [NOTIFICATION_TO],
      reply_to: entry.email,
      subject: `New ClearOutcome beta request: ${name}`,
      text: [
        "A new ClearOutcome beta request was submitted.",
        "",
        `Name: ${name}`,
        `Email: ${entry.email}`,
        `Phone: ${phone}`,
        `User type: ${entry.userType}`,
        `Submitted: ${submittedAt}`,
        `View it in the admin: ${adminUrl}`,
      ].join("\n"),
      html: `
        <p>A new ClearOutcome beta request was submitted.</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(entry.email)}">${escapeHtml(entry.email)}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>User type:</strong> ${escapeHtml(entry.userType)}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
        <p><a href="${escapeHtml(adminUrl)}">View it in the admin</a></p>
      `,
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Resend email failed: ${message}`);
  }
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
  const phone = formatPhoneNumber(clean(body.phone));
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

  const entry = {
    firstName,
    lastName,
    email,
    phone,
    userType,
    status: "new",
    source: "clearoutcome.com",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const doc = await getAdminDb().collection("betaRequests").add(entry);

  sendBetaRequestEmail(entry).catch((error) => {
    console.error(error);
  });

  return NextResponse.json({ ok: true, id: doc.id }, { status: 201 });
}
