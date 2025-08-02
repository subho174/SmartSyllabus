"use client";

import { signIn } from "next-auth/react";
import { useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, Card, CardBody, CardHeader, cn, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInSchemaType } from "../schemas/signInSchema";
import SignInButtons from "./SignInButtons";
import HomeLink from "./HomeLink";

export function SignInForm({
  errorMessage,
  ...props
}: {
  errorMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const logIn = async (data: signInSchemaType) => {
    startTransition(async () => {
      await signIn("credentials", {
        callbackUrl: "/chat",
        ...data,
        isLoggingIn: true,
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card>
        <CardHeader className="text-center">
          <p className="text-xl text-white">Welcome back</p>
        </CardHeader>
        <CardBody>
          <SignInButtons />
          <form onSubmit={form.handleSubmit(logIn)}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-[#1f1f1f] px-2 text-white">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <Controller
                  control={form.control}
                  name="email"
                  render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <Input
                      ref={ref}
                      isRequired
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      label="Email"
                      name={name}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                  rules={{ required: "Email is required." }}
                />

                <Controller
                  control={form.control}
                  name="password"
                  render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <Input
                      ref={ref}
                      isRequired
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      label="Password"
                      name={name}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                  rules={{ required: "Password is required." }}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isDisabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? "Authenticating..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-white text-sm">
                Don't have an account ?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium underline underline-offset-4 text-[#fbaf03]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <HomeLink />
        </CardBody>
      </Card>
    </div>
  );
}
