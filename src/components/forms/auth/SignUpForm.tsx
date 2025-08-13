"use client";

import { signIn } from "next-auth/react";
import { useEffect, useTransition } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, cn, Input } from "@heroui/react";
import { SignUpButtons } from "./SignUpButtons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpSchemaType } from "../../../schemas/signUpSchema";
import HomeLink from "../../HomeLink";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignUpForm({
  errorMessage,
  ...props
}: {
  errorMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signUp = (data: signUpSchemaType) => {
    startTransition(async () => {
      const res = await signIn("credentials", {
        callbackUrl: "/dashboard",
        ...data,
        isLoggingIn: false,
        redirect: false,
      });

      if (res.error) toast.error(res.code);
      else if (res?.url) router.replace("/dashboard");

    });
  };

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  return (
    <div className={cn("flex flex-col gap-6")} {...props}>
      <Card>
        <CardHeader className="text-center">
          <p className="text-xl text-white">Create an Account</p>
        </CardHeader>
        <CardBody>
          <SignUpButtons />
          <form onSubmit={form.handleSubmit(signUp)}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-[#1f1f1f] px-2 text-white">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <Controller
                  control={form.control}
                  name="username"
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
                      label="Username"
                      name={name}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                  rules={{ required: "Username is required." }}
                />
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
                      type="password"
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
                  //   variant="custom"
                  isLoading={isPending}
                  isDisabled={isPending}
                >
                  {isPending ? "Just a moment..." : "Sign Up"}
                </Button>
              </div>
              <div className="text-center text-sm text-white">
                Already have an account ?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium underline underline-offset-4 text-[#fbaf03]"
                >
                  LogIn
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
