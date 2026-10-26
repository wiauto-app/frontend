import type { DealershipMemberRole } from "@/services/dealerships/types/team.types";

export const canManageTeam = (role?: DealershipMemberRole): boolean =>
  role === "owner" || role === "admin";

export const canManageInvitations = canManageTeam;

export const canLeaveTeam = (role?: DealershipMemberRole): boolean =>
  role === "member";

export const canChangeMemberRole = (
  actorRole?: DealershipMemberRole,
  targetRole?: DealershipMemberRole,
): boolean => {
  if (!canManageTeam(actorRole) || !targetRole) {
    return false;
  }

  return targetRole !== "owner";
};

export const canRemoveMember = (
  actorRole?: DealershipMemberRole,
  targetRole?: DealershipMemberRole,
  actorMemberId?: string,
  targetMemberId?: string,
): boolean => {
  if (actorMemberId && targetMemberId && actorMemberId === targetMemberId) {
    return false;
  }

  if (!canManageTeam(actorRole) || !targetRole) {
    return false;
  }

  return targetRole !== "owner";
};

export const getRoleLabel = (role: DealershipMemberRole): string => {
  switch (role) {
    case "owner":
      return "Propietario";
    case "admin":
      return "Administrador";
    default:
      return "Miembro";
  }
};

export const getRoleBadgeClass = (role: DealershipMemberRole): string => {
  switch (role) {
    case "owner":
      return "bg-amber-100 text-amber-800";
    case "admin":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
