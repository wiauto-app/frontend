import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";

export type VehicleCardProps = {
  id: string;
  badge: string;
  title: string;
  price: string;
  imageSrc: string;
  photoCount?: number;
  tags?: readonly string[];
  progress?: number;
  href?: string;
  className?: string;
};

export function VehicleCard({
  badge,
  title,
  price,
  imageSrc,
  photoCount = 3,
  tags = ["Reservable", "Profesional"],
  progress = 0.25,
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
        {/* <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        /> */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Camera className="size-3.5" aria-hidden />
          {photoCount}
        </span>
      </div>

      <div className="h-0.5 w-full bg-slate-200">
        <div
          className="h-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%`, backgroundColor: BRAND_BLUE }}
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

        <ul className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span
                className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs"
                style={{ backgroundColor: BRAND_BLUE_LIGHT, color: BRAND_BLUE }}
              >
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
