import Link from "next/link";

import { cn } from "@/lib/utils";

import { BRAND_BLUE } from "../constants/navLinks.constants";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/contexts/auth/useUser";

type NavbarPublishButtonProps = {
  variant?: "navbar" | "mobile";
};

export function NavbarPublishButton({
  variant = "navbar",
}: NavbarPublishButtonProps) {
  const isMobileMenu = variant === "mobile";
  const { user } = useUser();

  if (user) {
    return (
      <Link
        href="/crear-vehiculo"
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-bold text-white transition-opacity duration-200 hover:opacity-90",
          isMobileMenu
            ? "flex min-h-11 w-full"
            : "hidden shrink-0 sm:inline-flex",
        )}
        style={{ backgroundColor: BRAND_BLUE }}
      >
        Publicar
      </Link>
    );
  }

  return (
    <>
      <SignInDialog
        returnTo="/crear-vehiculo"
        trigger={
          <Button
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-bold text-white transition-opacity duration-200 hover:opacity-90",
              isMobileMenu
                ? "flex min-h-11 w-full"
                : "hidden shrink-0 sm:inline-flex",
            )}
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Publicar
          </Button>
        }
      />
    </>
  );
}
