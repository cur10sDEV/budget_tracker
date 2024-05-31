import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense"]);

export const transactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().max(255).optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: transactionTypeSchema,
});
