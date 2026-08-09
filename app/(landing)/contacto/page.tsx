import { LandingHeader } from "@/components/ui/landingHeader";

import { ContactInfo } from "./components/ContactInfo";
import ContectForm from "./components/ContectForm";

const ContactoPage = () => {
  return (
    <>
      <LandingHeader title="Datos de contacto" />
      <ContactInfo />
      <ContectForm />
    </>
  );
};

export default ContactoPage