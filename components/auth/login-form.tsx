"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { loginAction } from "@/actions/login";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setSuccess("");
    setError("");
    if (isPending) return; // Prevent multiple submissions while pending
    // Start a transition to handle the login action
    startTransition(async () => {
      try {
        const data = await loginAction(values);
        console.log("Login action response:", data);
        if (data?.error) {
          form.reset();
          setError(data?.error);
        }
        if (data?.twoFactor) {
          setShowTwoFactor(true);
          return;
        }
        if (data?.success && data?.redirectTo) {
          form.reset();
          setSuccess(data?.success);
          router.push(DEFAULT_LOGIN_REDIRECT);
        }
      } catch (err) {
        console.log("Error during login action:", err);
        setError("An unexpected error occurred. Please try again.");
        // Handle login logic here, e.g., call an API to log in the user
      }
    });
  };
  return (
    <CardWrapper
      headerLabel="welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {!showTwoFactor ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="joh.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        size={"sm"}
                        variant="link"
                        className="px-0 font-normal"
                        asChild
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
