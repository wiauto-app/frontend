"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInFormContent } from "@/components/auth/signInFormContent";

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSuccess = async () => {
    await refreshUser();
    toast.success("Sesión iniciada correctamente");
    router.push("/");
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
        returnTo="/"
      />
    </>
  );
}
