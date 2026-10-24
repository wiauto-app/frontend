import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_BLUE } from "./data/home-data";

export interface VehicleCardProps {
  id: string;
  badge: string;
  title: string;
  price: string;
  imageSrc: string;
  href?: string;
  className?: string;
}

export function VehicleCard({
  badge,
  title,
  price,
  imageSrc,
  href = "/vehiculos",
  className,
}: VehicleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3 sm:p-5 sm:pt-4">
        <p
          className="text-[11px] font-bold uppercase tracking-wide sm:text-xs"
          style={{ color: BRAND_BLUE }}
        >
          {badge}
        </p>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h3>
          <p className="shrink-0 text-lg font-bold text-slate-900 sm:text-xl">{price}</p>
        </div>
      </div>
    </Link>
  );
}
