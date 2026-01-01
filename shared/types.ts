/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * Application-specific types
 */

export type UserRole = "user" | "admin" | "doctor";

export type SessionType = "free" | "paid";

export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type ConsentType = "recording" | "privacy_policy" | "terms_of_service";

export type QuestionType = "single_choice" | "multi_select";

export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export interface IntakeQuestionOption {
  id: string;
  label: string;
}

export interface IntakeQuestionData {
  id: number;
  questionText: string;
  questionType: QuestionType;
  options: IntakeQuestionOption[];
  category: string;
  order: number;
}

export interface SessionBookingData {
  doctorId: number;
  sessionType: SessionType;
  scheduledAt: Date;
  intakeResponses: Record<number, string[]>;
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface SessionNotesData {
  notes: string;
  diagnosis?: string;
  followUpPoints?: string;
}

export interface AIGeneratedContent {
  summary: string;
  diagnosis: string;
  followUpPoints: string;
}

export interface RecordingConfig {
  enabled: boolean;
  consentGiven: boolean;
  retentionDays: number;
}

export interface PaymentConfig {
  sessionRate: number; // 499 EGP
  currency: string; // "EGP"
}
