import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

const SUSPICIOUS_LOCAL = [
  "test",
  "fake",
  "example",
  "asdf",
  "qwerty",
  "no-reply",
  "noreply",
  "mailinator",
];

const SUSPICIOUS_DOMAINS = [
  "example.com",
  "example.org",
  "test.com",
  "test.test",
  "fake.com",
  "domain.com",
  "email.com",
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "trashmail.com",
];

function validate(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || trimmed.length > 254) {
    return "Please enter an email address.";
  }
  if (!EMAIL_RE.test(trimmed)) {
    return `${trimmed} looks fake or invalid, please enter a real email address.`;
  }
  const [local, domain] = trimmed.split("@");
  if (local.length < 2) {
    return `${trimmed} looks fake or invalid, please enter a real email address.`;
  }
  if (SUSPICIOUS_DOMAINS.includes(domain)) {
    return `${trimmed} looks fake or invalid, please enter a real email address.`;
  }
  if (SUSPICIOUS_LOCAL.some((s) => local === s || local.startsWith(s + "."))) {
    return `${trimmed} looks fake or invalid, please enter a real email address.`;
  }
  return null;
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const error = validate(email);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const clean = email.trim().toLowerCase();
  try {
    const existing = await db.subscriber.findUnique({ where: { email: clean } });
    if (!existing) {
      await db.subscriber.create({ data: { email: clean } });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe failed", err);
    return NextResponse.json(
      { error: "Could not subscribe right now. Try again." },
      { status: 500 }
    );
  }
}
