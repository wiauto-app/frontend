"use client";

import { Copy, Mail, MessageCircle, Share, Users } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
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

type ShareOption = {
  platform: VehicleSharePlatform;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    platform: VEHICLE_SHARE_PLATFORMS.WHATSAPP,
    label: "WhatsApp",
    icon: MessageCircle,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.FACEBOOK,
    label: "Facebook",
    icon: Users,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.TWITTER,
    label: "X / Twitter",
    icon: Share,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.LINKEDIN,
    label: "LinkedIn",
    icon: Mail,
  },
  {
    platform: VEHICLE_SHARE_PLATFORMS.COPY_LINK,
    label: "Copiar enlace",
    icon: Copy,
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
      const copied = await copyVehicleShareUrl(params);
      if (copied) {
        toast.success("Enlace copiado");
        recordShare(platform);
        onOpenChange(false);
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Compartir vehículo</DialogTitle>
          <DialogDescription>
            Elige una red social o copia el enlace para compartir este vehículo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {SHARE_OPTIONS.map(({ platform, label, icon: Icon }) => (
            <Button
              key={platform}
              type="button"
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => {
                void handleShare(platform);
              }}
            >
              <Icon className="size-5" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
