"use client";

import { useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import {
  FACEBOOK_COLOR,
  LINKEDIN_COLOR,
  TWITTER_COLOR,
  WHATSAPP_COLOR,
} from "@/components/home/footer/footer.constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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

type ShareOption = {
  platform: VehicleSharePlatform;
  color: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    platform: VEHICLE_SHARE_PLATFORMS.WHATSAPP,
    color: WHATSAPP_COLOR,
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.FACEBOOK,
    color: FACEBOOK_COLOR,
    label: "Facebook",
    icon: FaFacebook,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.TWITTER,
    color: TWITTER_COLOR,
    label: "X",
    icon: FaXTwitter,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.LINKEDIN,
    color: LINKEDIN_COLOR,
    label: "LinkedIn",
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
  const visibleUrl = `/vehiculo/${vehicleId}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCopied(false);
    }
    onOpenChange(nextOpen);
  };

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

  const handleShare = (platform: VehicleSharePlatform) => {
    const shareUrl = buildVehicleShareActionUrl(platform, {
      vehicleId,
      vehicleTitle,
    });

    if (!shareUrl) {
      toast.error("No se pudo abrir esta opción");
      return;
    }

    openVehicleShareWindow(shareUrl);
    recordShare(platform);
    handleOpenChange(false);
  };

  const handleCopy = async () => {
    const copiedOk = await copyVehicleShareUrl({ vehicleId, vehicleTitle });

    if (!copiedOk) {
      toast.error("No se pudo copiar el enlace");
      return;
    }

    setCopied(true);
    recordShare(VEHICLE_SHARE_PLATFORMS.COPY_LINK);
    toast.success("Enlace copiado");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 sm:max-w-xl">
        <DialogHeader className="pr-8">
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Share2 className="size-5" aria-hidden />
          </div>
          <DialogTitle>Compartir vehículo</DialogTitle>
          <DialogDescription>
            Envía este anuncio a quien quieras.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-border">
            <Link2 className="size-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {vehicleTitle}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {visibleUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Compartir en
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SHARE_OPTIONS.map(({ platform, label, color, icon: Icon }) => (
              <Button
                key={platform}
                type="button"
                variant="ghost"
                className="group/button h-auto flex-col gap-2 py-3"
                aria-label={`Compartir en ${label}`}
                onClick={() => handleShare(platform)}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-full transition-transform duration-200 group-hover/button:scale-105"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2 rounded-lg bg-muted/60 p-1.5 pl-3">
          <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {visibleUrl}
          </p>
          <Button
            type="button"
            variant={copied ? "secondary" : "default"}
            onClick={() => void handleCopy()}
          >
            {copied ? (
              <Check data-icon="inline-start" aria-hidden />
            ) : (
              <Copy data-icon="inline-start" aria-hidden />
            )}
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
