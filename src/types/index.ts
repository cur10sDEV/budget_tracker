import { currencies } from "@/constants";
import MonthHistoryService from "@/data/monthHistoryService";
import TransactionService from "@/data/transactionService";
import { categorySchema } from "@/schemas/category";
import { dateRangeSchema } from "@/schemas/date";
import { queryHistoryDataSchema } from "@/schemas/history";
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

export type QueryHistoryData = z.infer<typeof queryHistoryDataSchema>;

export type GetUserCategoryStats = Awaited<
  ReturnType<typeof TransactionService.getUserCategoryStats>
>;

export type Timeframe = "month" | "year";

export type Period = { month: number; year: number };

export type GetMonthHistoryPeriods = Awaited<
  ReturnType<typeof MonthHistoryService.getHistoryPeriods>
>;

export type HistoryData = {
  income: number;
  expense: number;
  year: number;
  month: number;
  day?: number;
};
