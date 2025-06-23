"use client";

import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

export const Social = () => {
  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size={"lg"}
        className="flex-1"
        variant={"outline"}
        onClick={() => alert("Google Sign In")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="flex-1"
        variant={"outline"}
        onClick={() => alert("Google Sign In")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
