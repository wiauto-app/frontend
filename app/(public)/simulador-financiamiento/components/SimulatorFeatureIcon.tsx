import Image from "next/image";

import { resolveStrapiIconName } from "../utils/resolveStrapiIconName";

interface SimulatorFeatureIconProps {
  iconName: string | null;
  mediaUrl: string | null;
  mediaAlt: string;
  /** Clases del icono SVG (lucide / react-icons). */
  iconClassName?: string;
  /** Contenedor cuando se renderiza SVG (sin media). */
  wrapperClassName?: string;
  /** Tamaño del contenedor de Image cuando hay media URL. */
  mediaSizeClassName?: string;
  imageSizes?: string;
}

export const SimulatorFeatureIcon = ({
  iconName,
  mediaUrl,
  mediaAlt,
  iconClassName = "size-6",
  wrapperClassName = "flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600",
  mediaSizeClassName = "relative size-12",
  imageSizes = "48px",
}: SimulatorFeatureIconProps) => {
  const icon = resolveStrapiIconName(iconName);

  // Llamar el IconType como función evita JSX dinámico
  // ("Cannot create components during render" del React Compiler).
  if (icon) {
    return (
      <div className={wrapperClassName}>
        {icon({ className: iconClassName, "aria-hidden": true })}
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className={mediaSizeClassName}>
        <Image
          src={mediaUrl}
          alt={mediaAlt}
          fill
          className="object-contain"
          sizes={imageSizes}
        />
      </div>
    );
  }

  return null;
};
