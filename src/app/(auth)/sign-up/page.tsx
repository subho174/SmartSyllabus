import { SignUpForm } from "@/src/components/forms/auth/SignUpForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) {
  const errorMessage = (await searchParams).code;

  return (
    <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm errorMessage={errorMessage} />
      </div>
    </div>
  );
}
