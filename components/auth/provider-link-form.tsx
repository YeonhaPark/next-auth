"use client";

import { useTransition } from "react";
import { linkAction } from "@/actions/link";
import { Provider } from "@/app/auth/link/page";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
interface ProviderLinkFormProps {
  provider: Provider;
  email: string | null | undefined;
  accountId: string;
}

// Mock function to simulate linking action
export const ProviderLinkForm = ({
  provider,
  accountId,
  email,
}: ProviderLinkFormProps) => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    if (isPending) return;
    startTransition(async () => {
      signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
      await linkAction({ provider, providerAccountId: accountId });
      // Call the link action with the provider
      // linkAction({ provider });
      console.log(`Linking with provider: ${provider}`);
    });
  };

  return (
    <div>
      <h1>추가 계정 연결</h1>
      <p>기존에 {email} 로 가입하셨습니다.</p>
      <p>{provider} 계정을 이 계정에 연결하시겠습니까?</p>
      <form action={async () => onSubmit()}>
        <button type="button" onClick={() => window.history.back()}>
          Go Back
        </button>
        <button type="submit">Yes</button>
        <button></button>
      </form>
    </div>
  );
};
