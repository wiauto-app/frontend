"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/navbar/components/userAvatar";
import { getUserSidebarLinks } from "../constants/user.constants";
import { useUser } from "@/app/contexts/auth/useUser";

const isSidebarLinkActive = (
  linkHref: string,
  pathname: string | null,
  tab: string | null,
): boolean => {
  if (linkHref.startsWith("/perfil")) {
    if (linkHref.includes("tab=dealership")) {
      return pathname === "/perfil" && tab === "dealership";
    }

    return pathname === "/perfil" && tab !== "dealership";
  }

  return (
    pathname === linkHref ||
    (Boolean(pathname?.startsWith(linkHref)) && linkHref !== "/")
  );
};

export const UserSidebarFallback = () => (
  <div className="flex w-full flex-col gap-4">
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export function UserSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const { user, logout } = useUser();
  const sidebarLinks = getUserSidebarLinks({
    userType: user?.userType,
    dealershipMembership: user?.dealership_membership,
  });
  return (
    <div className="w-full  flex flex-col gap-4">
      {/* User Info Card */}
      <Card size="sm">
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar className="size-9" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.name || "Usuario"}
              </h3>
              <p className="text-sm text-gray-500">{user?.email || "---"}</p>
            </div>
          </div>
          <Link
            href="/perfil"
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <nav className="flex flex-col space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = isSidebarLinkActive(link.href, pathname, tab);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="w-full justify-start gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
