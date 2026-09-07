import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let serviceAccount;
let adminApp;

export function isFirebaseAdminConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function parseServiceAccount() {
  if (serviceAccount) return serviceAccount;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT");
  }
  serviceAccount = JSON.parse(raw);
  return serviceAccount;
}

export function getAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }
  if (!adminApp) {
    adminApp =
      getApps()[0] ??
      initializeApp({
        credential: cert(parseServiceAccount()),
      });
  }
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
