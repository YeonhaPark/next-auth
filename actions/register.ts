"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  return { success: "Login successful" };
};
