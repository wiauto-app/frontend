"use client";

import { useSearchParams } from "next/navigation";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { RegisterFormContent } from "@/components/auth/registerFormContent";
import { ReferralCaptureOnMount } from "@/components/referrals/ReferralCaptureOnMount";

interface RegisterFormProps extends AuthPantallaProps<"registro"> {
  invitedEmail?: string;
}

export default function RegisterForm({
  content,
  compartido,
  invitedEmail: invitedEmailProp,
}: RegisterFormProps) {
  const searchParams = useSearchParams();
  const invitationEmailFromQuery = searchParams.get("email")?.trim() ?? "";
  const referralFromQuery = searchParams.get("ref")?.trim() ?? "";
  const redirectFromQuery = searchParams.get("redirect");
  const invitedEmail = invitedEmailProp ?? invitationEmailFromQuery;

  return (
    <>
      <ReferralCaptureOnMount />
      <RegisterFormContent
        content={content}
        compartido={compartido}
        invitedEmail={invitedEmail}
        referralCodeFromQuery={referralFromQuery}
        redirectFromQuery={redirectFromQuery}
      />
    </>
  );
}
