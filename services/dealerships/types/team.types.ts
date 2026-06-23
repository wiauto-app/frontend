export type DealershipMemberRole = "owner" | "admin" | "member";

export type DealershipInvitationStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export interface DealershipMemberProfileSummary {
  id: string;
  name: string;
  last_name?: string;
  avatar_url?: string;
  email: string;
}

export interface DealershipMemberDetail {
  id: string;
  dealership_id: string;
  profile_id: string;
  role: DealershipMemberRole;
  created_at: string;
  updated_at: string;
  profile: DealershipMemberProfileSummary;
}

export interface DealershipInvitation {
  id: string;
  email: string;
  role: DealershipMemberRole;
  status: DealershipInvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  invited_by_id: string;
  dealership_id: string;
}

export interface DealershipMembership {
  dealership_id: string;
  dealership_name: string;
  member_id: string;
  role: DealershipMemberRole;
}
