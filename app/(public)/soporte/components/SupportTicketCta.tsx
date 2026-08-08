"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { saveAuthReturnTo } from "@/lib/auth/authReturnTo";

export const SupportTicketCta = () => {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenTicket = () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      saveAuthReturnTo("/soporte");
      router.push(`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent("/soporte")}`);
      return;
    }

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
          disabled={isLoading}
          aria-label="Abrir formulario de ticket de soporte"
        >
          Enviar un ticket
        </Button>
      </div>

      <CreateTicketDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};
