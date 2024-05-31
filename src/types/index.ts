import { currencies } from "@/constants";
import { categorySchema } from "@/schemas/category";
import {
  transactionSchema,
  transactionTypeSchema,
} from "@/schemas/transaction";
import { z } from "zod";

export type Currency = (typeof currencies)[0];

export type TransactionType = z.infer<typeof transactionTypeSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export type CategorySchema = z.infer<typeof categorySchema>;
