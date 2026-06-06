import { apiGet } from "@/lib/api";
import type {
  PaginatedResult,
} from "@/interfaces/chat.interface";
import type { Profile, ProfileSearchParams } from "@/interfaces/profile.interface";

const V1_PROFILES = "/v1/profiles";

export const profileService = {
  getProfiles: async (
    filter?: ProfileSearchParams,
  ): Promise<PaginatedResult<Profile> | null> => {
    const response = await apiGet<PaginatedResult<Profile>>(V1_PROFILES, {
      page: filter?.page ?? 1,
      limit: filter?.limit ?? 20,
      name: filter?.name,
      email: filter?.email,
    });

    if (!response.ok) {
      return null;
    }

    return response.data;
  },
};
