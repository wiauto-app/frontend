import { cn } from "@/lib/utils";

import type { IconProps } from "./types";

/** Garaje con vehículo, basado en el icono de los planes profesionales. */
export const GarageCarIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={cn("size-6 shrink-0", className)}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props["aria-label"] ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d="M10 54V25.5L32 9l22 16.5V54" />
      <path d="M18.5 27.5h27" />
      <circle cx="32" cy="19.5" r="1.7" />

      <path d="m21.5 41.5 3.7-10.1a4 4 0 0 1 3.8-2.6h6a4 4 0 0 1 3.8 2.6l3.7 10.1" />
      <path d="M23 40h18" />
      <path d="M20.5 39.5h-1.3a2.2 2.2 0 0 0 0 4.4h1.1" />
      <path d="M43.5 39.5h1.3a2.2 2.2 0 0 1 0 4.4h-1.1" />
      <path d="M20.7 42.2a5 5 0 0 0-2.2 4.2v8.1h27v-8.1a5 5 0 0 0-2.2-4.2L41 40H23l-2.3 2.2Z" />
      <circle cx="24" cy="47" r="1.8" />
      <circle cx="40" cy="47" r="1.8" />
      <path d="M29 46.5h6" />
      <path d="M29 50.5h6" />
      <path d="M19.5 54.5v2a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-2" />
      <path d="M38.5 54.5v2A2.5 2.5 0 0 0 41 59h1a2.5 2.5 0 0 0 2.5-2.5v-2" />
    </svg>
  );
};