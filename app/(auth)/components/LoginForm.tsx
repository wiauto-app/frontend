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
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl">
        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-blue-700 lg:flex lg:w-[37.4%]">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-800" />
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-white/5" />
          <div className="relative z-10 px-8 text-center">
            <div className="mb-8 w-fit rounded-lg bg-blue-700 px-4 py-2 text-start">
              <span className="text-7xl font-bold tracking-tighter text-white">
                W
              </span>
            </div>

            <h1 className="mb-4 text-start text-3xl leading-tight font-bold text-white">
              Encuentra o vende
              <br />
              tu próximo coche
              <br />
              hoy!
            </h1>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white p-8 lg:flex-1">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Inicia Sesión</h2>
            </div>

            <SignInFormContent
              onSuccess={handleSuccess}
              showTitle={false}
              returnTo="/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
