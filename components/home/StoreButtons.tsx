import Image from "next/image";
import { FaApple } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface StoreButtonsProps {
  className?: string;
  /** Si es true, muestra estilo "Próximamente" y desactiva los enlaces. */
  soon?: boolean;
}

export function StoreButtons({ className, soon = false }: StoreButtonsProps) {
  const eyebrow = soon ? "Próximamente" : "Descarga la app";

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href={soon ? undefined : "#"}
        aria-disabled={soon || undefined}
        tabIndex={soon ? -1 : 0}
        aria-label={soon ? "App Store — Próximamente" : "App Store"}
        className={cn(
          "relative inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity",
          soon
            ? "cursor-not-allowed opacity-55 grayscale"
            : "hover:opacity-90",
        )}
        // onClick={soon ? (event) => event.preventDefault() : undefined}
      >
        <FaApple className="size-6" />
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-[10px] leading-none",
              soon ? "block" : "hidden lg:block",
            )}
          >
            {eyebrow}
          </span>
          <span className="text-[15px] leading-tight font-semibold">
            En la App Store
          </span>
        </span>
      </a>
      <a
        href={soon ? undefined : "#"}
        aria-disabled={soon || undefined}
        tabIndex={soon ? -1 : 0}
        aria-label={soon ? "Google Play — Próximamente" : "Google Play"}
        className={cn(
          "relative inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border-2 bg-white px-4 text-black transition-opacity",
          soon
            ? "cursor-not-allowed opacity-55 grayscale"
            : "hover:opacity-95",
        )}
        // onClick={soon ? (event) => event.preventDefault() : undefined}
      >
        <Image
          src="/icons/playStore.svg"
          alt="Google Play"
          width={24}
          height={24}
          sizes="24px"
        />
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-[9px] font-medium tracking-wide uppercase leading-none",
              soon ? "block" : "hidden lg:block",
            )}
          >
            {eyebrow}
          </span>
          <span className="text-[15px] leading-tight font-semibold">
            En Google Play
          </span>
        </span>
      </a>
    </div>
  );
}
