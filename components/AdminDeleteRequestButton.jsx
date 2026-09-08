"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminDeleteRequestButton({ requestId, requesterName }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    const label = requesterName || "this request";
    const confirmed = window.confirm(`Delete ${label}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`/api/beta-requests/${requestId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        window.alert("Could not delete the request. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not delete the request. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className="admin-delete-button"
      type="button"
      onClick={onDelete}
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
