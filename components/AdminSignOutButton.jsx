"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "../lib/firebase/client-app";
import { isFirebaseClientConfigured } from "../lib/firebase/config";

export function AdminSignOutButton() {
  const router = useRouter();

  async function onClick() {
    try {
      if (isFirebaseClientConfigured()) {
        await signOut(getFirebaseAuth());
      }
    } finally {
      await fetch("/api/admin/session", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button className="admin-sign-out" type="button" onClick={onClick}>
      Sign out
    </button>
  );
}
