"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/app/contexts/auth/useUser";
import { ProfessionalSidebarItem } from "./professionalSidebarItem";
import { BrandLogo } from "@/components/ui/brandLogo";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSidebarSections } from "@/hooks/useUserSidebarItems";

const SIDEBAR_SKELETON_ITEMS = 8;

const ProfessionalSidebarSkeleton = ({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar
    className={cn("bg-pro-sidebar text-white", className)}
    {...props}
    aria-busy="true"
    aria-label="Cargando menú de usuario"
  >
    <SidebarHeader className="flex h-20 items-center justify-center bg-white">
      <Skeleton className="h-8 w-28" />
    </SidebarHeader>
    <Separator />
    <SidebarContent className="p-2 overflow-y-auto ">
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
  </Sidebar>
);

export function ProfessionalSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { logout, isLoading } = useUser();
  const pathname = usePathname();

  const isOnUsuarioPath = pathname.includes("usuario");
  const sidebarSections = useUserSidebarSections();

  if (!isOnUsuarioPath) {
    return null;
  }

  if (isLoading) {
    return <ProfessionalSidebarSkeleton className={className} {...props} />;
  }

  return (
    <Sidebar className={cn("bg-pro-sidebar text-white", className)} {...props}>
      <SidebarHeader className="flex h-20 items-center justify-center bg-white">
        <BrandLogo variant="pro-black" />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="gap-1 overflow-y-auto p-2">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.id} className="p-0">
            <SidebarGroupLabel
              className="px-2 text-muted-foreground uppercase"
            >
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.links.map((item) => (
                  <ProfessionalSidebarItem
                    className={cn(
                      "border border-transparent text-white/90 hover:bg-white/10 hover:text-white",
                      "data-active:border-primary data-active:bg-primary/25 data-active:text-white data-active:shadow-sm data-active:shadow-primary/25",
                      "data-active:hover:bg-primary/30 data-active:hover:text-white data-active:[&_svg]:text-white",
                    )}
                    key={item.href}
                    item={item}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
