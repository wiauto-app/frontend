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
import { ProfessionalSidebarItem } from "./professionalSidebarItem";
import { BrandLogo } from "@/components/ui/brandLogo";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useUserSidebarItems } from "@/hooks/useUserSidebarItems";

const SIDEBAR_SKELETON_ITEMS = 8;

const ProfessionalSidebarSkeleton = ({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar
    className={cn(
      "bg-linear-to-b from-purple-dark via-purple-dark to-primary text-primary-foreground",
      className,
    )}
    {...props}
    aria-busy="true"
    aria-label="Cargando menú de usuario"
  >
    <SidebarHeader className="flex h-20 items-center justify-center bg-white">
      <Skeleton className="h-8 w-28" />
    </SidebarHeader>
    <Separator />
    <SidebarContent className="p-2">
      <SidebarMenu className="gap-2">
        {Array.from({ length: SIDEBAR_SKELETON_ITEMS }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <div className="flex h-8 items-center gap-2 rounded-md px-2">
              <Skeleton className="size-4 shrink-0 bg-white/25" />
              <Skeleton className="h-4 w-28 bg-white/25" />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenuItem>
        <div className="flex h-8 items-center gap-2 rounded-md px-2">
          <Skeleton className="size-4 shrink-0 bg-white/25" />
          <Skeleton className="h-4 w-24 bg-white/25" />
        </div>
      </SidebarMenuItem>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

export function ProfessionalSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { logout, isLoading } = useUser();
  const pathname = usePathname();

  const isOnUsuarioPath = pathname.includes("usuario");
  const sidebarItems = useUserSidebarItems();
  if (!isOnUsuarioPath) {
    return null;
  }

  if (isLoading) {
    return <ProfessionalSidebarSkeleton className={className} {...props} />;
  }

  return (
    <Sidebar
      className={cn(
        "bg-linear-to-b from-purple-dark via-purple-dark to-primary text-primary-foreground",
        className,
      )}
      {...props}
    >
      <SidebarHeader className="flex h-20 items-center justify-center bg-white">
        <BrandLogo variant="pro-black" />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-2">
          {sidebarItems.map((item) => (
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
          <SidebarMenuButton onClick={logout}>
            <LogOut className="size-4" />
            Cerrar sesión
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
