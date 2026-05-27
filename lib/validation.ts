import { z } from "zod";

/** Contact form schema */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z.string().email("Invalid email address"),
  business: z
    .string()
    .max(100, "Business name must be 100 characters or fewer")
    .optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be 2000 characters or fewer"),
});

/** Checkout schema */
export const checkoutSchema = z.object({
  plan: z.enum(["starter", "growth", "autopilot"], {
    message: "Invalid plan selected",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;

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
