import { MAX_DATE_RANGE_DAYS } from "@/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const dateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(({ from, to }) => {
    const days = differenceInDays(to, from);

    const isValidRange = days <= MAX_DATE_RANGE_DAYS && days >= 0;
    return isValidRange;
  });
