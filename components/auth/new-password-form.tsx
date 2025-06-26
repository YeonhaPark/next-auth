"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { PasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "../form-error";
import { Input } from "../ui/input";
import { FormSuccess } from "../form-success";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormField,
} from "../ui/form";
import { newPasswordAction } from "@/actions/new-password";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const token = searchParams.get("token");

  const onSubmit = useCallback(
    async (values: z.infer<typeof PasswordSchema>) => {
      if (success || error) return; // in dev mode, this prevents multiple submissions

      if (!token) {
        setError("Token is required");
        return;
      }

      startTransition(() => {
        newPasswordAction(values, token)
          .then((data) => {
            setSuccess(data.success);
            setError(data.error);
          })
          .catch(() => {
            setError("Something went wrong, please try again later.");
          });
      });
    },
    [token, success, error]
  );

  return (
    <CardWrapper
      headerLabel="Set a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Confirmation</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={isPending} type="submit" className="w-full">
            Set New Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
