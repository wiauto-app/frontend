import { describe, expect, it } from "vitest";

import { getUserSidebarLinks } from "@/app/usuario/constants/user.constants";

describe("getUserSidebarLinks", () => {
  it("muestra Contactos / Leads solo con suscripción", () => {
    const withoutPlan = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: false,
    });
    const withPlan = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: true,
    });

    expect(
      withoutPlan.some((link) => link.href === "/usuario/contactos"),
    ).toBe(false);
    expect(withPlan.some((link) => link.href === "/usuario/contactos")).toBe(
      true,
    );
  });

  it("muestra Monetización siempre", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
    });

    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(
      true,
    );
  });

  it("muestra links pro solo con suscripción", () => {
    const withoutPlan = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: false,
    });
    const withPlan = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: true,
    });

    expect(
      withoutPlan.some((link) => link.href === "/usuario/estadisticas"),
    ).toBe(false);
    expect(withPlan.some((link) => link.href === "/usuario/estadisticas")).toBe(
      true,
    );
    expect(
      withPlan.some((link) => link.href === "/usuario/concesionario"),
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
      isSubscribed: true,
    });

    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(true);
  });

  it("oculta Equipo sin membership aunque haya suscripción", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: true,
    });

    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(false);
  });

  it("muestra Descartados y Equipo con membership", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: {
        dealership_id: "dealer-1",
        dealership_name: "Auto Norte",
        member_id: "member-1",
        role: "admin",
      },
      isSubscribed: true,
    });

    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(
      true,
    );
    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(
      true,
    );
    expect(links.some((link) => link.href === "/usuario/equipo")).toBe(true);
  });

  it("muestra Descartados siempre, sin suscripción", () => {
    const links = getUserSidebarLinks({
      dealershipMembership: null,
      isSubscribed: false,
    });

    expect(links.some((link) => link.href === "/usuario/descartados")).toBe(
      true,
    );
    expect(links.some((link) => link.href === "/usuario/monetizacion")).toBe(
      true,
    );
  });
});
