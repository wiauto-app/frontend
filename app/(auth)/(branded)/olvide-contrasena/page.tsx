import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olvide contraseña",
  description: "Recupera tu contraseña en Wiauto",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
