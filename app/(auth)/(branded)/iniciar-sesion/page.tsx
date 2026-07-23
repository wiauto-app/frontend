import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión en tu cuenta de Wiauto",
};

export default async function Page() {
  return <LoginForm />;
}
