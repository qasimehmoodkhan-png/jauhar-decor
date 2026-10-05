import { db } from "@/db";
import { projects, siteSettings, type Project } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const categories = ["INTERIOR", "EXTERIOR", "GLASS_WORK", "ALUMINIUM_DOORS_WINDOWS", "HOME_FURNISHING"] as const;
export type Category = typeof categories[number];
export const categoryLabels: Record<Category, string> = {
  INTERIOR: "Interior",
  EXTERIOR: "Exterior",
  GLASS_WORK: "Glass Work",
  ALUMINIUM_DOORS_WINDOWS: "Aluminum",
  HOME_FURNISHING: "Furnishing",
};

const permanentImages = {
  residence: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  interior: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
  facade: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  bathroom: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
  studio: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
};

const initialProjects: (typeof projects.$inferInsert)[] = [
  { title: "The Glass House", slug: "the-glass-house", category: "INTERIOR", description: "A seamless dialogue between indoors and out, framed by precision-crafted glass partitions and slimline aluminum profiles.", location: "Private Residence", coverImage: permanentImages.residence, gallery: [permanentImages.residence, permanentImages.interior], isFeatured: true, isPublished: true, completedAt: new Date("2025-10-12") },
  { title: "Axis Workspace", slug: "axis-workspace", category: "GLASS_WORK", description: "A considered commercial environment defined by transparency, light, and beautifully engineered glass divisions.", location: "Commercial Office", coverImage: permanentImages.interior, gallery: [permanentImages.interior, permanentImages.studio], isFeatured: true, isPublished: true, completedAt: new Date("2025-08-25") },
  { title: "The Urban Facade", slug: "the-urban-facade", category: "EXTERIOR", description: "A contemporary glass elevation that brings a distinctive architectural presence to the city skyline.", location: "Commercial Building", coverImage: permanentImages.facade, gallery: [permanentImages.facade], isFeatured: true, isPublished: true, completedAt: new Date("2025-06-18") },
  { title: "Stillwater Suite", slug: "stillwater-suite", category: "GLASS_WORK", description: "Frameless shower glass and refined details transform an everyday ritual into a quiet moment of luxury.", location: "Private Residence", coverImage: permanentImages.bathroom, gallery: [permanentImages.bathroom], isFeatured: false, isPublished: true, completedAt: new Date("2025-04-06") },
  { title: "Form & Function", slug: "form-and-function", category: "ALUMINIUM_DOORS_WINDOWS", description: "Slim-profile aluminum glazing brings natural light and structure to a modern collaborative space.", location: "Commercial Office", coverImage: permanentImages.studio, gallery: [permanentImages.studio, permanentImages.interior], isFeatured: false, isPublished: true, completedAt: new Date("2025-02-14") },
];

export async function getProjects(publishedOnly = true): Promise<Project[]> {
  const [seeded] = await db.select().from(siteSettings).where(eq(siteSettings.key, "initial-projects")).limit(1);
  if (!seeded) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(projects);
    if (count === 0) await db.insert(projects).values(initialProjects).onConflictDoNothing();
    await db.insert(siteSettings).values({ key: "initial-projects", value: "done" }).onConflictDoNothing();
  }
  return publishedOnly
    ? db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.isFeatured), desc(projects.createdAt))
    : db.select().from(projects).orderBy(desc(projects.createdAt));
}
