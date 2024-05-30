import { currencies } from "@/constants";
import { z } from "zod";

export const userSettingsSchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`Invalid currency: ${value}`);
    }

    return found;
  }),
});
