"use client";

import { useMemo } from "react";

import { useUser } from "@/app/contexts/auth/useUser";
import { getUserSidebarLinks } from "@/app/usuario/constants/user.constants";
import { useEntitlements } from "./useEntitlements";

export const useUserSidebarItems = () => {
  const { user } = useUser();
  const { isSubscribed, isPrivileged } = useEntitlements();
  const hasProAccess = isSubscribed || isPrivileged;

  return useMemo(
    () =>
      getUserSidebarLinks({
        dealershipMembership: user?.dealership_membership ?? null,
        isSubscribed: hasProAccess,
      }),
    [hasProAccess, user?.dealership_membership],
  );
};
