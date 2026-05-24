"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/app/contexts/auth/useUser";
import { cn } from "@/lib/utils";

function getDisplayName(name?: string, lastName?: string, email?: string) {
  const fullName = [name, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "Mi cuenta";
}

function getInitials(name?: string, lastName?: string, email?: string) {
  const display = getDisplayName(name, lastName, email);
  const parts = display.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return display.slice(0, 2).toUpperCase();
}

export function NavbarUserMenu() {
  const { user, logout, isLoading } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="hidden h-9 w-28 animate-pulse rounded-lg bg-slate-100 sm:block" />;
  }

  if (!user) {
    return (
      <Link
        href="/iniciar-sesion"
        className="hidden text-sm font-bold text-slate-900 transition-colors hover:text-[#0061F2] sm:inline"
      >
        Iniciar sesión
      </Link>
    );
  }

  const displayName = getDisplayName(user.name, user.last_name, user.email);

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg py-1 pr-1 transition-colors hover:bg-slate-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt=""
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
            {getInitials(user.name, user.last_name, user.email)}
          </span>
        )}
        <span className="max-w-[140px] truncate text-sm font-bold text-slate-900">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-500 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <Link
            href="/perfil"
            role="menuitem"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Mi perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
