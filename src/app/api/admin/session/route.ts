import { NextResponse } from "next/server";
import { authenticate, clearSession, getAdmin, setSession } from "@/lib/auth";

export async function GET() { const admin = await getAdmin(); return NextResponse.json({ admin }, { status: admin ? 200 : 401 }); }
export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string") return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    const admin = await authenticate(password);
    if (!admin) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    await setSession(admin.id);
    return NextResponse.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch { return NextResponse.json({ error: "Unable to sign in" }, { status: 500 }); }
}
export async function DELETE() { await clearSession(); return NextResponse.json({ success: true }); }
