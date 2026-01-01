import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  createOrGetAnonymousPatient,
  hasPatientUsedFreeSession,
  markFreeSessionAsUsed,
} from "../db";
import { createPaymentSession } from "../paymob";
import { therapySessions, intakeResponses } from "../../drizzle/schema";
import { SESSION_RATE_EGP } from "@shared/constants";
import { TRPCError } from "@trpc/server";

export const bookingRouter = router({
  /**
   * Create or get anonymous patient
   */
  getAnonymousPatient: publicProcedure
    .input(z.object({ phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const patient = await createOrGetAnonymousPatient(input.phoneNumber);
        return {
          anonymousId: patient.anonymousId,
          hasUsedFreeSession: patient.hasUsedFreeSession,
        };
      } catch (error) {
        console.error("[Booking] Failed to create patient:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل في إنشاء الهوية المجهولة",
        });
      }
    }),

  /**
   * Get available doctors
   */
  getAvailableDoctors: publicProcedure.query(async () => {
    try {
      // TODO: Implement doctor availability logic
      // For now, return mock data
      return [
        {
          id: 1,
          name: "د. أحمد محمد",
          specialization: "متخصص في القلق والاكتئاب",
          experience: 5,
          rating: 4.8,
        },
        {
          id: 2,
          name: "د. فاطمة علي",
          specialization: "متخصصة في مشاكل العلاقات",
          experience: 7,
          rating: 4.9,
        },
        {
          id: 3,
          name: "د. محمود حسن",
          specialization: "متخصص في الضغط النفسي",
          experience: 6,
          rating: 4.7,
        },
      ];
    } catch (error) {
      console.error("[Booking] Failed to get doctors:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "فشل في جلب قائمة الأطباء",
      });
    }
  }),

  /**
   * Create payment session for paid session
   */
  createPaymentSession: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
        scheduledAt: z.date(),
        sessionType: z.enum(["free", "paid"]),
        intakeResponses: z.record(z.string(), z.array(z.string())),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if patient has used free session
        if (input.sessionType === "free") {
          const hasUsed = await hasPatientUsedFreeSession(input.patientId);
          if (hasUsed) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "لقد استخدمت الجلسة المجانية بالفعل",
            });
          }
        }

        // Calculate amount in cents (499 EGP = 49900 cents)
        const amountCents = SESSION_RATE_EGP * 100;

        // Create payment session with Paymob
        const paymentSession = await createPaymentSession(
          amountCents,
          "patient@anonymous.local",
          undefined,
          "مريض",
          "مجهول",
          `session_${input.patientId}_${Date.now()}`
        );

        // Store session in database
        await db.insert(therapySessions).values({
          patientId: input.patientId,
          doctorId: input.doctorId,
          sessionType: input.sessionType,
          status: "scheduled",
          scheduledAt: new Date(input.scheduledAt),
          recordingConsent: false,
        });

        return {
          checkoutUrl: paymentSession.checkoutUrl,
          orderId: paymentSession.orderId,
          message: "تم إنشاء جلسة الدفع بنجاح",
        };
      } catch (error) {
        console.error("[Booking] Failed to create payment session:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل في إنشاء جلسة الدفع",
        });
      }
    }),

  /**
   * Book free session
   */
  bookFreeSession: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
        scheduledAt: z.date(),
        intakeResponses: z.record(z.string(), z.array(z.string())),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if patient has used free session
        const hasUsed = await hasPatientUsedFreeSession(input.patientId);
        if (hasUsed) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "لقد استخدمت الجلسة المجانية بالفعل",
          });
        }

        // Create session
        await db.insert(therapySessions).values({
          patientId: input.patientId,
          doctorId: input.doctorId,
          sessionType: "free",
          status: "scheduled",
          scheduledAt: new Date(input.scheduledAt),
          recordingConsent: false,
        });

        // Mark free session as used
        await markFreeSessionAsUsed(input.patientId);

        return {
          message: "تم حجز الجلسة المجانية بنجاح",
        };
      } catch (error) {
        console.error("[Booking] Failed to book free session:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل في حجز الجلسة",
        });
      }
    }),
});
