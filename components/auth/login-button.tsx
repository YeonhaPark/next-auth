"use client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { LoginForm } from "./login-form";
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
    return (
      <Dialog>
        <DialogTitle>
          <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        </DialogTitle>
        <DialogContent>
          <DialogDescription>Log in to your account</DialogDescription>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
