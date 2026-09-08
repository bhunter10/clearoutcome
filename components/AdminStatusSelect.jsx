"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

export function AdminStatusSelect({ requestId, status }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, setPending] = useState(false);

  async function onChange(event) {
    const nextStatus = event.target.value;
    const previousStatus = value;

    setValue(nextStatus);
    setPending(true);

    try {
      const res = await fetch(`/api/beta-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        setValue(previousStatus);
        window.alert("Could not update the status. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setValue(previousStatus);
      window.alert("Could not update the status. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="admin-status-wrap">
      <select
        className={`admin-status-select admin-status-${value}`}
        value={value}
        onChange={onChange}
        disabled={pending}
        aria-label="Request status"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
