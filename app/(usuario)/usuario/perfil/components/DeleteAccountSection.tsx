"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { logoutAction } from "@/app/(auth)/authActions/authActions";
import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/ui/customAlertDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEntitlements } from "@/hooks/useEntitlements";
import { accountService } from "@/services/accountService";

export const DeleteAccountSection = () => {
  const router = useRouter();
  const { logout } = useUser();
  const { billingSummary, isSubscribed, planName } = useEntitlements();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const subscriptionStatus = billingSummary?.subscription?.status;
  const hasBillableSubscription =
    isSubscribed ||
    subscriptionStatus === "trialing" ||
    subscriptionStatus === "past_due" ||
    subscriptionStatus === "unpaid";

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await accountService.deleteAccount();
      if (!response.ok) {
        toast.error(
          accountService.getResponseMessage(
            response,
            "No se pudo eliminar la cuenta",
          ),
        );
        return;
      }

      toast.success("Tu cuenta ha sido eliminada");
      try {
        await logout();
      } catch {
        // La sesión puede quedar inválida tras el borrado.
      }
      await logoutAction();
      router.replace("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cuenta",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <Card size="sm" className="border-red-200 bg-red-50/60">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-100 p-2 text-red-600">
            <AlertCircle className="size-5" aria-hidden />
          </div>
          <div>
            <CardTitle className="text-red-700">Zona peligrosa</CardTitle>
            <CardDescription className="text-slate-600">
              Eliminar tu cuenta es permanente. Perderás el acceso a tus
              anuncios, mensajes y configuración.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CustomAlertDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingAccount}
              aria-label="Eliminar cuenta"
            >
              Eliminar cuenta
            </Button>
          }
          title="¿Eliminar tu cuenta?"
          description={
            <span className="flex flex-col gap-2 text-left">
              <span>
                Esta acción es irreversible. Se eliminarán tus datos de perfil
                y tus anuncios dejarán de estar disponibles.
              </span>
              {hasBillableSubscription ? (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  Tienes una suscripción activa
                  {planName ? ` (${planName})` : ""}. Al confirmar, se cancelará
                  de inmediato sin reembolso del periodo ya pagado.
                </span>
              ) : null}
              <span>Si no estás seguro, cancela y contacta con soporte.</span>
            </span>
          }
          confirmText="Eliminar cuenta"
          cancelText="Cancelar"
          confirmVariant="destructive"
          isConfirming={isDeletingAccount}
          onConfirm={handleDeleteAccount}
        />
      </CardContent>
    </Card>
  );
};
