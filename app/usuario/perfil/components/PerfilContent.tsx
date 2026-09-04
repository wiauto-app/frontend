"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/accountService";
import {
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Mail,
  BookOpen,
  Loader2,
} from "lucide-react";
import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";
import { cn, getImageUrl } from "@/lib/utils";
import { useUser } from "@/app/contexts/auth/useUser";
import { EmailSettingsSection } from "./EmailSettingsSection";
import { PasswordSettingsSection } from "./PasswordSettingsSection";
import { TwoFactorSettingsSection } from "./TwoFactorSettingsSection";
import { DealershipProfileTabContent } from "./DealershipProfileTabContent";
import { ProfileDataForm } from "./profileDataForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PerfilContent = () => {
  const { user, isLoading, refreshUser } = useUser();
  const { isSubscribed } = useEntitlements();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const activeTab =
    searchParams.get("tab") === "dealership" ? "dealership" : "profile";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "dealership") {
      params.set("tab", "dealership");
    } else {
      params.delete("tab");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const {
    data: account,
    isLoading: isLoadingAccount,
    isError: isAccountError,
  } = useQuery({
    queryKey: ["account-settings"],
    queryFn: async () => {
      const response = await accountService.getAccountSettings();
      if (!response.ok || !response.data) {
        throw new Error("No se pudieron cargar los datos de la cuenta");
      }
      return response.data;
    },
    enabled: !isLoading && Boolean(user),
  });

  const handleAccountUpdated = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["account-settings"] }),
      queryClient.invalidateQueries({ queryKey: ["me-profile"] }),
    ]);
    await refreshUser();
  };

  if (isLoading) {
    
    return (
      <div className="p-6 text-center text-gray-500">Cargando perfil...</div>
    );
  }

  const fullName = user?.name
    ? `${user.name} ${user.last_name || ""}`.trim()
    : "Usuario";

  const hasPassword = account?.has_password ?? false;
  const avatarUrl = user?.avatar_url ?? null;

  return (
    <div className="space-y-6 pb-20">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList
          className={cn(
            "grid w-full ",
            isSubscribed ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <TabsTrigger value="profile">Mi perfil</TabsTrigger>
          {isSubscribed && (
            <TabsTrigger value="dealership">
              Perfil de concesionaria
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="flex flex-col gap-5">
          <Card
            size="sm"
            className="bg-blue-100/50 md:flex-row md:items-start"
          >
            <CardContent className="flex items-center gap-4">
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-200 text-2xl font-bold text-blue-700">
                {avatarUrl ? (
                  <Image
                    src={getImageUrl(avatarUrl)}
                    alt={fullName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  (user?.name?.charAt(0).toUpperCase() ?? "U")
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {fullName}
                  </h1>
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="size-3" /> Top vendedor
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <ShieldCheck className="size-3" /> Verificado
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.email ?? "Sin email"}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ProfileDataForm />

            {isLoadingAccount && (
              <div
                className="flex min-h-32 items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                role="status"
                aria-label="Cargando configuración de cuenta"
              >
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {isAccountError && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                No se pudieron cargar los datos de tu cuenta. Intenta recargar
                la página.
              </div>
            )}

            {account && (
              <>
                <EmailSettingsSection
                  account={account}
                  onUpdated={handleAccountUpdated}
                />
                {hasPassword && <PasswordSettingsSection />}
                <TwoFactorSettingsSection
                  account={account}
                  onUpdated={handleAccountUpdated}
                />
              </>
            )}

            <Card size="sm">
              <CardHeader>
                <CardTitle>Soporte</CardTitle>
                <CardDescription>
                  Si tienes alguna pregunta o necesitas ayuda, puedes
                  contactarnos a través de los siguientes medios.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setIsTicketDialogOpen(true)}
                  className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 text-left transition-colors hover:bg-blue-50"
                  aria-label="Enviar un ticket de soporte"
                >
                  <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
                    <MessageCircle className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Envía un ticket
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">ayuda@wiauto.es</p>
                </button>

                <a
                  href="mailto:ayuda@wiauto.es"
                  className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-colors hover:bg-blue-50"
                >
                  <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Mail className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Envía un email
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">ayuda@wiauto.es</p>
                </a>

                <a
                  target="_blank"
                  href="/preguntas-frecuentes"
                  className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-colors hover:bg-blue-50"
                >
                  <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
                    <BookOpen className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Centro de ayuda
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Guías, FAQ y tutoriales
                  </p>
                </a>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <DeleteAccountSection />
            </div>
          </div>
        </TabsContent>

        {isSubscribed && (
          <TabsContent value="dealership">
            <DealershipProfileTabContent />
          </TabsContent>
        )}
      </Tabs>

      <CreateTicketDialog
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
      />
    </div>
  );
};
