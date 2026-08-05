"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  VEHICLE_SHARE_PLATFORMS,
  VEHICLE_SHARE_SOURCE,
  type VehicleSharePlatform,
} from "@/interfaces/vehicle-list.interface";
import {
  buildVehicleShareActionUrl,
  copyVehicleShareUrl,
  openVehicleShareWindow,
} from "@/lib/share/build-vehicle-share-url";
import { vehicleShareService } from "@/services/vehicleShareService";
import { FaWhatsapp, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa6";
import { FACEBOOK_COLOR, LINKEDIN_COLOR, TWITTER_COLOR, WHATSAPP_COLOR } from "@/components/home/footer/footer.constants";
import { cn } from "@/lib/utils";

type ShareOption = {
  platform: VehicleSharePlatform;
  color: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    platform: VEHICLE_SHARE_PLATFORMS.WHATSAPP,
    color: WHATSAPP_COLOR,
    label: "WhatsApp",
    description: "Envía por chat",
    icon: FaWhatsapp,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.FACEBOOK,
    color: FACEBOOK_COLOR,
    label: "Facebook",
    description: "Comparte en tu muro",
    icon: FaFacebook,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.TWITTER,
    color: TWITTER_COLOR,
    label: "X / Twitter",
    description: "Publica un tweet",
    icon: FaXTwitter,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.LINKEDIN,
    color: LINKEDIN_COLOR,
    label: "LinkedIn",
    description: "Comparte en tu red",
    icon: FaLinkedin,
  },
];

type VehicleShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleTitle: string;
};

export const VehicleShareDialog = ({
  open,
  onOpenChange,
  vehicleId,
  vehicleTitle,
}: VehicleShareDialogProps) => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const recordShare = (platform: VehicleSharePlatform) => {
    void vehicleShareService
      .record(vehicleId, {
        platform,
        source: VEHICLE_SHARE_SOURCE.VEHICLE_LIST_CARD,
        user_id: user?.id,
      })
      .catch(() => {
        // Fire-and-forget: no bloquear la acción de compartir.
      });
  };

  const handleShare = async (platform: VehicleSharePlatform) => {
    const params = { vehicleId, vehicleTitle };

    if (platform === VEHICLE_SHARE_PLATFORMS.COPY_LINK) {
      const copiedOk = await copyVehicleShareUrl(params);
      if (copiedOk) {
        setCopied(true);
        toast.success("Enlace copiado");
        recordShare(platform);
        setTimeout(() => {
          setCopied(false);
          onOpenChange(false);
        }, 700);
        return;
      }
      toast.error("No se pudo copiar el enlace");
      return;
    }

    const shareUrl = buildVehicleShareActionUrl(platform, params);
    if (!shareUrl) {
      toast.error("No se pudo abrir la opción de compartir");
      return;
    }

    openVehicleShareWindow(shareUrl);
    recordShare(platform);
    toast.success("Compartido correctamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Header con acento de marca */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10">
            <Share2 className="size-5 text-primary" aria-hidden />
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg">Compartir vehículo</DialogTitle>
            <DialogDescription className="line-clamp-1">
              {vehicleTitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Grid de redes sociales */}
        <div className="grid grid-cols-2 gap-3 px-6 pt-5">
          {SHARE_OPTIONS.map(({ platform, label, description, color, icon: Icon }) => (
            <button
              key={platform}
              type="button"
              onClick={() => void handleShare(platform)}
              className="group relative flex flex-col items-start gap-2.5 overflow-hidden rounded-xl border border-border/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-md active:translate-y-0 active:shadow-sm"
              style={{ "--brand": color } as React.CSSProperties}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-[0.08]"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span
                className="flex size-14 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${color}1a`,color: color }}
              >
                <Icon className="size-8" 
                 aria-hidden />
              </span>
              <span className="relative">
                <span className="block text-sm font-semibold text-foreground">
                  {label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {description}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Copiar enlace, destacado como acción secundaria */}
        <div className="px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={() => void handleShare(VEHICLE_SHARE_PLATFORMS.COPY_LINK)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium transition-all duration-200",
              copied
                ? "border-solid border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                : "text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            )}
          >
            {copied ? (
              <>
                <Check className="size-4" aria-hidden />
                Enlace copiado
              </>
            ) : (
              <>
                <FaCopy className="size-3.5" aria-hidden />
                Copiar enlace
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};