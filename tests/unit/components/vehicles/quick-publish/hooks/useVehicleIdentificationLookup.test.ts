import { describe, expect, it } from "vitest";
import { useVehicleIdentificationLookup } from "@/components/vehicles/quick-publish/hooks/useVehicleIdentificationLookup";

describe("useVehicleIdentificationLookup", () => {
  it("devuelve stub sin resultado", async () => {
    const lookup = useVehicleIdentificationLookup();

    expect(lookup.isLoading).toBe(false);
    expect(lookup.result).toBeNull();
    expect(lookup.error).toBeNull();

    const result = await lookup.lookupByLicensePlate("1234ABC");
    expect(result).toBeNull();
  });
});
