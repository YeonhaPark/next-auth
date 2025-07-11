"use server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
export const adminAction = async () => {
  const role = await currentRole();
  if (role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }
  return {
    error: "Forbidden",
  };
};
