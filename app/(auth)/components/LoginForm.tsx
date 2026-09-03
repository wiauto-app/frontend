"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInFormContent } from "@/components/auth/signInFormContent";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";

const LoginFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();

  const redirectParam = searchParams.get("redirect");
  const returnTo =
    redirectParam && isValidReturnPath(redirectParam) ? redirectParam : "/";

  const handleSuccess = async () => {
    await refreshUser();
    toast.success("Sesión iniciada correctamente");
    router.refresh();
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Inicia Sesión</h2>
      </div>
      <SignInFormContent
        onSuccess={handleSuccess}
        showTitle={false}
        returnTo={returnTo}
      />
    </>
  );
};

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Inicia Sesión</h2>
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
