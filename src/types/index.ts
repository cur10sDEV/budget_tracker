import { currencies } from "@/constants";
import {
  transactionSchema,
  transactionTypeSchema,
} from "@/schemas/transaction";
import { z } from "zod";

export type Currency = (typeof currencies)[0];

export type TransactionType = z.infer<typeof transactionTypeSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;
