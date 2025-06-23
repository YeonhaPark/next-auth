"use client";
import { useRouter } from "next/navigation";
interface LoginbuttonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "modal",
  asChild = false,
}: LoginbuttonProps) => {
  const router = useRouter();
  function onClick() {
    router.push("/auth/login");
  }
  if (mode === "modal") {
    return <span>TODO: Implement modal</span>;
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
