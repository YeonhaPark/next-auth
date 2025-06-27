import * as z from "zod";

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
