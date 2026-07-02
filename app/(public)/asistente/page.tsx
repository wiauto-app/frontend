import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Asistente",
  description: "Asistente de búsqueda de vehículos con IA",
};

export default function Page() {
  redirect("/asistente/chat");
}
