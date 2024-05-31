import { z } from "zod";
import { transactionTypeSchema } from "./transaction";

export const categorySchema = z.object({
  name: z.string().min(3).max(25),
  icon: z.string().max(20),
  type: transactionTypeSchema,
});
