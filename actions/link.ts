"use server";
import { type Provider } from "@/app/auth/link/page";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export interface LinkPayload {
  provider: Provider;
  providerAccountId: string;
}

export const linkAction = async ({
  provider,
  providerAccountId,
}: LinkPayload) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  await db.account.create({
    data: {
      userId, // 연동할 기존 유저 ID
      provider,
      type: "oauth",
      providerAccountId,
    },
  });

  return { ok: true };
};
