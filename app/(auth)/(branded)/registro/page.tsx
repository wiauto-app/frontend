import { Suspense } from "react";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro",
  description: "Regístrate en Wiauto",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-96 w-full animate-pulse rounded-lg bg-gray-100" />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
