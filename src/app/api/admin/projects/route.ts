import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { getAdmin } from "@/lib/auth";
import { categories, getProjects, type Category } from "@/lib/projects";

export async function GET() {
  if (!await getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ projects: await getProjects(false) });
}
export async function POST(request: Request) {
  if (!await getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const category = String(body.category || "") as Category;
    const coverImage = String(body.coverImage || "").trim();
    if (!title || !categories.includes(category) || !coverImage) return NextResponse.json({ error: "Title, category and cover image are required." }, { status: 400 });
    const slug = `${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
    const [project] = await db.insert(projects).values({ title, slug, category, coverImage, description: String(body.description || ""), clientName: String(body.clientName || "") || null, location: String(body.location || "") || null, gallery: Array.isArray(body.gallery) ? body.gallery.filter((s: unknown) => typeof s === "string") : [], isFeatured: Boolean(body.isFeatured), isPublished: Boolean(body.isPublished), completedAt: body.completedAt ? new Date(body.completedAt) : null }).returning();
    return NextResponse.json({ project }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to create project." }, { status: 500 }); }
}
