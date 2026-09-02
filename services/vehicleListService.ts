import { ApiResponse, apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  AddVehicleListItemDto,
  CreateVehicleListDto,
  FindVehicleListItemsParams,
  UpdateVehicleListDto,
  VehicleList,
  VehicleListDetail,
  VehicleListItemRecord,
  VehicleListItemsPage,
} from "@/interfaces/vehicle-list.interface";

export const vehicleListService = {
  findAll: (): Promise<ApiResponse<VehicleList[]>> =>
    apiGet<VehicleList[]>("/v1/vehicle-lists"),

  findById: (listId: string): Promise<ApiResponse<VehicleListDetail>> =>
    apiGet<VehicleListDetail>(`/v1/vehicle-lists/${listId}`),

  create: (data: CreateVehicleListDto): Promise<ApiResponse<VehicleList>> =>
    apiPost<VehicleList>("/v1/vehicle-lists", data),

  update: (
    listId: string,
    data: UpdateVehicleListDto,
  ): Promise<ApiResponse<VehicleList>> =>
    apiPatch<VehicleList>(`/v1/vehicle-lists/${listId}`, data),

  remove: (listId: string): Promise<ApiResponse<null>> =>
    apiDelete(`/v1/vehicle-lists/${listId}`),

  findItems: (
    listId: string,
    params?: FindVehicleListItemsParams,
  ): Promise<ApiResponse<VehicleListItemsPage>> => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) {
      searchParams.set("page", String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.set("limit", String(params.limit));
    }
    const query = searchParams.toString();
    return apiGet<VehicleListItemsPage>(
      `/v1/vehicle-lists/${listId}/items${query ? `?${query}` : ""}`,
    );
  },

  addItem: (
    listId: string,
    vehicleId: string,
  ): Promise<ApiResponse<VehicleListItemRecord>> =>
    apiPost<VehicleListItemRecord>(`/v1/vehicle-lists/${listId}/items`, {
      vehicle_id: vehicleId,
    } satisfies AddVehicleListItemDto),

  removeItem: (listId: string, vehicleId: string): Promise<ApiResponse<null>> =>
    apiDelete(`/v1/vehicle-lists/${listId}/items/${vehicleId}`),
};
