"use client";

import { useMemo } from "react";

import { useUser } from "@/app/contexts/auth/useUser";
import {
  getUserSidebarLinks,
  getUserSidebarSections,
} from "@/app/(usuario)/usuario/constants/user.constants";
import { useEntitlements } from "./useEntitlements";

const useUserSidebarParams = () => {
  const { user } = useUser();
  const { isSubscribed, isPrivileged } = useEntitlements();
  const hasProAccess = isSubscribed || isPrivileged;

  return useMemo(
    () => ({
      dealershipMembership: user?.dealership_membership ?? null,
      isSubscribed: hasProAccess,
      isAdmin: user?.isAdmin,
    }),
    [hasProAccess, user?.dealership_membership, user?.isAdmin],
  );
};

export const useUserSidebarSections = () => {
  const params = useUserSidebarParams();
  return useMemo(() => getUserSidebarSections(params), [params]);
};

export const useUserSidebarItems = () => {
  const params = useUserSidebarParams();
  return useMemo(() => getUserSidebarLinks(params), [params]);
};
