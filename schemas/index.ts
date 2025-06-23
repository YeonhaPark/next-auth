import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a valid email address" })
    .email("Email is required"),
  password: z.string().min(1, { message: "Password is required" }),
});
export const RegisterSchema = z
  .object({
    email: z
      .string({ invalid_type_error: "Email must be a valid email address" })
      .email("Email is required"),
    password: z.string().min(8, { message: "Minimum 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Minimum 8 characters" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });
