"use client"
import { USER_SIDEBAR_LINKS, USER_SIDEBAR_PRO_LINKS } from '@/app/usuario/constants/user.constants'
import { useEntitlements } from './useEntitlements'
import { useCallback } from 'react';

export const useUserSidebarItems = () => {
  const { isSubscribed } = useEntitlements();

  const getSidebarItems = useCallback(
    () => {
      if (!isSubscribed) {
        return USER_SIDEBAR_LINKS
      } else {
        return [...USER_SIDEBAR_LINKS, ...USER_SIDEBAR_PRO_LINKS]
      }
    }, [isSubscribed]
  )

  return getSidebarItems()

}
