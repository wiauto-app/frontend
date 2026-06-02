import { ApiResponse, apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api";
import {
  Vehicle,
  VehicleListItem,
  CreateVehicleDto,
  UpdateVehicleDto,
  FindAllVehiclesParams,
  PaginatedResponse,
  Make,
  CreateMakeDto,
  UpdateMakeDto,
  Model,
  CreateModelDto,
  UpdateModelDto,
  Version,
  CreateVersionDto,
  UpdateVersionDto,
  FuelType,
  CreateFuelTypeDto,
  UpdateFuelTypeDto,
  BodyType,
  CreateBodyTypeDto,
  UpdateBodyTypeDto,
  VehicleType,
  CreateVehicleTypeDto,
  UpdateVehicleTypeDto,
  Traction,
  CreateTractionDto,
  UpdateTractionDto,
  ServiceItem,
  CreateServiceDto,
  UpdateServiceDto,
  WarrantyTypeItem,
  CreateWarrantyTypeDto,
  UpdateWarrantyTypeDto,
  DgtLabel,
  CreateDgtLabelDto,
  UpdateDgtLabelDto,
  Cuota,
  CreateCuotaDto,
  UpdateCuotaDto,
  Feature,
  CreateFeatureDto,
  UpdateFeatureDto,
  Color,
  CreateColorDto,
  UpdateColorDto,
} from "@/interfaces/vehicle.interface";

import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";

export const vehicleService = {
  vehicles: {
    findAll: (params?: FindAllVehiclesParams): Promise<ApiResponse<PaginatedResponse<VehicleListItem>>> => {
      const query = buildVehiclesQueryString(params);
      return apiGet<PaginatedResponse<VehicleListItem>>(`/v1/vehicles${query}`);
    },
    findById: (id: string): Promise<ApiResponse<Vehicle>> =>
      apiGet<Vehicle>(`/v1/vehicles/${id}`),
    create: (data: CreateVehicleDto, files?: File[]): Promise<ApiResponse<Vehicle>> => {
      if (files && files.length > 0) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => formData.append(key, v));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        files.forEach((file) => formData.append("files", file));
        return apiPost<Vehicle>("/v1/vehicles", formData as unknown as object);
      }
      return apiPost<Vehicle>("/v1/vehicles", data);
    },
    update: (id: string, data: UpdateVehicleDto): Promise<ApiResponse<Vehicle>> =>
      apiPatch<Vehicle>(`/v1/vehicles/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> =>
      apiDelete(`/v1/vehicles/${id}`),
  },

  makes: {
    findAll: (): Promise<ApiResponse<Make[]>> => apiGet<Make[]>("/v1/makes"),
    findById: (id: string): Promise<ApiResponse<Make>> => apiGet<Make>(`/v1/makes/${id}`),
    create: (data: CreateMakeDto): Promise<ApiResponse<Make>> =>
      apiPost<Make>("/v1/makes", data),
    update: (id: string, data: UpdateMakeDto): Promise<ApiResponse<Make>> =>
      apiPatch<Make>(`/v1/makes/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/makes/${id}`),
  },

  models: {
    findAll: (): Promise<ApiResponse<Model[]>> => apiGet<Model[]>("/v1/models"),
    findById: (id: number): Promise<ApiResponse<Model>> => apiGet<Model>(`/v1/models/${id}`),
    create: (data: CreateModelDto): Promise<ApiResponse<Model>> =>
      apiPost<Model>("/v1/models", data),
    update: (id: number, data: UpdateModelDto): Promise<ApiResponse<Model>> =>
      apiPatch<Model>(`/v1/models/${id}`, data),
    remove: (id: number): Promise<ApiResponse<null>> => apiDelete(`/v1/models/${id}`),
  },

  versions: {
    findAll: (): Promise<ApiResponse<Version[]>> => apiGet<Version[]>("/v1/versions"),
    findById: (id: number): Promise<ApiResponse<Version>> =>
      apiGet<Version>(`/v1/versions/${id}`),
    create: (data: CreateVersionDto): Promise<ApiResponse<Version>> =>
      apiPost<Version>("/v1/versions", data),
    update: (id: number, data: UpdateVersionDto): Promise<ApiResponse<Version>> =>
      apiPatch<Version>(`/v1/versions/${id}`, data),
    remove: (id: number): Promise<ApiResponse<null>> => apiDelete(`/v1/versions/${id}`),
  },

  fuelTypes: {
    findAll: (): Promise<ApiResponse<FuelType[]>> => apiGet<FuelType[]>("/v1/fuel-types"),
    findById: (id: number): Promise<ApiResponse<FuelType>> =>
      apiGet<FuelType>(`/v1/fuel-types/${id}`),
    create: (data: CreateFuelTypeDto): Promise<ApiResponse<FuelType>> =>
      apiPost<FuelType>("/v1/fuel-types", data),
    update: (id: number, data: UpdateFuelTypeDto): Promise<ApiResponse<FuelType>> =>
      apiPatch<FuelType>(`/v1/fuel-types/${id}`, data),
    remove: (id: number): Promise<ApiResponse<null>> => apiDelete(`/v1/fuel-types/${id}`),
  },

  bodyTypes: {
    findAll: (): Promise<ApiResponse<BodyType[]>> => apiGet<BodyType[]>("/v1/body-types"),
    findById: (id: number): Promise<ApiResponse<BodyType>> =>
      apiGet<BodyType>(`/v1/body-types/${id}`),
    create: (data: CreateBodyTypeDto): Promise<ApiResponse<BodyType>> =>
      apiPost<BodyType>("/v1/body-types", data),
    update: (id: number, data: UpdateBodyTypeDto): Promise<ApiResponse<BodyType>> =>
      apiPatch<BodyType>(`/v1/body-types/${id}`, data),
    remove: (id: number): Promise<ApiResponse<null>> => apiDelete(`/v1/body-types/${id}`),
  },

  vehicleTypes: {
    findAll: (): Promise<ApiResponse<VehicleType[]>> =>
      apiGet<VehicleType[]>("/v1/vehicle-types"),
    findById: (id: string): Promise<ApiResponse<VehicleType>> =>
      apiGet<VehicleType>(`/v1/vehicle-types/${id}`),
    create: (data: CreateVehicleTypeDto): Promise<ApiResponse<VehicleType>> =>
      apiPost<VehicleType>("/v1/vehicle-types", data),
    update: (id: string, data: UpdateVehicleTypeDto): Promise<ApiResponse<VehicleType>> =>
      apiPatch<VehicleType>(`/v1/vehicle-types/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/vehicle-types/${id}`),
  },

  tractions: {
    findAll: (): Promise<ApiResponse<Traction[]>> => apiGet<Traction[]>("/v1/tractions"),
    findById: (id: string): Promise<ApiResponse<Traction>> =>
      apiGet<Traction>(`/v1/tractions/${id}`),
    create: (data: CreateTractionDto): Promise<ApiResponse<Traction>> =>
      apiPost<Traction>("/v1/tractions", data),
    update: (id: string, data: UpdateTractionDto): Promise<ApiResponse<Traction>> =>
      apiPatch<Traction>(`/v1/tractions/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/tractions/${id}`),
  },

  services: {
    findAll: (): Promise<ApiResponse<ServiceItem[]>> =>
      apiGet<ServiceItem[]>("/v1/services"),
    findById: (id: string): Promise<ApiResponse<ServiceItem>> =>
      apiGet<ServiceItem>(`/v1/services/${id}`),
    create: (data: CreateServiceDto): Promise<ApiResponse<ServiceItem>> =>
      apiPost<ServiceItem>("/v1/services", data),
    update: (id: string, data: UpdateServiceDto): Promise<ApiResponse<ServiceItem>> =>
      apiPatch<ServiceItem>(`/v1/services/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/services/${id}`),
  },

  warrantyTypes: {
    findAll: (): Promise<ApiResponse<WarrantyTypeItem[]>> =>
      apiGet<WarrantyTypeItem[]>("/v1/warranty-types"),
    findById: (id: string): Promise<ApiResponse<WarrantyTypeItem>> =>
      apiGet<WarrantyTypeItem>(`/v1/warranty-types/${id}`),
    create: (data: CreateWarrantyTypeDto): Promise<ApiResponse<WarrantyTypeItem>> =>
      apiPost<WarrantyTypeItem>("/v1/warranty-types", data),
    update: (id: string, data: UpdateWarrantyTypeDto): Promise<ApiResponse<WarrantyTypeItem>> =>
      apiPatch<WarrantyTypeItem>(`/v1/warranty-types/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/warranty-types/${id}`),
  },

  dgtLabels: {
    findAll: (): Promise<ApiResponse<DgtLabel[]>> => apiGet<DgtLabel[]>("/v1/dgt-labels"),
    findById: (id: string): Promise<ApiResponse<DgtLabel>> =>
      apiGet<DgtLabel>(`/v1/dgt-labels/${id}`),
    create: (data: CreateDgtLabelDto): Promise<ApiResponse<DgtLabel>> =>
      apiPost<DgtLabel>("/v1/dgt-labels", data),
    update: (id: string, data: UpdateDgtLabelDto): Promise<ApiResponse<DgtLabel>> =>
      apiPatch<DgtLabel>(`/v1/dgt-labels/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/dgt-labels/${id}`),
  },

  cuotas: {
    findAll: (): Promise<ApiResponse<Cuota[]>> => apiGet<Cuota[]>("/v1/cuotas"),
    findById: (id: string): Promise<ApiResponse<Cuota>> => apiGet<Cuota>(`/v1/cuotas/${id}`),
    create: (data: CreateCuotaDto): Promise<ApiResponse<Cuota>> =>
      apiPost<Cuota>("/v1/cuotas", data),
    update: (id: string, data: UpdateCuotaDto): Promise<ApiResponse<Cuota>> =>
      apiPatch<Cuota>(`/v1/cuotas/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/cuotas/${id}`),
  },

  features: {
    findAll: (): Promise<ApiResponse<Feature[]>> => apiGet<Feature[]>("/v1/features"),
    findById: (id: string): Promise<ApiResponse<Feature>> =>
      apiGet<Feature>(`/v1/features/${id}`),
    create: (data: CreateFeatureDto): Promise<ApiResponse<Feature>> =>
      apiPost<Feature>("/v1/features", data),
    update: (id: string, data: UpdateFeatureDto): Promise<ApiResponse<Feature>> =>
      apiPatch<Feature>(`/v1/features/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/features/${id}`),
  },

  colors: {
    findAll: (): Promise<ApiResponse<Color[]>> => apiGet<Color[]>("/v1/colors"),
    findById: (id: string): Promise<ApiResponse<Color>> => apiGet<Color>(`/v1/colors/${id}`),
    create: (data: CreateColorDto): Promise<ApiResponse<Color>> =>
      apiPost<Color>("/v1/colors", data),
    update: (id: string, data: UpdateColorDto): Promise<ApiResponse<Color>> =>
      apiPatch<Color>(`/v1/colors/${id}`, data),
    remove: (id: string): Promise<ApiResponse<null>> => apiDelete(`/v1/colors/${id}`),
  },
};
