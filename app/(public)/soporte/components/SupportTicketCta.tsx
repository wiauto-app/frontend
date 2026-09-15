"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";
import { Button } from "@/components/ui/button";

export const SupportTicketCta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenTicket = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
          <MessageCircle className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">
            ¿Necesitas ayuda personalizada?
          </h2>
          <p className="text-sm text-slate-600">
            Abre un ticket y habla con el equipo de soporte desde tu chat.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleOpenTicket}
          aria-label="Abrir formulario de ticket de soporte"
        >
          Enviar un ticket
        </Button>
      </div>

      <CreateTicketDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};
