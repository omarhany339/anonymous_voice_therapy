import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  longtext,
  json,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "doctor"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Anonymous Patient Profile
 * Stores minimal information with anonymous ID
 */
export const anonymousPatients = mysqlTable("anonymous_patients", {
  id: int("id").autoincrement().primaryKey(),
  anonymousId: varchar("anonymousId", { length: 10 }).notNull().unique(), // e.g., "703"
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull().unique(), // Encrypted
  hasUsedFreeSession: boolean("hasUsedFreeSession").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnonymousPatient = typeof anonymousPatients.$inferSelect;
export type InsertAnonymousPatient = typeof anonymousPatients.$inferInsert;

/**
 * Doctor Profile
 * Extended user information for doctors
 */
export const doctorProfiles = mysqlTable("doctor_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).notNull().unique(),
  bio: text("bio"),
  isActive: boolean("isActive").default(true).notNull(),
  sessionRate: decimal("sessionRate", { precision: 10, scale: 2 }).notNull(), // 499 EGP
  availableSlots: json("availableSlots"), // Store availability schedule
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DoctorProfile = typeof doctorProfiles.$inferSelect;
export type InsertDoctorProfile = typeof doctorProfiles.$inferInsert;

/**
 * Intake Questions Template
 * Define the questions shown to patients before booking
 */
export const intakeQuestions = mysqlTable("intake_questions", {
  id: int("id").autoincrement().primaryKey(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", ["single_choice", "multi_select"]).notNull(),
  options: json("options").notNull(), // Array of { id, label }
  category: varchar("category", { length: 100 }).notNull(), // e.g., "problem_type", "duration", "urgency"
  order: int("order").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntakeQuestion = typeof intakeQuestions.$inferSelect;
export type InsertIntakeQuestion = typeof intakeQuestions.$inferInsert;

/**
 * Patient Intake Responses
 * Store patient answers to intake questions
 */
export const intakeResponses = mysqlTable("intake_responses", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  questionId: int("questionId").notNull(),
  selectedOptions: json("selectedOptions").notNull(), // Array of selected option IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntakeResponse = typeof intakeResponses.$inferSelect;
export type InsertIntakeResponse = typeof intakeResponses.$inferInsert;

/**
 * Therapy Sessions
 * Store session information and metadata
 */
export const therapySessions = mysqlTable("therapy_sessions", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  sessionType: mysqlEnum("sessionType", ["free", "paid"]).notNull(),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  scheduledAt: datetime("scheduledAt").notNull(),
  startedAt: datetime("startedAt"),
  endedAt: datetime("endedAt"),
  duration: int("duration"), // in seconds
  sessionNotes: longtext("sessionNotes"),
  recordingConsent: boolean("recordingConsent").default(false).notNull(),
  recordingUrl: varchar("recordingUrl", { length: 500 }),
  recordingKey: varchar("recordingKey", { length: 500 }), // S3 key for recording
  aiSummary: longtext("aiSummary"),
  diagnosis: text("diagnosis"),
  followUpPoints: longtext("followUpPoints"),
  doctorReviewedAiSummary: boolean("doctorReviewedAiSummary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TherapySession = typeof therapySessions.$inferSelect;
export type InsertTherapySession = typeof therapySessions.$inferInsert;

/**
 * Payments
 * Track payment transactions
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().unique(),
  patientId: int("patientId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EGP").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  stripeChargeId: varchar("stripeChargeId", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Session Recordings Metadata
 * Track recording information and retention
 */
export const recordingMetadata = mysqlTable("recording_metadata", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().unique(),
  recordingKey: varchar("recordingKey", { length: 500 }).notNull(),
  recordingUrl: varchar("recordingUrl", { length: 500 }).notNull(),
  fileSize: int("fileSize"), // in bytes
  duration: int("duration"), // in seconds
  encryptionKey: text("encryptionKey"), // Encrypted encryption key
  retentionDays: int("retentionDays").default(90).notNull(),
  deleteScheduledAt: datetime("deleteScheduledAt"),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecordingMetadata = typeof recordingMetadata.$inferSelect;
export type InsertRecordingMetadata = typeof recordingMetadata.$inferInsert;

/**
 * Consent Records
 * Track all consent agreements
 */
export const consentRecords = mysqlTable("consent_records", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  consentType: mysqlEnum("consentType", ["recording", "privacy_policy", "terms_of_service"]).notNull(),
  consentGiven: boolean("consentGiven").notNull(),
  consentVersion: varchar("consentVersion", { length: 20 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConsentRecord = typeof consentRecords.$inferSelect;
export type InsertConsentRecord = typeof consentRecords.$inferInsert;

/**
 * Admin Audit Log
 * Track admin actions for security and compliance
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  resourceType: varchar("resourceType", { length: 100 }).notNull(),
  resourceId: int("resourceId"),
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

/**
 * Support Tickets / Complaints
 * Track user complaints and support requests
 */
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId"),
  doctorId: int("doctorId"),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: longtext("description").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;
