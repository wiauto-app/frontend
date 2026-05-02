import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api";
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

const buildQueryParams = (params: Record<string, string | number | boolean | string[] | number[] | undefined | null>): string => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return "";

  const queryParts = entries
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");

  return `?${queryParts}`;
};

export const vehicleService = {
  vehicles: {
    findAll: (params?: FindAllVehiclesParams): Promise<PaginatedResponse<VehicleListItem>> => {
      const query = buildQueryParams(params as Record<string, string | number | boolean | string[] | undefined> ?? {});
      return apiGet(`/api/v1/vehicles${query}`);
    },
    findById: (id: string): Promise<Vehicle> => apiGet(`/api/v1/vehicles/${id}`),
    create: (data: CreateVehicleDto, files?: File[]): Promise<Vehicle> => {
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
        return apiPost("/api/v1/vehicles", formData as unknown as object);
      }
      return apiPost("/api/v1/vehicles", data);
    },
    update: (id: string, data: UpdateVehicleDto): Promise<Vehicle> =>
      apiPatch(`/api/v1/vehicles/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/vehicles/${id}`),
  },

  makes: {
    findAll: (): Promise<Make[]> => apiGet("/api/v1/makes"),
    findById: (id: string): Promise<Make> => apiGet(`/api/v1/makes/${id}`),
    create: (data: CreateMakeDto): Promise<Make> => apiPost("/api/v1/makes", data),
    update: (id: string, data: UpdateMakeDto): Promise<Make> =>
      apiPatch(`/api/v1/makes/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/makes/${id}`),
  },

  models: {
    findAll: (): Promise<Model[]> => apiGet("/api/v1/models"),
    findById: (id: number): Promise<Model> => apiGet(`/api/v1/models/${id}`),
    create: (data: CreateModelDto): Promise<Model> => apiPost("/api/v1/models", data),
    update: (id: number, data: UpdateModelDto): Promise<Model> =>
      apiPatch(`/api/v1/models/${id}`, data),
    remove: (id: number): Promise<void> => apiDelete(`/api/v1/models/${id}`),
  },

  versions: {
    findAll: (): Promise<Version[]> => apiGet("/api/v1/versions"),
    findById: (id: number): Promise<Version> => apiGet(`/api/v1/versions/${id}`),
    create: (data: CreateVersionDto): Promise<Version> => apiPost("/api/v1/versions", data),
    update: (id: number, data: UpdateVersionDto): Promise<Version> =>
      apiPatch(`/api/v1/versions/${id}`, data),
    remove: (id: number): Promise<void> => apiDelete(`/api/v1/versions/${id}`),
  },

  fuelTypes: {
    findAll: (): Promise<FuelType[]> => apiGet("/api/v1/fuel-types"),
    findById: (id: number): Promise<FuelType> => apiGet(`/api/v1/fuel-types/${id}`),
    create: (data: CreateFuelTypeDto): Promise<FuelType> => apiPost("/api/v1/fuel-types", data),
    update: (id: number, data: UpdateFuelTypeDto): Promise<FuelType> =>
      apiPatch(`/api/v1/fuel-types/${id}`, data),
    remove: (id: number): Promise<void> => apiDelete(`/api/v1/fuel-types/${id}`),
  },

  bodyTypes: {
    findAll: (): Promise<BodyType[]> => apiGet("/api/v1/body-types"),
    findById: (id: number): Promise<BodyType> => apiGet(`/api/v1/body-types/${id}`),
    create: (data: CreateBodyTypeDto): Promise<BodyType> => apiPost("/api/v1/body-types", data),
    update: (id: number, data: UpdateBodyTypeDto): Promise<BodyType> =>
      apiPatch(`/api/v1/body-types/${id}`, data),
    remove: (id: number): Promise<void> => apiDelete(`/api/v1/body-types/${id}`),
  },

  vehicleTypes: {
    findAll: (): Promise<VehicleType[]> => apiGet("/api/v1/vehicle-types"),
    findById: (id: string): Promise<VehicleType> => apiGet(`/api/v1/vehicle-types/${id}`),
    create: (data: CreateVehicleTypeDto): Promise<VehicleType> =>
      apiPost("/api/v1/vehicle-types", data),
    update: (id: string, data: UpdateVehicleTypeDto): Promise<VehicleType> =>
      apiPatch(`/api/v1/vehicle-types/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/vehicle-types/${id}`),
  },

  tractions: {
    findAll: (): Promise<Traction[]> => apiGet("/api/v1/tractions"),
    findById: (id: string): Promise<Traction> => apiGet(`/api/v1/tractions/${id}`),
    create: (data: CreateTractionDto): Promise<Traction> => apiPost("/api/v1/tractions", data),
    update: (id: string, data: UpdateTractionDto): Promise<Traction> =>
      apiPatch(`/api/v1/tractions/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/tractions/${id}`),
  },

  services: {
    findAll: (): Promise<ServiceItem[]> => apiGet("/api/v1/services"),
    findById: (id: string): Promise<ServiceItem> => apiGet(`/api/v1/services/${id}`),
    create: (data: CreateServiceDto): Promise<ServiceItem> => apiPost("/api/v1/services", data),
    update: (id: string, data: UpdateServiceDto): Promise<ServiceItem> =>
      apiPatch(`/api/v1/services/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/services/${id}`),
  },

  warrantyTypes: {
    findAll: (): Promise<WarrantyTypeItem[]> => apiGet("/api/v1/warranty-types"),
    findById: (id: string): Promise<WarrantyTypeItem> => apiGet(`/api/v1/warranty-types/${id}`),
    create: (data: CreateWarrantyTypeDto): Promise<WarrantyTypeItem> =>
      apiPost("/api/v1/warranty-types", data),
    update: (id: string, data: UpdateWarrantyTypeDto): Promise<WarrantyTypeItem> =>
      apiPatch(`/api/v1/warranty-types/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/warranty-types/${id}`),
  },

  dgtLabels: {
    findAll: (): Promise<DgtLabel[]> => apiGet("/api/v1/dgt-labels"),
    findById: (id: string): Promise<DgtLabel> => apiGet(`/api/v1/dgt-labels/${id}`),
    create: (data: CreateDgtLabelDto): Promise<DgtLabel> => apiPost("/api/v1/dgt-labels", data),
    update: (id: string, data: UpdateDgtLabelDto): Promise<DgtLabel> =>
      apiPatch(`/api/v1/dgt-labels/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/dgt-labels/${id}`),
  },

  cuotas: {
    findAll: (): Promise<Cuota[]> => apiGet("/api/v1/cuotas"),
    findById: (id: string): Promise<Cuota> => apiGet(`/api/v1/cuotas/${id}`),
    create: (data: CreateCuotaDto): Promise<Cuota> => apiPost("/api/v1/cuotas", data),
    update: (id: string, data: UpdateCuotaDto): Promise<Cuota> =>
      apiPatch(`/api/v1/cuotas/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/cuotas/${id}`),
  },

  features: {
    findAll: (): Promise<Feature[]> => apiGet("/api/v1/features"),
    findById: (id: string): Promise<Feature> => apiGet(`/api/v1/features/${id}`),
    create: (data: CreateFeatureDto): Promise<Feature> => apiPost("/api/v1/features", data),
    update: (id: string, data: UpdateFeatureDto): Promise<Feature> =>
      apiPatch(`/api/v1/features/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/features/${id}`),
  },

  colors: {
    findAll: (): Promise<Color[]> => apiGet("/api/v1/colors"),
    findById: (id: string): Promise<Color> => apiGet(`/api/v1/colors/${id}`),
    create: (data: CreateColorDto): Promise<Color> => apiPost("/api/v1/colors", data),
    update: (id: string, data: UpdateColorDto): Promise<Color> =>
      apiPatch(`/api/v1/colors/${id}`, data),
    remove: (id: string): Promise<void> => apiDelete(`/api/v1/colors/${id}`),
  },
};
