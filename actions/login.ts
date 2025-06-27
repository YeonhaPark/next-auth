"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getTwoFactorTokenByEmail } from "@/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(existingUser.email, verificationToken.token);
    return { success: "Confirmation email sent!" };
  }
  if (existingUser.isTwoFactorEnabled && existingUser.emailVerified) {
    if (code) {
      // TODO: Verify the two-factor code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid two-factor code." };
      }

      const hasExpired = twoFactorToken.expires < new Date();
      if (hasExpired) {
        return {
          error: "Two-factor code has expired. Please request a new one.",
        };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        // If a confirmation already exists, delete it
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {
      success: "Login successful",
      result,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "An unexpected error occurred. Please try again." };
      }
    }
    throw error;
  }
};
