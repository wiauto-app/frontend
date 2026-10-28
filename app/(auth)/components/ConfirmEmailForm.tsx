import Link from "next/link";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";

interface ConfirmEmailFormProps extends AuthPantallaProps<"confirmar_correo"> {
  /** Registro desde `/publicar`: hay un anuncio guardado como borrador. */
  hasPendingListing?: boolean;
}

export default function ConfirmEmailForm({
  content,
  hasPendingListing = false,
}: ConfirmEmailFormProps) {
  return (
    <>
      <StrapiEncabezado content={content.encabezado} />

      {hasPendingListing ? (
        <p
          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm text-blue-800"
          role="note"
        >
          Tu anuncio está guardado como borrador y se publicará al verificar tu
          cuenta.
        </p>
      ) : null}

      {content.ayuda ? (
        <p className="text-center text-sm text-muted-foreground">
          {content.ayuda}
        </p>
      ) : null}

      {content.boton ? (
        <Link
          href={content.boton.url}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {content.boton.label}
        </Link>
      ) : null}

      <StrapiTextoEnlace
        content={content.pie}
        className="text-xs text-muted-foreground"
        linkClassName="text-primary hover:text-primary hover:underline"
      />
    </>
  );
}
