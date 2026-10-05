import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin } from "@/lib/auth";
import { categories, type Category } from "@/lib/projects";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  if (!await getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const body = await request.json();
    const category = String(body.category || "") as Category;
    const title = String(body.title || "").trim();
    const coverImage = String(body.coverImage || "").trim();
    if (!title || !categories.includes(category) || !coverImage) return NextResponse.json({ error: "Title, category and cover image are required." }, { status: 400 });
    const [project] = await db.update(projects).set({ title, category, coverImage, description: String(body.description || ""), clientName: String(body.clientName || "") || null, location: String(body.location || "") || null, gallery: Array.isArray(body.gallery) ? body.gallery.filter((s: unknown) => typeof s === "string") : [], isFeatured: Boolean(body.isFeatured), isPublished: Boolean(body.isPublished), completedAt: body.completedAt ? new Date(body.completedAt) : null, updatedAt: new Date() }).where(eq(projects.id, id)).returning();
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch { return NextResponse.json({ error: "Unable to update project." }, { status: 500 }); }
}
export async function DELETE(_request: Request, context: Context) {
  if (!await getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ success: true });
}
