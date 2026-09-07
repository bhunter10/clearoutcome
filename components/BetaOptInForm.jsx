"use client";

import { useState } from "react";
import { formatPhoneNumber } from "../lib/phone";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  userType: "",
};

export function BetaOptInForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/beta-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: body.error ?? "Could not submit the request.",
        });
        return;
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: "Request received. Thank you for your interest in ClearOutcome.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Could not submit the request. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="opt-in-panel" onSubmit={onSubmit}>
      <div className="form-heading">
        <p className="eyebrow">Beta access</p>
        <h2>Request beta user status</h2>
      </div>

      <div className="form-grid">
        <label>
          <span>First name</span>
          <input
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={updateField}
            required
          />
        </label>
        <label>
          <span>Last name</span>
          <input
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={updateField}
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>
        <label>
          <span>
            Phone <em>optional</em>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={14}
            placeholder="(801) 802-2222"
            value={form.phone}
            onChange={updateField}
          />
        </label>
      </div>

      <fieldset>
        <legend>What kind of user are you?</legend>
        <div className="radio-row">
          {["Lawyer or LPP", "Party", "Affiliate"].map((userType) => (
            <label key={userType}>
              <input
                type="radio"
                name="userType"
                value={userType}
                checked={form.userType === userType}
                onChange={updateField}
                required
              />
              <span className="choice-dot" aria-hidden="true" />
              <span className="choice-text">{userType}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Opt in"}
      </button>
      <p
        className={`form-note ${status.type === "error" ? "form-error" : ""} ${
          status.type === "success" ? "form-success" : ""
        }`}
        role="status"
        aria-live="polite"
      >
        {status.message || "Your request will be saved for the ClearOutcome team."}
      </p>
    </form>
  );
}
