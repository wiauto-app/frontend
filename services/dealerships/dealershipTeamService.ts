import { apiDelete, apiGet, apiPatch } from "@/lib/api";
import { V1_DEALERSHIPS } from "./route.constants";
import type { DealershipMemberDetail } from "./types/team.types";
import type { UpdateMemberRoleDto } from "@/validations/dealership/team.schema";

export const dealershipTeamService = {
  getTeam: async (dealershipId: string): Promise<DealershipMemberDetail[]> => {
    const response = await apiGet<DealershipMemberDetail[]>(
      `${V1_DEALERSHIPS}/${dealershipId}/team`,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudo cargar el equipo");
    }
    return response.data;
  },

  updateMemberRole: async (
    dealershipId: string,
    memberId: string,
    data: UpdateMemberRoleDto,
  ): Promise<void> => {
    const response = await apiPatch<void>(
      `${V1_DEALERSHIPS}/${dealershipId}/members/${memberId}`,
      data,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudo actualizar el rol");
    }
  },

  removeMember: async (dealershipId: string, memberId: string): Promise<void> => {
    const response = await apiDelete<void>(
      `${V1_DEALERSHIPS}/${dealershipId}/members/${memberId}`,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudo eliminar al miembro");
    }
  },

  leaveTeam: async (dealershipId: string): Promise<void> => {
    const response = await apiDelete<void>(
      `${V1_DEALERSHIPS}/${dealershipId}/members/me`,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudo salir del equipo");
    }
  },
};
