import { LandingHeader } from "@/components/ui/landingHeader";

import { ContactInfo } from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto de Wiauto",
};

export default function ContactoPage() {
  return (
    <>
      <LandingHeader title="Datos de contacto" />
      <ContactInfo />
      <ContactForm />
    </>
  );
};
