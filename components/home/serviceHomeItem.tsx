import Link from "next/link";
import { IconContainer } from "../ui/iconContainer";
import type { VehicleExtraServiceItem } from "./types/home-page.types";
import { cn } from "@/lib/utils";

interface ServiceHomeItemProps {
  item: VehicleExtraServiceItem;
}

export const ServiceHomeItem = ({ item }: ServiceHomeItemProps) => {
  return (
    <Link
      href={item.href}
      className={cn(
        "home-card-interactive flex items-center gap-2 rounded-xl p-1",
        "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <IconContainer Icon={item.icon} />
      <div>
        <h3 className="text-sm font-bold">{item.name}</h3>
        <p className="text-xs leading-relaxed text-slate-500">
          {item.description}
        </p>
      </div>
    </Link>
  );
};
