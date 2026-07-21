import { Suspense } from "react";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro",
  description: "Regístrate en Wiauto",
};

export default function Page() {
  return (
    <div className="min-h-screen ">
      <div className="container-custom mx-auto flex justify-center">
        <Suspense
          fallback={
            <div className="flex min-h-screen w-full items-center justify-center p-4">
              <div className="h-96 w-full max-w-5xl animate-pulse rounded-2xl bg-white" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
