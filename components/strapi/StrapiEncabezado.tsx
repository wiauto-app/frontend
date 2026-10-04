import type { StrapiUiEncabezado } from "@/interfaces/strapi-components.interface";
import type { StrapiComponentProps } from "@/interfaces/strapi-content-props.interface";
import { cn } from "@/lib/utils";

interface StrapiEncabezadoProps
  extends StrapiComponentProps<StrapiUiEncabezado | null> {
  as?: "h1" | "h2" | "h3";
  titleClassName?: string;
  descriptionClassName?: string;
  /** Contenido extra al final de la descripción (p. ej. un dato dinámico). */
  children?: React.ReactNode;
}

/** Pinta `ui.encabezado`: título y descripción opcional. */
export const StrapiEncabezado = ({
  content,
  as: Heading = "h2",
  className,
  titleClassName,
  descriptionClassName,
  children,
}: StrapiEncabezadoProps) => {
  if (!content) {
    return null;
  }

  return (
    <div className={cn("text-center", className)}>
      <Heading className={cn("text-3xl font-bold text-gray-900", titleClassName)}>
        {content.titulo}
      </Heading>
      {content.descripcion || children ? (
        <p className={cn("mt-2 text-sm text-gray-500", descriptionClassName)}>
          {content.descripcion}
          {children}
        </p>
      ) : null}
    </div>
  );
};
