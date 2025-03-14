import { z } from "zod";
import { transactionTypeSchema } from "./transaction";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must contain at least 3 characters" })
    .max(25, { message: "Name must contain at most 25 characters" }),
  icon: z.string().max(20),
  limit: z.coerce.number().min(0).max(100000000).optional(),
  isLimit: z.boolean().default(false),
  type: transactionTypeSchema,
});

export const deleteCategorySchema = z.object({
  name: z.string().min(3).max(25),
  type: transactionTypeSchema,
});
