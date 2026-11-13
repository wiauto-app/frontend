import { describe, expect, it } from "vitest";
import { getDealershipPublishContactDefaults } from "@/components/vehicles/quick-publish/utils/getDealershipPublishContactDefaults";
import type { DealershipMembership } from "@/services/dealerships/types/team.types";

const baseMembership: DealershipMembership = {
  dealership_id: "d-1",
  dealership_name: "Auto Norte",
  member_id: "m-1",
  role: "owner",
  phone_code: "+34",
  phone: "600111222",
};

describe("getDealershipPublishContactDefaults", () => {
  it("devuelve null sin membership", () => {
    expect(getDealershipPublishContactDefaults(null)).toBeNull();
    expect(getDealershipPublishContactDefaults(undefined)).toBeNull();
  });

  it("devuelve null si falta teléfono útil", () => {
    expect(
      getDealershipPublishContactDefaults({
        ...baseMembership,
        phone: "   ",
      }),
    ).toBeNull();
    expect(
      getDealershipPublishContactDefaults({
        ...baseMembership,
        phone_code: "",
      }),
    ).toBeNull();
  });

  it("incluye teléfono y recorta espacios", () => {
    expect(
      getDealershipPublishContactDefaults({
        ...baseMembership,
        phone: " 600111222 ",
        phone_code: " +34 ",
      }),
    ).toEqual({
      phone_code: "+34",
      phone: "600111222",
    });
  });

  it("añade coordenadas solo si lat y lng son finitos", () => {
    expect(
      getDealershipPublishContactDefaults({
        ...baseMembership,
        lat: 40.4168,
        lng: -3.7038,
      }),
    ).toEqual({
      phone_code: "+34",
      phone: "600111222",
      lat: 40.4168,
      lng: -3.7038,
    });

    expect(
      getDealershipPublishContactDefaults({
        ...baseMembership,
        lat: null,
        lng: -3.7038,
      }),
    ).toEqual({
      phone_code: "+34",
      phone: "600111222",
    });
  });
});
