"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { UserAvatar } from "./userAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSidebarLinks } from "@/app/(user)/constants/user.constants";
import { Skeleton } from "@/components/ui/skeleton";

function getDisplayName(name?: string, lastName?: string, email?: string) {
  const fullName = [name, lastName].filter(Boolean).join(" ").trim();

  return fullName || email || "Mi cuenta";
}

export function UserDropdown() {
  const { user, logout, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/iniciar-sesion"
        className="text-sm font-semibold  hover:text-primary hover:underline"
      >
        Iniciar sesión
      </Link>
    );
  }

  const displayName = getDisplayName(user.name, user.last_name, user.email);
  const sidebarLinks = getUserSidebarLinks({
    userType: user.userType,
    dealershipMembership: user.dealership_membership,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg py-1 pr-1 transition-colors hover:bg-slate-50"
          >
            <UserAvatar />
            <div className="flex flex-col items-start">
              <p className="hidden max-w-[160px] truncate text-sm font-bold text-slate-900 sm:inline">
                {displayName}
              </p>
              <span className="text-xs text-muted-foreground">{user.userType}</span>
            </div>
          </button>
        }
      ></DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="border-b px-3 py-3">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        {sidebarLinks.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.href}
              render={
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              }
            ></DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} variant="destructive">
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
