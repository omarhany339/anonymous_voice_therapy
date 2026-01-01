import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  anonymousPatients,
  doctorProfiles,
  therapySessions,
  payments,
  intakeResponses,
  consentRecords,
  auditLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Generate a unique anonymous patient ID (3-digit number)
 */
export async function generateAnonymousId(): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let anonymousId: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate random 3-digit number (100-999)
    const randomNum = Math.floor(Math.random() * 900) + 100;
    anonymousId = randomNum.toString();

    // Check if it already exists
    const existing = await db
      .select()
      .from(anonymousPatients)
      .where(eq(anonymousPatients.anonymousId, anonymousId))
      .limit(1);

    isUnique = existing.length === 0;
  }

  return anonymousId!;
}

/**
 * Create or get anonymous patient
 */
export async function createOrGetAnonymousPatient(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if patient already exists
  const existing = await db
    .select()
    .from(anonymousPatients)
    .where(eq(anonymousPatients.phoneNumber, phoneNumber))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new patient
  const anonymousId = await generateAnonymousId();
  await db.insert(anonymousPatients).values({
    anonymousId,
    phoneNumber,
  });

  // Retrieve the created patient
  const created = await db
    .select()
    .from(anonymousPatients)
    .where(eq(anonymousPatients.phoneNumber, phoneNumber))
    .limit(1);

  if (created.length === 0) {
    throw new Error("Failed to create anonymous patient");
  }

  return created[0];
}

/**
 * Get therapy sessions for a patient
 */
export async function getPatientSessions(patientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(therapySessions)
    .where(eq(therapySessions.patientId, patientId));
}

/**
 * Get therapy sessions for a doctor
 */
export async function getDoctorSessions(doctorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(therapySessions)
    .where(eq(therapySessions.doctorId, doctorId));
}

/**
 * Get doctor profile by user ID
 */
export async function getDoctorProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all active doctors
 */
export async function getActiveDoctors() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.isActive, true));
}

/**
 * Check if patient has used free session
 */
export async function hasPatientUsedFreeSession(patientId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const patient = await db
    .select()
    .from(anonymousPatients)
    .where(eq(anonymousPatients.id, patientId))
    .limit(1);

  return patient.length > 0 ? patient[0].hasUsedFreeSession : false;
}

/**
 * Mark free session as used
 */
export async function markFreeSessionAsUsed(patientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(anonymousPatients)
    .set({ hasUsedFreeSession: true })
    .where(eq(anonymousPatients.id, patientId));
}

/**
 * Get intake responses for a patient
 */
export async function getPatientIntakeResponses(patientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(intakeResponses)
    .where(eq(intakeResponses.patientId, patientId));
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  adminId: number,
  action: string,
  resourceType: string,
  resourceId?: number,
  details?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(auditLog).values({
    adminId,
    action,
    resourceType,
    resourceId,
    details,
  });
}

/**
 * Record consent
 */
export async function recordConsent(
  patientId: number,
  consentType: "recording" | "privacy_policy" | "terms_of_service",
  consentGiven: boolean,
  ipAddress?: string,
  userAgent?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(consentRecords).values({
    patientId,
    consentType,
    consentGiven,
    consentVersion: "1.0",
    ipAddress,
    userAgent,
  });
}
