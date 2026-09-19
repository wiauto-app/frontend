"use client";

import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { saveAuthReturnTo } from "@/lib/auth/authReturnTo";
import { openDealershipContactChat } from "@/lib/chat/openDealershipContactChat";

import type { DealerProfile } from "../interfaces";

type DealerProfileSidebarProps = {
  dealer: DealerProfile;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-bold text-slate-900">{children}</h3>;
}

export function DealerProfileSidebar({ dealer }: DealerProfileSidebarProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isLoadingSession } = useUser();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const has_contact =
    dealer.contact.phone ||
    dealer.contact.email ||
    dealer.contact.location ||
    dealer.contact.schedule;

  const handleOpenMessageDialog = () => {
    if (!dealer.contactProfileId) {
      toast.error("Este concesionario no tiene un contacto disponible");
      return;
    }

    if (user?.id === dealer.contactProfileId) {
      toast.error("No puedes enviarte un mensaje a ti mismo");
      return;
    }

    setMessage(
      `Hola, me gustaría recibir más información sobre ${dealer.name}.`,
    );
    setIsMessageDialogOpen(true);
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoadingSession || isStartingChat || !message.trim()) return;

    const returnPath = `/concesionario/${dealer.slug}`;
    if (!isAuthenticated) {
      saveAuthReturnTo(returnPath);
      router.push(
        `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(returnPath)}`,
      );
      return;
    }

    if (!dealer.contactProfileId) {
      toast.error("Este concesionario no tiene un contacto disponible");
      return;
    }

    setIsStartingChat(true);
    try {
      const { chat_id } = await openDealershipContactChat({
        dealerProfileId: dealer.contactProfileId,
        dealerName: dealer.name,
        message: message.trim(),
      });
      toast.success("Mensaje enviado correctamente");
      setIsMessageDialogOpen(false);
      router.push(`/usuario/mensajes?chat_id=${chat_id}`);
    } catch {
      toast.error("No se pudo iniciar el chat con el concesionario");
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="relative z-20 space-y-4">
      <Card size="sm">
        <CardContent>
          <div className="relative z-10 size-20 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-sm sm:size-24 mx-auto">
            {dealer.avatar ? (
              <WiautoImage
                src={dealer.avatar ?? ""}
                unoptimized
                alt={dealer.name}
                fill
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-2xl font-bold text-white">
                {dealer.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <h2 className="text-lg font-bold text-slate-900">{dealer.name}</h2>
            {dealer.isVerified ? (
              <ShieldCheck className="size-4 shrink-0" />
            ) : null}
          </div>

          {dealer.reviewCount > 0 ? (
            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm">
              <Star className="size-4 fill-[#FFB800] text-[#FFB800]" />
              <span className="font-bold text-slate-800">
                {dealer.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">
                ({dealer.reviewCount} reseñas)
              </span>
            </div>
          ) : null}

          {dealer.memberSince ? (
            <div className="mt-3 text-xs text-slate-500">
              <div className="flex items-center justify-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />
                Miembro desde {dealer.memberSince}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex w-full flex-col gap-2.5">
            <Button
              id="dealer-send-message"
              type="button"
              className="w-full rounded-xl font-semibold text-white shadow-none"
              onClick={handleOpenMessageDialog}
              disabled={isLoadingSession || isStartingChat}
            >
              {isLoadingSession || isStartingChat ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Enviar mensaje"
              )}
            </Button>
            {dealer.contact.phone ? (
              <Button
                id="dealer-call-btn"
                variant="outline"
                className="w-full rounded-xl font-semibold shadow-none hover:bg-slate-50"
                render={
                  <a href={`tel:${dealer.contact.phone.replace(/\s/g, "")}`}>
                    Llamar
                  </a>
                }
              ></Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {dealer.about ? (
        <Card>
          <CardContent>
            <SectionTitle>Sobre nosotros</SectionTitle>
            <p className="text-sm leading-relaxed text-slate-600">
              {dealer.about}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {has_contact ? (
        <Card>
          <CardContent>
            <SectionTitle>Contacto</SectionTitle>
            <ul className="space-y-3.5 text-sm text-slate-600">
              {dealer.contact.phone ? (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.phone}
                </li>
              ) : null}
              {dealer.contact.email ? (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.email}
                </li>
              ) : null}
              {dealer.contact.location ? (
                <li className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.location}
                </li>
              ) : null}
              {dealer.contact.schedule ? (
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-[#0061F2]" />
                  <span className="whitespace-pre-line">
                    {dealer.contact.schedule}
                  </span>
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {dealer.isVerified ? (
        <div className="overflow-hidden rounded-2xl border-transparent bg-[#F5F8FF] shadow-none">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Vendedor verificado
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Este vendedor ha sido verificado por WiAuto.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog
        open={isMessageDialogOpen}
        onOpenChange={(open) => {
          if (!isStartingChat) setIsMessageDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSendMessage} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Enviar mensaje a {dealer.name}</DialogTitle>
              <DialogDescription>
                Escribe tu consulta. Al enviarla abriremos el chat con el
                concesionario.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label
                htmlFor="dealer-contact-message"
                className="text-sm font-medium text-slate-900"
              >
                Mensaje
              </label>
              <Textarea
                id="dealer-contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Escribe tu mensaje"
                rows={5}
                maxLength={2_000}
                disabled={isStartingChat}
                autoFocus
              />
              <p className="text-right text-xs text-muted-foreground">
                {message.length}/2000
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMessageDialogOpen(false)}
                disabled={isStartingChat}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoadingSession || isStartingChat || !message.trim()
                }
              >
                {isStartingChat ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Enviando...
                  </>
                ) : (
                  "Enviar mensaje"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
