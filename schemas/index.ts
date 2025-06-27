import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(1, { message: "Name is required" })),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email("Email must be a valid email address")),
    password: z.optional(
      z.string().min(8, { message: "Password must be at least 8 characters" })
    ),
    confirmNewPassword: z.optional(
      z.string().min(8, { message: "Confirm new password is required" })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["confirmNewPassword"],
    }
  )
  .refine(
    (data) => {
      if (!data.password && data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export const LoginSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a valid email address" })
    .email("Email is required"),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const PasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

export const RegisterSchema = z
  .object({
    email: z
      .string({ invalid_type_error: "Email must be a valid email address" })
      .email("Email is required"),
    password: z.string().min(8, { message: "Minimum 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Minimum 8 characters" }),
    name: z.string().min(1, { message: "Name is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

export const ResetSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a valid email address" })
    .email("Email is required"),
});
