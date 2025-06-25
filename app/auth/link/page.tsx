import { auth } from "@/auth";
import { ProviderLinkForm } from "@/components/auth/provider-link-form";

export type Provider = "github" | "google";

interface LinkPageProps {
  searchParams: { [key: string]: Provider | undefined };
}
export default async function LinkAccountPage({ searchParams }: LinkPageProps) {
  const params = await searchParams;
  //   const [isPending, startTransition] = useTransition();
  const provider = params.provider;
  const accountId = params.providerAccountId as string;
  const session = await auth();

  //   // 4) 런타임 체크 & 넓은 타입에서 좁은 타입으로 단언
  //   if (!raw || !isProvider(raw)) {
  //     // provider 파라미터가 없거나 잘못된 값일 때
  //     // 예: 404 페이지로 보내기
  //     router.replace("/404");
  //     return null;
  //   }

  //   const onSubmit = (provider: Provider) => {
  //     if (isPending) return;
  //     startTransition(() => {
  //       linkAction({ provider, providerAccountId });
  //     });
  //   };

  return (
    <ProviderLinkForm
      provider={provider as Provider}
      accountId={accountId}
      email={session?.user.email}
    />
  );
}
