import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdmin } from "@/lib/auth";

export async function GET() {
  if (!await getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ quotes: await db.select().from(quotes).orderBy(desc(quotes.createdAt)) });
}
