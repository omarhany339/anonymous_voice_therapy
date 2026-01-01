/**
 * Application constants
 */

export const SESSION_DURATION_MINUTES = 45;
export const SESSION_RATE_EGP = 499;
export const CURRENCY = "EGP";

export const FREE_SESSION_LIMIT = 1; // One free session per patient
export const RECORDING_RETENTION_DAYS = 90;

export const SESSION_BUFFER_MINUTES = 15; // Buffer between sessions

export const INTAKE_QUESTION_CATEGORIES = {
  PROBLEM_TYPE: "problem_type",
  DURATION: "duration",
  URGENCY: "urgency",
  DIAGNOSIS: "diagnosis",
  MEDICATIONS: "medications",
} as const;

export const PROBLEM_TYPES = [
  { id: "anxiety", label: "قلق" },
  { id: "depression", label: "اكتئاب" },
  { id: "stress", label: "ضغط نفسي" },
  { id: "relationships", label: "مشاكل علاقات" },
  { id: "work", label: "مشاكل عمل" },
  { id: "family", label: "مشاكل عائلية" },
  { id: "sleep", label: "مشاكل النوم" },
  { id: "other", label: "أخرى" },
];

export const DURATION_OPTIONS = [
  { id: "less_than_month", label: "أقل من شهر" },
  { id: "1_3_months", label: "من شهر إلى 3 أشهر" },
  { id: "3_6_months", label: "من 3 إلى 6 أشهر" },
  { id: "6_12_months", label: "من 6 إلى 12 شهر" },
  { id: "more_than_year", label: "أكثر من سنة" },
];

export const URGENCY_OPTIONS = [
  { id: "low", label: "منخفضة" },
  { id: "medium", label: "متوسطة" },
  { id: "high", label: "عالية" },
  { id: "urgent", label: "طارئة جداً" },
];

export const PREVIOUS_DIAGNOSIS_OPTIONS = [
  { id: "none", label: "لا توجد تشخيصات سابقة" },
  { id: "anxiety_disorder", label: "اضطراب القلق" },
  { id: "depression_disorder", label: "اضطراب الاكتئاب" },
  { id: "bipolar", label: "الاضطراب ثنائي القطب" },
  { id: "ptsd", label: "اضطراب الإجهاد اللاحق للصدمة" },
  { id: "ocd", label: "الوسواس القهري" },
  { id: "other", label: "أخرى" },
];

export const MEDICATIONS_OPTIONS = [
  { id: "none", label: "لا أتناول أي أدوية" },
  { id: "antidepressants", label: "مضادات الاكتئاب" },
  { id: "anxiolytics", label: "مهدئات" },
  { id: "antipsychotics", label: "مضادات الذهان" },
  { id: "mood_stabilizers", label: "مثبتات المزاج" },
  { id: "other", label: "أدوية أخرى" },
];

export const CONSENT_TYPES = {
  RECORDING: "recording",
  PRIVACY_POLICY: "privacy_policy",
  TERMS_OF_SERVICE: "terms_of_service",
} as const;

export const ERROR_MESSAGES = {
  INVALID_PHONE: "رقم الهاتف غير صحيح",
  PATIENT_NOT_FOUND: "المريض غير موجود",
  DOCTOR_NOT_FOUND: "الطبيب غير موجود",
  SESSION_NOT_FOUND: "الجلسة غير موجودة",
  PAYMENT_FAILED: "فشل الدفع",
  UNAUTHORIZED: "غير مصرح",
  FORBIDDEN: "ممنوع",
  INTERNAL_ERROR: "خطأ داخلي",
} as const;

export const SUCCESS_MESSAGES = {
  SESSION_BOOKED: "تم حجز الجلسة بنجاح",
  PAYMENT_COMPLETED: "تم الدفع بنجاح",
  SESSION_COMPLETED: "تمت الجلسة بنجاح",
  NOTES_SAVED: "تم حفظ الملاحظات",
} as const;
