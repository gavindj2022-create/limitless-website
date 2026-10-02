import { z } from "zod";

export const consultingLeadSchema = z.object({
  source: z.enum(["book", "bella"]),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email address").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1, "Tell us what you need help with").max(2000),
  page: z.string().trim().max(160).regex(/^\//).optional().default("/book"),
  website: z.string().max(500).optional().default(""),
});

export type ConsultingLead = z.infer<typeof consultingLeadSchema>;

const bellaAnswer = z.string().trim().max(500);
const bellaHistoryTurn = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().max(600),
});

export const bellaRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("ask"),
    message: z.string().trim().min(1).max(600),
    page: z.string().max(160).regex(/^\//).optional().default("/"),
    history: z.array(bellaHistoryTurn).max(24).optional(),
  }),
  z.object({
    action: z.literal("audit"),
    page: z.string().max(160).regex(/^\//).optional().default("/"),
    sessionId: z.uuid(),
    answers: z.object({
      businessType: bellaAnswer.optional(),
      timeSink: bellaAnswer.optional(),
      leadHandling: bellaAnswer.optional(),
      currentTools: bellaAnswer.optional(),
    }),
    history: z.array(bellaHistoryTurn).max(24).optional(),
  }),
]);

export type BellaRequest = z.infer<typeof bellaRequestSchema>;

/** Validation result types */
type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationError = {
  success: false;
  errors: Array<{ field: string; message: string }>;
};

type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

/**
 * Validate request data against a Zod schema.
 * Returns typed data on success or structured errors on failure.
 */
export function validateRequest<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));

  return { success: false, errors };
}
