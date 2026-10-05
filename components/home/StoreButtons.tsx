import Image from "next/image";
import { FaApple } from "react-icons/fa";

import { cn } from "@/lib/utils";

export interface StoreButtonsProps {
  className?: string;
  /** Si es true, muestra estilo "Próximamente" y desactiva los enlaces. */
  soon?: boolean;
}

interface StoreLinkProps {
  soon?: boolean;
  className?: string;
}

export const AppStoreLink = ({ soon = false, className }: StoreLinkProps) => {
  const eyebrow = soon ? "Próximamente" : "Descarga la app";

  return (
    <a
      href={soon ? undefined : "#"}
      aria-disabled={soon || undefined}
      tabIndex={soon ? -1 : 0}
      aria-label={soon ? "App Store — Próximamente" : "App Store"}
      className={cn(
        "relative inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity",
        soon ? "cursor-not-allowed opacity-55 grayscale" : "hover:opacity-90",
        className,
      )}
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
  );
};

export const PlayStoreLink = ({ className }: StoreLinkProps) => (
  <a
    href="https://play.google.com/store/apps/details?id=com.faux.wiauto"
    tabIndex={0}
    aria-label="Google Play"
    className={cn(
      "relative inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border-2 bg-white px-4 text-black transition-opacity hover:opacity-90",
      className,
    )}
  >
    <Image
      src="/icons/playStore.svg"
      alt="Google Play"
      width={24}
      height={24}
      sizes="24px"
    />
    <span className="flex flex-col leading-tight">
      <span className="text-[9px] font-medium tracking-wide uppercase leading-none">
        Descarga la app
      </span>
      <span className="text-[15px] leading-tight font-semibold">
        En Google Play
      </span>
    </span>
  </a>
);

export function StoreButtons({ className, soon = false }: StoreButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <AppStoreLink soon={soon} />
      <PlayStoreLink />
    </div>
  );
}
