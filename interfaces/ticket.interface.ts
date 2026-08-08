export type TicketStatus =
  | "open"
  | "closed"
  | "pending"
  | "in_progress"
  | "resolved"
  | "cancelled";

export interface TicketCategoryRef {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface TicketListItem {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  status: TicketStatus;
  profile_id: string;
  profile_label: string;
  chat_id: string | null;
  created_at: string;
  updated_at: string;
  category: TicketCategoryRef;
}

export interface TicketCategoryListItem {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketPayload {
  category_id: string;
  title: string;
  description: string;
  file_url?: string | null;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  title?: string;
  description?: string;
  category_id?: string;
  file_url?: string | null;
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Abierto",
  closed: "Cerrado",
  pending: "Pendiente",
  in_progress: "En progreso",
  resolved: "Resuelto",
  cancelled: "Cancelado",
};

export const USER_TICKET_STATUS_OPTIONS: {
  value: TicketStatus;
  label: string;
}[] = [
  { value: "closed", label: "Cerrar" },
  { value: "cancelled", label: "Cancelar" },
];
