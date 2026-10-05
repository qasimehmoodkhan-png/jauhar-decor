import { pgTable, text, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";

// These enum identifiers and values already exist in the connected Neon database.
export const projectCategory = pgEnum("Category", ["INTERIOR", "EXTERIOR", "GLASS_WORK", "ALUMINIUM_DOORS_WINDOWS", "HOME_FURNISHING"]);
export const quoteStatus = pgEnum("QuoteStatus", ["NEW", "CONTACTED", "CLOSED"]);

// Map the PRD's Prisma models to their existing, case-sensitive PostgreSQL tables.
export const projects = pgTable("Project", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: projectCategory("category").notNull(),
  description: text("description").notNull().default(""),
  clientName: text("clientName"),
  location: text("location"),
  coverImage: text("coverImage").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  isFeatured: boolean("isFeatured").notNull().default(false),
  isPublished: boolean("isPublished").notNull().default(true),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quotes = pgTable("Quote", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull().default(""),
  status: quoteStatus("status").notNull().default("NEW"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Project = typeof projects.$inferSelect;
