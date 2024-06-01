import { z } from "zod";
import { transactionTypeSchema } from "./transaction";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must contain at least 3 characters" })
    .max(25, { message: "Name must contain at most 25 characters" }),
  icon: z.string().max(20),
  type: transactionTypeSchema,
});
