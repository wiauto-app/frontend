"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChatTicketSummary } from "@/interfaces/chat.interface";
import {
  TICKET_STATUS_LABELS,
  USER_TICKET_STATUS_OPTIONS,
  type TicketStatus,
} from "@/interfaces/ticket.interface";
import { ticketsService } from "@/services/tickets/ticketsService";

interface ChatTicketStatusPanelProps {
  ticket: ChatTicketSummary;
}

export const ChatTicketStatusPanel = ({
  ticket,
}: ChatTicketStatusPanelProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: TicketStatus) => {
      const response = await ticketsService.update(ticket.id, { status });
      if (!response.ok) {
        throw new Error(response.message || "No se pudo actualizar el estado");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Estado del ticket actualizado");
      void queryClient.invalidateQueries({ queryKey: ["chat-list"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const canChangeStatus =
    ticket.status !== "closed" && ticket.status !== "cancelled";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
          Ticket de soporte
        </p>
        <p className="truncate text-sm font-semibold text-slate-900">
          {ticket.title}
        </p>
        <p className="text-xs text-muted-foreground">
          Estado: {TICKET_STATUS_LABELS[ticket.status]}
        </p>
      </div>

      {canChangeStatus ? (
        <Select
          value={undefined}
          onValueChange={(value) => {
            if (!value) return;
            mutation.mutate(value as TicketStatus);
          }}
          disabled={mutation.isPending}
          items={USER_TICKET_STATUS_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        >
          <SelectTrigger
            className="w-[10rem]"
            aria-label="Cambiar estado del ticket"
          >
            <SelectValue placeholder="Cambiar estado" />
          </SelectTrigger>
          <SelectContent>
            {USER_TICKET_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
};
