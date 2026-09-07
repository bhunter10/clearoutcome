"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseClientConfig, isFirebaseClientConfigured } from "./config";

let clientApp;

export function getFirebaseClientApp() {
  if (!isFirebaseClientConfigured()) {
    throw new Error("Firebase client is not configured");
  }
  if (!clientApp) {
    clientApp = getApps()[0] ?? initializeApp(firebaseClientConfig);
  }
  return clientApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseClientApp());
}
