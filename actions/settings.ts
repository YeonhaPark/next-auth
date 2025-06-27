"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { error } from "console";

export const settingsAction = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const validatedFields = SettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const existingUser = await getUserById(user.id);
  if (!existingUser) {
    return { error: "User not found" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.confirmNewPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== existingUser.email) {
    const existingEmailUser = await getUserById(values.email);
    if (existingEmailUser && existingEmailUser.id !== existingUser.id) {
      return { error: "Email already in use" }; // Ensure email is unique
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent" };
  }

  if (values.password && values.confirmNewPassword && existingUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    );
    if (!passwordMatch) return { error: "Current password is incorrect" };

    const hashedPassword = await bcrypt.hash(values.confirmNewPassword, 10);
    values.password = hashedPassword;
    values.confirmNewPassword = undefined; // confirmNewPassword is not needed in the database
  }

  const updatedUser = await db.user.update({
    where: { id: existingUser.id },
    data: validatedFields.data,
  });

  return { success: "Settings updated successfully", user: updatedUser };
};
