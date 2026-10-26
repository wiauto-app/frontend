"use client";

import { CarFront, Copy, Gift, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ReferralInviteCardProps {
  referralCode: string;
  shareUrl: string;
  rewardedCount?: number;
  onCopied?: () => void;
}

const buildInvitationMessage = (shareUrl: string) =>
  `¡Te invito a vender tu coche en WiAuto! Regístrate y publica tu anuncio: ${shareUrl}`;

export const ReferralInviteCard = ({
  referralCode,
  shareUrl,
  rewardedCount = 0,
  onCopied,
}: ReferralInviteCardProps) => {
  const handleCopy = async () => {
    const message = buildInvitationMessage(shareUrl);

    try {
      await navigator.clipboard.writeText(message);
      toast.success("Invitación copiada al portapapeles");
      onCopied?.();
    } catch {
      toast.error("No se pudo copiar la invitación");
    }
  };

  const handleShare = async () => {
    const message = buildInvitationMessage(shareUrl);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Invita a un amigo a WiAuto",
          text: message,
          url: shareUrl,
        });
        return;
      } catch {
        // Usuario canceló o el navegador no permite compartir.
      }
    }

    await handleCopy();
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Gift className="size-5" aria-hidden />
          </div>
          <span className="text-lg font-bold text-gray-900">WiAuto</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          1 destacado gratis
        </span>
      </div>

      <h2 className="text-center text-2xl font-bold text-gray-900">
        ¡Invita a un amigo y gana!
      </h2>
      <p className="mt-1 text-center text-sm text-gray-500">
        Consigue más visibilidad para tu coche.
      </p>

      {rewardedCount > 0 ? (
        <p className="mt-3 text-center text-xs text-emerald-700">
          Has ganado {rewardedCount}{" "}
          {rewardedCount === 1 ? "destacado" : "destacados"} por invitaciones.
        </p>
      ) : null}

      <div className="mt-5 space-y-4 rounded-xl bg-gray-50 p-4">
        <div className="flex gap-3">
          <Share2 className="mt-0.5 size-5 shrink-0 text-gray-500" aria-hidden />
          <div>
            <p className="font-semibold text-gray-900">1. Comparte tu enlace</p>
            <p className="text-sm text-gray-600">
              Invita a alguien que quiera vender su coche.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <CarFront className="mt-0.5 size-5 shrink-0 text-gray-500" aria-hidden />
          <div>
            <p className="font-semibold text-gray-900">
              2. Tu amigo publica su coche
            </p>
            <p className="text-sm text-gray-600">
              Se registra y publica un anuncio válido.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Star className="mt-0.5 size-5 shrink-0 text-gray-500" aria-hidden />
          <div>
            <p className="font-semibold text-gray-900">
              3. ¡Ganas un destacado gratis!
            </p>
            <p className="text-sm text-gray-600">
              Para uno de tus anuncios durante 7 días.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 break-all text-center text-xs text-gray-400">
        Código: {referralCode}
      </p>

      <div className="mt-4 flex flex-col gap-2 ">
        <Button
          type="button"
          className="w-full gap-2 bg-gray-900 text-white hover:bg-gray-800"
          onClick={() => {
            void handleCopy();
          }}
        >
          <Copy className="size-4" aria-hidden />
          Copiar invitación
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            void handleShare();
          }}
        >
          <Share2 className="size-4" aria-hidden />
          Compartir
        </Button>
      </div>
    </div>
  );
};
