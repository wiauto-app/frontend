"use client";

import { useUser } from "@/app/contexts/auth/useUser";
import { BrandLogo } from "@/components/ui/brandLogo";
import { useEntitlements } from "@/hooks/useEntitlements";
import { usePathname } from "next/navigation";

export const NavbarLogo = () => {
  const { isSubscribed } = useEntitlements();
  const pathname = usePathname();

  if (pathname.includes("/usuario") && isSubscribed) {
    return null;
  }

  return <BrandLogo className="w-32 lg:w-44 " sizes="130px" />;
};
