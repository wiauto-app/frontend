import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserSidebarLink } from "../constants/user.constants";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { isSidebarLinkActive } from "./UserSidebar";

export const ProfessionalSidebarItem = ({
  item,
}: {
  item: UserSidebarLink;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const isActive = isSidebarLinkActive(item.href, pathname, tab);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={isActive}
        className={cn(
          "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground active:bg-white/15 active:text-primary-foreground",
          "data-active:bg-white/15 data-active:text-primary-foreground data-active:hover:bg-white/20 data-active:hover:text-primary-foreground",
        )}
        render={
          <Link
            className={cn(
              "flex items-center justify-between font-semibold",
              isActive && "border border-white/40 font-bold",
            )}
            href={item.href}
          >
            <div className="flex items-center gap-2">
              <Icon className="size-6" />
              {item.label}
            </div>
            <ChevronRight className="size-4 opacity-70" />
          </Link>
        }
      />
    </SidebarMenuItem>
  );
};
