import { z } from "zod";

export const validator = (schema: z.Schema, values: z.infer<z.Schema>) => {
  const { success, data } = schema.safeParse(values);

  if (!success) {
    throw new Error("Invalid fields");
  }

  return { data };
};
