import type { StrapiUiAviso } from "@/interfaces/strapi-components.interface";
import type { StrapiComponentProps } from "@/interfaces/strapi-content-props.interface";
import { cn } from "@/lib/utils";

const AVISO_STYLES: Record<NonNullable<StrapiUiAviso["tipo"]>, string> = {
  info: "bg-blue-50 text-blue-800",
  exito: "bg-green-50 text-green-800",
  alerta: "bg-amber-50 text-amber-800",
  error: "bg-red-50 text-red-800",
};

/** Pinta `ui.aviso` con el color de su `tipo`. */
export const StrapiAviso = ({
  content,
  className,
}: StrapiComponentProps<StrapiUiAviso | null>) => {
  if (!content?.texto) {
    return null;
  }

  return (
    <p
      role={content.tipo === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg px-4 py-3 text-sm",
        AVISO_STYLES[content.tipo ?? "info"],
        className,
      )}
    >
      {content.texto}
    </p>
  );
};
