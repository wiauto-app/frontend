import { describe, expect, it } from "vitest";

import {
  canChangeMemberRole,
  canLeaveTeam,
  canManageTeam,
  canRemoveMember,
} from "@/app/(user)/equipo/utils/teamPermissions";
import { createInvitationSchema } from "@/validations/dealership/team.schema";

describe("dealership team validations", () => {
  it("acepta invitación admin/member válida", () => {
    const result = createInvitationSchema.safeParse({
      email: "miembro@ejemplo.com",
      role: "admin",
      dealership_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza invitar como owner", () => {
    const result = createInvitationSchema.safeParse({
      email: "miembro@ejemplo.com",
      role: "owner",
      dealership_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza email inválido", () => {
    const result = createInvitationSchema.safeParse({
      email: "no-es-email",
      role: "member",
      dealership_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(false);
  });
});

describe("teamPermissions", () => {
  it("owner y admin pueden gestionar equipo", () => {
    expect(canManageTeam("owner")).toBe(true);
    expect(canManageTeam("admin")).toBe(true);
    expect(canManageTeam("member")).toBe(false);
  });

  it("solo member puede salir del equipo", () => {
    expect(canLeaveTeam("member")).toBe(true);
    expect(canLeaveTeam("admin")).toBe(false);
    expect(canLeaveTeam("owner")).toBe(false);
  });

  it("no permite cambiar rol del owner", () => {
    expect(canChangeMemberRole("owner", "owner")).toBe(false);
    expect(canChangeMemberRole("admin", "owner")).toBe(false);
    expect(canChangeMemberRole("admin", "member")).toBe(true);
  });

  it("no permite eliminarse a uno mismo ni al owner", () => {
    expect(
      canRemoveMember("admin", "admin", "member-1", "member-1"),
    ).toBe(false);
    expect(canRemoveMember("admin", "owner", "member-1", "owner-1")).toBe(
      false,
    );
    expect(canRemoveMember("admin", "member", "member-1", "member-2")).toBe(
      true,
    );
  });
});
