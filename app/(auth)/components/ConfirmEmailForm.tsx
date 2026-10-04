import Link from "next/link";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";

export default function ConfirmEmailForm({
  content,
}: AuthPantallaProps<"confirmar_correo">) {
  return (
    <>
      <StrapiEncabezado content={content.encabezado} />

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
