import { z } from "zod";

export const bookServices = {
  bella: "Bella receptionist agent",
  website: "Agent-powered website",
  system: "Full presence system",
} as const;

export type BookServiceKey = keyof typeof bookServices;

export const bookLeadSchema = z.object({
  service: z.enum(["bella", "website", "system"]),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(160),
  phone: z.string().trim().max(40).optional(),
  business: z.string().trim().max(160).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
  website: z.string().max(500).optional().default(""),
});

export type BookLead = z.infer<typeof bookLeadSchema>;

export function parseBookLead(body: unknown) {
  return bookLeadSchema.safeParse(body);
}
