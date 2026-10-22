import Link from "next/link";

import { cn } from "@/lib/utils";
import { COMPANY_LEGAL } from "@/lib/legal/company-legal";

interface FormDataProtectionNoticeProps {
  className?: string;
  id?: string;
  /** Texto breve antes del enlace a privacidad. */
  purpose?: string;
}

export const FormDataProtectionNotice = ({
  className,
  id,
  purpose = "gestionar tu solicitud",
}: FormDataProtectionNoticeProps) => {
  return (
    <p
      id={id}
      className={cn("text-xs leading-relaxed text-muted-foreground", className)}
    >
      {COMPANY_LEGAL.legalName} ({COMPANY_LEGAL.nif}) tratará tus datos para{" "}
      {purpose}. Puedes ejercer tus derechos de acceso, rectificación,
      supresión y demás previstos en el RGPD, y consultar más información en
      nuestra{" "}
      <Link
        href="/privacidad"
        className="font-medium text-primary underline underline-offset-2"
      >
        política de privacidad
      </Link>
      .
    </p>
  );
};
