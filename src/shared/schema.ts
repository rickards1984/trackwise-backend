import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tenants table for multi-tenant support
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  ukprn: text("ukprn"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true),
});

// User-Tenant relationship table
export const userTenants = pgTable("user_tenants", {
  userId: integer("user_id").notNull().references(() => users.id),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  role: text("role").notNull(),
});

// Insert schemas for validation
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  active: true,
});

export const insertUserTenantSchema = createInsertSchema(userTenants);

// Types
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserTenant = z.infer<typeof insertUserTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserTenant = typeof userTenants.$inferSelect;
