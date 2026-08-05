import { describe, expect, it } from "vitest";

import { getUserSidebarLinks } from "@/app/usuario/constants/user.constants";
import { PUBLISHER_TYPE } from "@/interfaces/vehicle.interface";

describe("getUserSidebarLinks", () => {
  it("incluye Contactos / Leads en la navegación", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PARTICULAR,
      dealershipMembership: null,
    });

    expect(links.some((link) => link.href === "/usuario/contactos")).toBe(true);
  });

  it("muestra Perfil de concesionaria en la navegación", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PARTICULAR,
      dealershipMembership: null,
    });

    expect(
      links.some((link) => link.href === "/usuario/perfil?tab=dealership"),
    ).toBe(true);
  });

  it("muestra Equipo cuando hay dealership_membership", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PARTICULAR,
      dealershipMembership: {
        dealership_id: "dealer-1",
        dealership_name: "Auto Norte",
        member_id: "member-1",
        role: "member",
      },
    });

    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(true);
  });

  it("oculta Equipo sin membership", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PROFESSIONAL,
      dealershipMembership: null,
    });

    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(false);
  });

  it("muestra links profesionales y Equipo para usuario professional con membership", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PROFESSIONAL,
      dealershipMembership: {
        dealership_id: "dealer-1",
        dealership_name: "Auto Norte",
        member_id: "member-1",
        role: "admin",
      },
    });

    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(true);
    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(true);
    expect(links.some((link) => link.href === "/usuario/reportes")).toBe(false);
    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(true);
  });

  it("oculta Descartados para particulares", () => {
    const links = getUserSidebarLinks({
      userType: PUBLISHER_TYPE.PARTICULAR,
      dealershipMembership: null,
    });

    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(
      false,
    );
  });
});
