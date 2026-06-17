"use client";

import Link from "next/link";
import {
  Bell,
  Car,
  Heart,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserIcon,
} from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./userAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_SIDEBAR_LINKS } from "@/app/(user)/constants/user.constants";

function getDisplayName(name?: string, lastName?: string, email?: string) {
  const fullName = [name, lastName].filter(Boolean).join(" ").trim();

  return fullName || email || "Mi cuenta";
}

export function UserDropdown() {
  const { user, logout, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        href="/iniciar-sesion"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Iniciar sesión
      </Link>
    );
  }

  const displayName = getDisplayName(user.name, user.last_name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg py-1 pr-1 transition-colors hover:bg-slate-50"
          >
            <UserAvatar />

            <span className="max-w-[160px] truncate text-sm font-bold text-slate-900">
              {displayName}
            </span>
          </button>
        }
      ></DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="border-b px-3 py-3">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        {USER_SIDEBAR_LINKS.map((item) => {
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

        <DropdownMenuItem
          onClick={logout}
          variant="destructive"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
