import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta de Wiauto",
};

export default async function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container-custom mx-auto my-5 flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
