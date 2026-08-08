"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { UserAvatar } from "./userAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSidebarLinks } from "@/app/usuario/constants/user.constants";
import { Skeleton } from "@/components/ui/skeleton";
import { LuStore } from "react-icons/lu";
import { useEntitlements } from "@/hooks/useEntitlements";

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
        <div className="hidden lg:block space-y-1">
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
        className="flex items-center gap-1 text-sm font-semibold  hover:text-primary hover:underline"
      >
        <User className="hidden lg:block size-4" />
        Ingresar
      </Link>
    );
  }

  const displayName = getDisplayName(user.name, user.last_name, user.email);
  const { has, planName } = useEntitlements();
  const sidebarLinks = getUserSidebarLinks({
    dealershipMembership: user.dealership_membership,
    hasDismissedVehicles: has("dismissed_vehicles"),
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
              {planName ? (
                <span className="text-xs text-muted-foreground">{planName}</span>
              ) : null}
            </div>
          </button>
        }
      ></DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {user.dealership_membership && (
          <div className="flex items-center gap-2 justify-start p-2">
            <LuStore className="size-5" />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                {user.dealership_membership.dealership_name}
              </p>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground">
                  {user.dealership_membership.role}
                </p>
              </div>
            </div>
          </div>
        )}
        <DropdownMenuSeparator />
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
