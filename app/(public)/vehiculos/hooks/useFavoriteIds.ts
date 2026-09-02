import { useMemo } from "react";
import { useUser } from "@/app/contexts/auth/useUser";

export const useFavoriteIds = () => {
  const { user } = useUser();

  return useMemo(() => {
    const ids = new Set<string>();

    user?.vehicle_lists.forEach((list) => {
      list.items?.forEach((item) => {
        ids.add(item.vehicle_id);
      });
    });

    return ids;
  }, [user?.vehicle_lists]);
};