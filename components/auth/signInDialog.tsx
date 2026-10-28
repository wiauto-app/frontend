"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";
import { AUTENTICACION_DEFAULT } from "@/app/(auth)/content/autenticacion.fallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  StrapiAuthCompartido,
  StrapiAuthRegistro,
} from "@/interfaces/strapi-components.interface";
import type { PendingVehiclePayload } from "@/validations/Schemas";

import { RegisterFormContent } from "./registerFormContent";
import { SignInFormContent } from "./signInFormContent";

type AuthDialogTab = "login" | "register";

interface SignInDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onSuccess?: () => void | Promise<void>;
  returnTo?: string;
  /** Anuncio del invitado que se guardará como borrador al registrarse. */
  pendingVehiclePayload?: PendingVehiclePayload;
  onPendingVehicleCreated?: () => void;
}

export const SignInDialog = ({
  open,
  onOpenChange,
  trigger,
  onSuccess,
  returnTo,
  pendingVehiclePayload,
  onPendingVehicleCreated,
}: SignInDialogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { refreshUser } = useUser();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [activeTab, setActiveTab] = useState<AuthDialogTab>("login");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const resolvedReturnTo = returnTo ?? pathname;

  const registerContent = AUTENTICACION_DEFAULT.registro as StrapiAuthRegistro;
  const sharedContent = AUTENTICACION_DEFAULT.compartido as StrapiAuthCompartido;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      setFormKey((current) => current + 1);
      setActiveTab("login");
    }
  };

  const handleSuccess = async () => {
    await refreshUser();
    handleOpenChange(false);
    await onSuccess?.();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent
        className={cn(
          "max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg",
        )}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">
            Iniciar sesión o registrarse
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AuthDialogTab)}
          className="gap-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <SignInFormContent
              key={`login-${formKey}`}
              showTitle={false}
              showFooterLink={false}
              onSwitchToRegister={() => setActiveTab("register")}
              onSuccess={handleSuccess}
              returnTo={resolvedReturnTo}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-0 space-y-4">
            {pendingVehiclePayload ? (
              <p
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
                role="note"
              >
                Publicaremos tu anuncio en cuanto verifiques tu correo.
              </p>
            ) : null}
            <Suspense
              fallback={
                <div
                  className="flex min-h-32 items-center justify-center gap-2 text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  Cargando formulario…
                </div>
              }
            >
              <RegisterFormContent
                key={`register-${formKey}`}
                content={registerContent}
                compartido={sharedContent}
                showTitle={false}
                showFooterLink={false}
                onSwitchToLogin={() => setActiveTab("login")}
                returnTo={resolvedReturnTo}
                pendingVehiclePayload={pendingVehiclePayload}
                onPendingVehicleCreated={onPendingVehicleCreated}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
