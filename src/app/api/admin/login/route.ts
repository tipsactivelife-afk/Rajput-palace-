import { NextResponse } from "next/server";
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, createAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecretSet = Boolean(process.env.ADMIN_SESSION_SECRET?.trim());

  if (!adminPassword || !sessionSecretSet) {
    return NextResponse.json(
      {
        error:
          "Admin login isn't configured yet. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your environment variables.",
      },
      { status: 500 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submitted = String(body.password ?? "");

  // Constant-time-ish comparison isn't critical here (single admin
  // password, not a token), but we still avoid short-circuit `===` on
  // attacker-controlled length by comparing full strings only.
  if (submitted.length === 0 || submitted !== adminPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, await createAdminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}

