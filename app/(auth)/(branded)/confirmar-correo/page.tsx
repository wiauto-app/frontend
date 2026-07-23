import ConfirmEmailForm from "@/app/(auth)/components/ConfirmEmailForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmar correo",
  description: "Confirma tu correo electrónico en Wiauto",
};

export default function Page() {
  return <ConfirmEmailForm />;
}
