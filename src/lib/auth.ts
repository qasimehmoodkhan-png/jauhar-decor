import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

const cookieName = "jauhar_admin_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET || process.env.DATABASE_URL || "local-preview-only-secret");
export const demoEmail = "admin@jauhardecor.com";

export async function authenticate(password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL || demoEmail;
  const configuredPassword = process.env.ADMIN_PASSWORD || "adminjauhar26";
  if (password !== configuredPassword) return null;
  let [admin] = await db.select().from(admins).where(eq(admins.email, configuredEmail.toLowerCase())).limit(1);
  if (!admin) {
    const [created] = await db.insert(admins).values({ email: configuredEmail.toLowerCase(), password: await hash(configuredPassword, 12), name: "Jauhar Admin" }).returning();
    admin = created;
  }
  return admin;
}
export async function setSession(id: string) {
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject(id).setIssuedAt().setExpirationTime("7d").sign(secret);
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getAdmin() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || payload.role !== "admin") return null;
    const [admin] = await db.select({ id: admins.id, email: admins.email, name: admins.name }).from(admins).where(eq(admins.id, payload.sub)).limit(1);
    return admin || null;
  } catch { return null; }
}
export async function clearSession() { (await cookies()).delete(cookieName); }
