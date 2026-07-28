import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  type ApiResponse,
} from "@/lib/api";
import { objectToQueryString } from "@/lib/utils";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { PaginatedResult } from "@/types/general.types";
import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";
import { V1_MY_VEHICLES, V1_VEHICLES } from "@/components/vehicles/services/route.constants";

interface FindMineParams {
  page?: number;
  limit?: number;
  status?: VehicleStatus;
  make_id?: number;
  model_id?: number;
  since_created_at?: string;
  until_created_at?: string;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
}

export const myListingsService = {
  findMine(
    params?: FindMineParams,
  ): Promise<ApiResponse<PaginatedResult<OwnerVehicleListItem>>> {
    const query = objectToQueryString(params ?? {});
    return apiGet<PaginatedResult<OwnerVehicleListItem>>(
      `${V1_MY_VEHICLES}${query ? `?${query}` : ""}`,
    );
  },

  duplicate(id: string): Promise<ApiResponse<{ vehicle_id: string }>> {
    return apiPost<{ vehicle_id: string }>(`${V1_VEHICLES}/${id}/duplicate`, {});
  },

  renew(id: string): Promise<
    ApiResponse<{
      renewed_at: string;
      can_renew: boolean;
    }>
  > {
    return apiPost(`${V1_VEHICLES}/${id}/renew`, {});
  },

  schedule(
    id: string,
    scheduled_publish_at: string,
  ): Promise<
    ApiResponse<{
      scheduled_publish_at: string;
      status: VehicleStatus;
    }>
  > {
    return apiPatch(`${V1_VEHICLES}/${id}/schedule`, { scheduled_publish_at });
  },

  updateStatus(
    id: string,
    status: Extract<VehicleStatus, "active" | "inactive">,
  ): Promise<ApiResponse<{ status: VehicleStatus }>> {
    return apiPatch(`${V1_VEHICLES}/${id}/status`, { status });
  },

  remove(id: string): Promise<ApiResponse<null>> {
    return apiDelete(`${V1_VEHICLES}/${id}`);
  },
};
