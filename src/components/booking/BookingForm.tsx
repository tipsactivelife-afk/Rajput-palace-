"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Room } from "@/lib/types";

interface BookingFormProps {
  rooms: Room[];
  defaultRoomSlug?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  [key: string]: string;
}

export function BookingForm({ rooms, defaultRoomSlug }: BookingFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  function validate(formData: FormData): FormErrors {
    const next: FormErrors = {};
    const guestName = String(formData.get("guest_name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const checkIn = String(formData.get("check_in") || "");
    const checkOut = String(formData.get("check_out") || "");

    if (!guestName) next.guest_name = "Please enter your name.";
    if (!phone || !/^[+]?[\d\s-]{7,15}$/.test(phone)) {
      next.phone = "Please enter a valid phone number.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!checkIn) next.check_in = "Please select a check-in date.";
    if (!checkOut) next.check_out = "Please select a check-out date.";
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      next.check_out = "Check-out date must be after check-in date.";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // duplicate-submit protection

    const formData = new FormData(e.currentTarget);
    const validation = validate(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      guest_name: String(formData.get("guest_name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      check_in: String(formData.get("check_in") || ""),
      check_out: String(formData.get("check_out") || ""),
      guests: Number(formData.get("guests") || 1),
      rooms_requested: Number(formData.get("rooms_requested") || 1),
      room_type: String(formData.get("room_type") || ""),
      special_request: String(formData.get("special_request") || ""),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("request_failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or contact us on WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-stone bg-white p-8 text-center">
        <h3 className="font-display text-2xl text-maroon">Request received</h3>
        <p className="mt-3 text-sm text-charcoal-soft max-w-md mx-auto">
          Thank you. Your booking request has been received. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-stone bg-white p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Guest Name" name="guest_name" error={errors.guest_name} required>
          <input name="guest_name" type="text" className={inputClass(!!errors.guest_name)} placeholder="Your full name" />
        </Field>

        <Field label="Phone Number" name="phone" error={errors.phone} required>
          <input name="phone" type="tel" className={inputClass(!!errors.phone)} placeholder="+91 XXXXX XXXXX" />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <input name="email" type="email" className={inputClass(!!errors.email)} placeholder="you@example.com" />
        </Field>

        <Field label="Room Type" name="room_type">
          <select name="room_type" defaultValue={defaultRoomSlug ?? ""} className={inputClass(false)}>
            <option value="">No preference</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Check-in Date" name="check_in" error={errors.check_in} required>
          <input name="check_in" type="date" className={inputClass(!!errors.check_in)} />
        </Field>

        <Field label="Check-out Date" name="check_out" error={errors.check_out} required>
          <input name="check_out" type="date" className={inputClass(!!errors.check_out)} />
        </Field>

        <Field label="Number of Guests" name="guests">
          <input name="guests" type="number" min={1} defaultValue={2} className={inputClass(false)} />
        </Field>

        <Field label="Number of Rooms" name="rooms_requested">
          <input name="rooms_requested" type="number" min={1} defaultValue={1} className={inputClass(false)} />
        </Field>
      </div>

      <Field label="Special Request" name="special_request">
        <textarea
          name="special_request"
          rows={4}
          className={inputClass(false)}
          placeholder="Anything else we should know? (optional)"
        />
      </Field>

      {status === "error" ? (
        <p role="alert" className="text-sm text-maroon bg-stone/50 rounded-lg px-4 py-3">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-maroon px-8 py-3.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Booking Request"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-ivory px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-maroon ${
    hasError ? "border-maroon-soft" : "border-stone"
  }`;
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-label text-charcoal-soft mb-1.5">
        {label} {required ? <span className="text-maroon">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-maroon" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
