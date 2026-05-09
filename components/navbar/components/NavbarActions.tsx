"use client";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/contexts/auth/useUser";
import { LogoutButton } from "./logoutButton";

export const NavbarActions = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <Link
            href="/perfil"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Perfil
          </Link>
          <LogoutButton />
        </>
      ) : (
        <Link
          href="/iniciar-sesion"
          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
        >
          Iniciar sesión
        </Link>
      )}
    </div>
  );
};
