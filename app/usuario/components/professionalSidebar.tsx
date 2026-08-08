"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/app/contexts/auth/useUser";
import { getUserSidebarLinks } from "../constants/user.constants";
import { ProfessionalSidebarItem } from "./professionalSidebarItem";
import { BrandLogo } from "@/components/ui/brandLogo";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntitlements } from "@/hooks/useEntitlements";

export function ProfessionalSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const { has, isSubscribed, isPrivileged } = useEntitlements();

  const sidebarLinks = getUserSidebarLinks({
    dealershipMembership: user?.dealership_membership,
    hasDismissedVehicles: has("dismissed_vehicles"),
  });
  if (!pathname.includes("usuario") || !(isSubscribed || isPrivileged)) return null;
  return (
    <Sidebar className={cn("bg-linear-to-b from-purple-dark via-purple-dark to-primary text-primary-foreground", className)} {...props}>
      <SidebarHeader className="bg-white h-20 flex items-center justify-center">
        <BrandLogo variant="pro-black" />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-2">
          {sidebarLinks.map((item) => (
            <ProfessionalSidebarItem
              className={cn(
                "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground active:bg-white/15 active:text-primary-foreground",
                "data-active:bg-white/15 data-active:text-primary-foreground data-active:hover:bg-white/20 data-active:hover:text-primary-foreground",
              )}
              key={item.href}
              item={item}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={logout}
            // className="text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground active:bg-white/15 active:text-primary-foreground"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
