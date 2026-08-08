import { describe, expect, it } from "vitest";

import { getUserSidebarLinks } from "@/app/usuario/constants/user.constants";

describe("getUserSidebarLinks", () => {
  it("incluye Contactos / Leads en la navegación", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
    });

    expect(links.some((link) => link.href === "/usuario/contactos")).toBe(true);
  });

  it("muestra Perfil de concesionaria en la navegación", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
    });

    expect(
      links.some((link) => link.href === "/usuario/perfil?tab=dealership"),
    ).toBe(true);
  });

  it("muestra Equipo cuando hay dealership_membership", () => {
    const links = getUserSidebarLinks({
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
      dealershipMembership: null,
      hasDismissedVehicles: true,
    });

    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(false);
  });

  it("muestra Monetización siempre y Descartados con entitlement", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: {
        dealership_id: "dealer-1",
        dealership_name: "Auto Norte",
        member_id: "member-1",
        role: "admin",
      },
      hasDismissedVehicles: true,
    });

    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(true);
    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(true);
    expect(links.some((link) => link.href === "/usuario/reportes")).toBe(false);
    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(true);
  });

  it("oculta Descartados sin entitlement", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
      hasDismissedVehicles: false,
    });

    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(
      false,
    );
    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(
      true,
    );
  });
});
