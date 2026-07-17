import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olvide contraseña",
  description: "Recupera tu contraseña en Wiauto",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container-custom mx-auto flex justify-center">
        <ForgotPasswordForm />
      </div>
      
    </div>
  )
}