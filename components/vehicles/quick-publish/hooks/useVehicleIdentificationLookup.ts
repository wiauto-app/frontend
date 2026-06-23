export type VehicleIdentificationLookupResult = {
  make?: string;
  model?: string;
  year?: number;
  version?: string;
  fuel_type?: string;
};

export const useVehicleIdentificationLookup = () => ({
  lookupByLicensePlate: async (_plate: string) =>
    null as VehicleIdentificationLookupResult | null,
  isLoading: false,
  result: null as VehicleIdentificationLookupResult | null,
  error: null as string | null,
});
