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

export function ProfessionalSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const sidebarLinks = getUserSidebarLinks({
    userType: user?.userType,
    dealershipMembership: user?.dealership_membership,
  });

  if (!pathname.includes("usuario")) return null;
  return (
    <Sidebar
      className={cn("bg-primary text-primary-foreground", className)}
      {...props}
    >
      <SidebarHeader>
        <BrandLogo variant="pro-white" />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-2">
          {sidebarLinks.map((item) => (
            <ProfessionalSidebarItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={logout}
            className="text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground active:bg-white/15 active:text-primary-foreground"
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
