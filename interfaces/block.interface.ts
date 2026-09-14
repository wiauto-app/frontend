export interface UserBlockListItem {
  id: string;
  blocked_profile_id: string;
  created_at: string;
}

export interface CreateUserBlockDto {
  blocked_profile_id: string;
}
