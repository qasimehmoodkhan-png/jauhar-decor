import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const service = String(body.service || "").trim();
    const message = String(body.message || "").trim();
    if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !phone || phone.length > 40 || !service || service.length > 120 || message.length > 5000) {
      return NextResponse.json({ error: "Please provide valid contact details." }, { status: 400 });
    }
    const [quote] = await db.insert(quotes).values({ name, email, phone, service, message }).returning({ id: quotes.id, createdAt: quotes.createdAt });
    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save your quote. Please try again." }, { status: 500 });
  }
}
