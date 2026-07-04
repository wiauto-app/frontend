import { describe, expect, it } from "vitest";
import { isVehicleAiRateLimited } from "@/components/vehicles/services/vehicleAiService";

describe("vehicleAiService", () => {
  it("detecta respuestas con status 429", () => {
    expect(
      isVehicleAiRateLimited({
        ok: false,
        status: 429,
        message: "Too Many Requests",
        data: null,
      }),
    ).toBe(true);

    expect(
      isVehicleAiRateLimited({
        ok: false,
        status: 400,
        message: "Bad Request",
        data: null,
      }),
    ).toBe(false);
  });
});
