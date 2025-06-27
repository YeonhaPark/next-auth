"use client";

import { logoutAction } from "@/actions/logout";
interface LogoutButtonProps {
  children?: React.ReactNode;
}
export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <span onClick={logoutAction} className="cursor-pointer">
      {children}
    </span>
  );
};
