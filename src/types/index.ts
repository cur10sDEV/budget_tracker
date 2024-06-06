import { currencies } from "@/constants";
import TransactionService from "@/data/transactionService";
import { categorySchema } from "@/schemas/category";
import { dateRangeSchema } from "@/schemas/date";
import {
  transactionSchema,
  transactionTypeSchema,
} from "@/schemas/transaction";
import { z } from "zod";

export type Currency = (typeof currencies)[0];

export type TransactionType = z.infer<typeof transactionTypeSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export type CategorySchema = z.infer<typeof categorySchema>;

export type DateRangeSchema = z.infer<typeof dateRangeSchema>;

export type GetUserCategoryStats = Awaited<
  ReturnType<typeof TransactionService.getUserCategoryStats>
>;
