import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { PaginatedResult } from "@/types/general.types";
import { objectToQueryString } from "@/lib/utils";
import { V1_DEALERSHIP_INVITATIONS } from "./route.constants";
import type { DealershipInvitation } from "./types/team.types";
import type { CreateInvitationDto } from "@/validations/dealership/team.schema";

export type ListInvitationsParams = {
  dealership_id: string;
  status?: "pending" | "accepted" | "revoked" | "expired";
  page?: number;
  limit?: number;
};

export const dealershipInvitationService = {
  createInvitation: async (data: CreateInvitationDto): Promise<void> => {
    const response = await apiPost<void>(V1_DEALERSHIP_INVITATIONS, data);
    if (!response.ok) {
      throw new Error(response.message || "No se pudo enviar la invitación");
    }
  },

  listInvitations: async (
    params: ListInvitationsParams,
  ): Promise<PaginatedResult<DealershipInvitation>> => {
    const query = objectToQueryString({
      dealership_id: params.dealership_id,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });

    const response = await apiGet<PaginatedResult<DealershipInvitation>>(
      `${V1_DEALERSHIP_INVITATIONS}?${query}`,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudieron cargar las invitaciones");
    }
    return response.data;
  },

  revokeInvitation: async (invitationId: string): Promise<void> => {
    const response = await apiDelete<void>(
      `${V1_DEALERSHIP_INVITATIONS}/${invitationId}`,
    );
    if (!response.ok) {
      throw new Error(response.message || "No se pudo revocar la invitación");
    }
  },
};
