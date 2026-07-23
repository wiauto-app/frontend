"use client";

import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { formatPhone } from "@/app/(user)/inicio/components/dashboard/dashboard.utils";
import { Button, buttonVariants } from "@/components/ui/button";
import type { LeadListItem, LeadType } from "@/interfaces/lead.interface";
import { openLeadChat } from "@/lib/chat/openLeadChat";
import { cn, getImageUrl } from "@/lib/utils";

interface LeadCardProps {
  lead: LeadListItem;
}

const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  contact: "Contacto",
  call_me: "Llámame",
};

const getVehicleLabel = (lead: LeadListItem): string =>
  lead.vehicle.display_name?.trim() ||
  lead.vehicle.title?.trim() ||
  "Vehículo sin título";

const getBuyerProfileId = (lead: LeadListItem): string | null =>
  lead.buyer_profile_id ?? lead.profile_id;

export const LeadCard = ({ lead }: LeadCardProps) => {
  const router = useRouter();
  const [isOpeningChat, setIsOpeningChat] = useState(false);

  const buyerProfileId = getBuyerProfileId(lead);
  const phoneDisplay = formatPhone(lead.phone_code, lead.phone);
  const telHref =
    lead.phone && lead.phone_code
      ? `tel:${lead.phone_code}${lead.phone}`
      : lead.phone
        ? `tel:${lead.phone}`
        : null;
  const resolveVehicleImageUrl = (value: string): string => {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return getImageUrl(value);
  };

  const vehicleImage = lead.vehicle.image_url ?? lead.vehicle.image;
  const imageUrl = vehicleImage ? resolveVehicleImageUrl(vehicleImage) : null;
  const typeLabel = lead.type ? LEAD_TYPE_LABELS[lead.type] : "Lead";
  const createdLabel = formatDistanceToNow(new Date(lead.created_at), {
    addSuffix: true,
    locale: es,
  });

  const handleOpenChat = async () => {
    if (!buyerProfileId) {
      return;
    }

    setIsOpeningChat(true);
    try {
      const { chatId } = await openLeadChat({
        vehicleId: lead.vehicle_id,
        buyerProfileId,
      });
      toast.success("Chat abierto");
      router.push(`/mensajes?chat_id=${chatId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo abrir el chat",
      );
    } finally {
      setIsOpeningChat(false);
    }
  };

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={getVehicleLabel(lead)}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">{lead.name}</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {typeLabel}
            </span>
          </div>

          <p className="text-sm text-gray-700">{getVehicleLabel(lead)}</p>

          {lead.type === "call_me" && lead.callback_scheduled_at ? (
            <p className="text-sm text-gray-600">
              Callback:{" "}
              {format(new Date(lead.callback_scheduled_at), "PPp", {
                locale: es,
              })}
            </p>
          ) : lead.message ? (
            <p className="line-clamp-3 text-sm text-gray-600">{lead.message}</p>
          ) : null}

          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {createdLabel}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {lead.email ? (
            <a
              href={`mailto:${lead.email}`}
              aria-label={`Enviar correo a ${lead.email}`}
              title={lead.email}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "max-w-full gap-2",
              )}
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{lead.email}</span>
            </a>
          ) : null}

          {telHref ? (
            <a
              href={telHref}
              aria-label={`Llamar a ${lead.name}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Phone className="size-4" aria-hidden />
              {phoneDisplay ?? "Llamar"}
            </a>
          ) : null}

          {buyerProfileId ? (
            <Button
              type="button"
              size="sm"
              disabled={isOpeningChat}
              onClick={() => {
                void handleOpenChat();
              }}
              aria-label={`Abrir chat con ${lead.name}`}
            >
              {isOpeningChat ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <MessageSquare className="size-4" aria-hidden />
              )}
              Abrir chat
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
};
