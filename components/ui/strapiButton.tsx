import { StrapiLink } from "@/interfaces/strapi-components.interface";
import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";

export const StrapiButton = ({
  button,
  className,
}: {
  button: StrapiLink;
  className?: string;
}) => {
  const Icon = resolveStrapiIconName(button.iconName ?? "");
  return (
    <Link className="w-full lg:w-auto" href={button.url}>
      <Button
        className={cn(
          className,

          button.destacado
            ? "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-xs sm:text-sm"
            : "bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-2xs",
        )}
        variant={button.destacado ? "default" : "outline"}
        size="lg"
      >
        {button.label}
      </Button>
    </Link>
  );
};
