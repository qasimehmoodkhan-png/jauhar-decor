import type { Metadata } from "next";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdmin } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import AdminClient, { AdminLogin } from "@/components/AdminClient";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Studio", robots: { index: false, follow: false } };
export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) return <AdminLogin demo={!process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD}/>;
  const [projects, leads] = await Promise.all([getProjects(false), db.select().from(quotes).orderBy(desc(quotes.createdAt))]);
  return <AdminClient initialProjects={projects} initialQuotes={leads} name={admin.name}/>;
}
