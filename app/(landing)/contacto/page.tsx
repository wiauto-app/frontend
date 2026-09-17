import { LandingHeader } from "@/components/ui/landingHeader";

import { ContactInfo } from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

const ContactoPage = () => {
  return (
    <>
      <LandingHeader title="Datos de contacto" />
      <ContactInfo />
      <ContactForm />
    </>
  );
};

export default ContactoPage