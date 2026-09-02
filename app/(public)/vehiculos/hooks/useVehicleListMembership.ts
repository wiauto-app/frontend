"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { vehicleListService } from "@/services/vehicleListService";
import { trackAddToWishlist } from "@/lib/analytics/events";
import { useFavoriteIds } from "./useFavoriteIds";

const VEHICLE_LISTS_QUERY_KEY = ["vehicle-lists"] as const;

const vehicleListMembershipQueryKey = (vehicleId: string) =>
  ["vehicle-list-membership", vehicleId] as const;

export const resolveDefaultVehicleList = (
  lists: VehicleList[],
): VehicleList | undefined =>
  lists.find((list) => list.is_default) ??
  lists.find((list) => list.name === "Favoritos");

const MEMBERSHIP_PAGE_SIZE = 100;

const isVehicleInList = async (
  listId: string,
  vehicleId: string,
): Promise<boolean> => {
  let page = 1;

  while (true) {
    const response = await vehicleListService.findItems(listId, {
      page,
      limit: MEMBERSHIP_PAGE_SIZE,
    });

    if (!response.ok || !response.data) {
      return false;
    }

    const found = response.data.data.some(
      (item) => item.vehicle_id === vehicleId,
    );

    if (found) {
      return true;
    }

    if (page * MEMBERSHIP_PAGE_SIZE >= response.data.total) {
      return false;
    }

    page += 1;
  }
};

const fetchMembership = async (vehicleId: string, lists: VehicleList[]) => {
  const membership = new Set<string>();

  await Promise.all(
    lists.map(async (list) => {
      const isMember = await isVehicleInList(list.id, vehicleId);

      if (isMember) {
        membership.add(list.id);
      }
    }),
  );

  return membership;
};

type UseVehicleListMembershipOptions = {
  vehicleId: string;
  enabled?: boolean;
};

export const useVehicleListMembership = ({
  vehicleId,
  enabled = false,
}: UseVehicleListMembershipOptions) => {
  const queryClient = useQueryClient();
  const membershipQueryKey = vehicleListMembershipQueryKey(vehicleId);
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.has(vehicleId);
  const listsQuery = useQuery({
    queryKey: VEHICLE_LISTS_QUERY_KEY,
    queryFn: async () => {
      const response = await vehicleListService.findAll();
      if (!response.ok) {
        throw new Error(response.message || "No se pudieron cargar las listas");
      }
      return response.data;
    },
    enabled,
  });

  const membershipQuery = useQuery({
    queryKey: membershipQueryKey,
    queryFn: async () => {
      const lists = listsQuery.data;
      if (!lists?.length) {
        return new Set<string>();
      }
      return fetchMembership(vehicleId, lists);
    },
    enabled: enabled && !!listsQuery.data?.length,
  });

  const membership = membershipQuery.data ?? new Set<string>();
  const isFavorited = isFavorite || membership.size > 0;

  const addToListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const response = await vehicleListService.addItem(listId, vehicleId);
      if (response.status === 409) {
        return { alreadyInList: true };
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo agregar a la lista");
      }
      return { alreadyInList: false };
    },
    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey: membershipQueryKey });
      const previousMembership = queryClient.getQueryData<Set<string>>(
        membershipQueryKey,
      );

      queryClient.setQueryData<Set<string>>(membershipQueryKey, (current) => {
        const next = new Set(current);
        next.add(listId);
        return next;
      });

      return { previousMembership };
    },
    onSuccess: (result) => {
      if (!result.alreadyInList) {
        trackAddToWishlist({ id: vehicleId });
      }
    },
    onError: (_error, _listId, context) => {
      if (context?.previousMembership) {
        queryClient.setQueryData(membershipQueryKey, context.previousMembership);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: membershipQueryKey });
    },
  });

  const removeFromListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const response = await vehicleListService.removeItem(listId, vehicleId);
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(response.message || "No se pudo quitar de la lista");
      }
    },
    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey: membershipQueryKey });
      const previousMembership = queryClient.getQueryData<Set<string>>(
        membershipQueryKey,
      );

      queryClient.setQueryData<Set<string>>(membershipQueryKey, (current) => {
        const next = new Set(current);
        next.delete(listId);
        return next;
      });

      return { previousMembership };
    },
    onError: (_error, _listId, context) => {
      if (context?.previousMembership) {
        queryClient.setQueryData(membershipQueryKey, context.previousMembership);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: membershipQueryKey });
    },
  });

  const createListMutation = useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => {
      const createResponse = await vehicleListService.create({
        name,
        description: description?.trim() || null,
      });

      if (!createResponse.ok || !createResponse.data) {
        throw new Error(createResponse.message || "No se pudo crear la lista");
      }

      const addResponse = await vehicleListService.addItem(
        createResponse.data.id,
        vehicleId,
      );

      if (addResponse.status !== 409 && !addResponse.ok) {
        throw new Error(addResponse.message || "No se pudo agregar a la lista");
      }

      return createResponse.data;
    },
    onSuccess: () => {
      trackAddToWishlist({ id: vehicleId });
      queryClient.invalidateQueries({ queryKey: VEHICLE_LISTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: membershipQueryKey });
    },
  });

  const toggleListMembership = async (listId: string, checked: boolean) => {
    if (checked) {
      await addToListMutation.mutateAsync(listId);
      return;
    }
    await removeFromListMutation.mutateAsync(listId);
  };

  const pendingListIds = new Set<string>([
    ...(addToListMutation.isPending && addToListMutation.variables
      ? [addToListMutation.variables]
      : []),
    ...(removeFromListMutation.isPending && removeFromListMutation.variables
      ? [removeFromListMutation.variables]
      : []),
  ]);

  return {
    lists: listsQuery.data ?? [],
    membership,
    isFavorited,
    isLoading: listsQuery.isLoading || membershipQuery.isLoading,
    isFetching: listsQuery.isFetching || membershipQuery.isFetching,
    addToList: addToListMutation.mutateAsync,
    removeFromList: removeFromListMutation.mutateAsync,
    toggleListMembership,
    createList: createListMutation.mutateAsync,
    isCreatingList: createListMutation.isPending,
    pendingListIds,
    resolveDefaultList: () =>
      resolveDefaultVehicleList(listsQuery.data ?? []),
    refetch: async () => {
      await listsQuery.refetch();
      await membershipQuery.refetch();
    },
  };
};
