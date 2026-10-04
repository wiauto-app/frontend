import Link from "next/link";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Button } from "@/components/ui/button";

/** Estado de `/cambiar-contrasena` sin token o con token vacío. */
export const ChangePasswordInvalidLink = ({
  content,
}: AuthPantallaProps<"cambiar_contrasena">) => (
  <>
    <StrapiEncabezado content={content.encabezado_enlace_invalido} />
    {content.boton_solicitar_enlace ? (
      <Button
        type="button"
        className="w-full"
        nativeButton={false}
        render={<Link href={content.boton_solicitar_enlace.url} />}
      >
        {content.boton_solicitar_enlace.label}
      </Button>
    ) : null}
    {content.enlace_volver ? (
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        nativeButton={false}
        render={<Link href={content.enlace_volver.url} />}
      >
        {content.enlace_volver.label}
      </Button>
    ) : null}
  </>
);
