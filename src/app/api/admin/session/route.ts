import { NextResponse } from "next/server";
import { authenticate, clearSession, getAdmin, setSession } from "@/lib/auth";

export async function GET() { const admin = await getAdmin(); return NextResponse.json({ admin }, { status: admin ? 200 : 401 }); }
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== "string" || typeof password !== "string") return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    const admin = await authenticate(email, password);
    if (!admin) return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    await setSession(admin.id);
    return NextResponse.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch { return NextResponse.json({ error: "Unable to sign in" }, { status: 500 }); }
}
export async function DELETE() { await clearSession(); return NextResponse.json({ success: true }); }
