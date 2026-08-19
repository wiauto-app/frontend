"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { LuStore } from "react-icons/lu";

import { useUser } from "@/app/contexts/auth/useUser";
import { UserAvatar } from "./userAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEntitlements } from "@/hooks/useEntitlements";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useUserSidebarItems } from "@/hooks/useUserSidebarItems";

function getDisplayName(name?: string, lastName?: string, email?: string) {
  const fullName = [name, lastName].filter(Boolean).join(" ").trim();

  return fullName || email || "Mi cuenta";
}

export function UserDropdown() {
  const { user, logout } = useUser();
  const { planName, isSubscribed } = useEntitlements();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarItems = useUserSidebarItems();
  if (!user) {
    return (
      <Link
        href="/iniciar-sesion"
        className="flex items-center gap-1 text-sm font-semibold hover:text-primary hover:underline"
      >
        <User className="hidden size-4 lg:block" />
        Ingresar
      </Link>
    );
  }

  const displayName = getDisplayName(user.name, user.last_name, user.email);

  /*
   * MOBILE
   */
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <button
              type="button"
              className="flex items-center rounded-lg p-1 transition-colors hover:bg-slate-50"
              aria-label="Abrir menú de usuario"
            >
              <UserAvatar
                imageUrl={user?.avatar_url}
                name={user?.name}
                highlighted={isSubscribed}
              />
            </button>
          }
        />

        <SheetContent
          side="right"
          className="flex w-[85vw] max-w-sm flex-col gap-0 p-0"
        >
          {/* Header */}
          <SheetHeader className="px-5 py-3 text-left">
            <div className="flex items-center gap-3">
              <UserAvatar
                imageUrl={user?.avatar_url}
                name={user?.name}
                highlighted={isSubscribed}
              />

              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-base">
                  {displayName}
                </SheetTitle>

                {user.email && (
                  <SheetDescription className="mt-0.5 truncate text-xs">
                    {user.email}
                  </SheetDescription>
                )}

                {planName && (
                  <span className="mt-1 inline-flex text-xs font-medium text-primary">
                    {planName}
                  </span>
                )}
              </div>
            </div>
          </SheetHeader>
          <Separator />

          {/* Dealership */}
          {user.dealership_membership && (
            <div className="px-4 py-2">
              <div className="flex items-center gap-3 ">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <LuStore className="size-5 text-slate-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.dealership_membership.dealership_name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500" />

                    <p className="truncate text-xs text-muted-foreground">
                      {user.dealership_membership.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex py-2 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 active:bg-slate-100"
                  >
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t p-2">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex py-2 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-5 shrink-0" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  /*
   * DESKTOP
   */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg py-1 pr-1 transition-colors hover:bg-slate-50"
          >
            <UserAvatar
              imageUrl={user?.avatar_url}
              name={user?.name}
              highlighted={isSubscribed}
            />

            <div className="flex flex-col items-start">
              <p className="hidden max-w-[160px] truncate text-sm font-bold text-slate-900 sm:inline">
                {displayName}
              </p>

              {planName ? (
                <span className="text-xs text-muted-foreground">
                  {planName}
                </span>
              ) : null}
            </div>
          </button>
        }
      />

      <DropdownMenuContent align="end" className="w-64">
        {user.dealership_membership && (
          <div className="flex items-center justify-start gap-2 p-2">
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

        {sidebarItems.map((item) => {
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
            />
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
