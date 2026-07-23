import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificación 2FA",
  description: "Verifica tu correo electrónico en Wiauto",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
