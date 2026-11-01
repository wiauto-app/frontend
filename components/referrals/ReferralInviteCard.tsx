"use client";

import type { ReactNode } from "react";
import { CarFront, Copy, Gift, Link2, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReferralInviteCardProps {
  referralCode: string;
  shareUrl: string;
  rewardedCount?: number;
  onCopied?: () => void;
}

const buildInvitationMessage = (shareUrl: string) =>
  `¡Te invito a vender tu coche en WiAuto! Entra en este enlace, regístrate si hace falta y publica tu anuncio: ${shareUrl}`;

const buttonInteractionClass =
  "transition-[transform,opacity] duration-[160ms] ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

interface ReferralStepProps {
  description: string;
  icon: ReactNode;
  step: number;
  title: string;
}

const ReferralStep = ({ description, icon, step, title }: ReferralStepProps) => (
  <li className="flex gap-3">
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
      aria-hidden
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1 pt-0.5">
      <p className="text-sm font-semibold text-gray-900">
        <span className="mr-1.5 tabular-nums text-primary">{step}.</span>
        {title}
      </p>
      <p className="mt-0.5 text-sm leading-snug text-gray-600">{description}</p>
    </div>
  </li>
);

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

  const handleCopyLinkOnly = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
      onCopied?.();
    } catch {
      toast.error("No se pudo copiar el enlace");
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
    <article
      className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_8px_30px_rgba(1,83,232,0.08)]"
      aria-labelledby="referral-invite-heading"
    >
      <div className="border-b border-primary/10 bg-gradient-to-br from-primary/[0.07] via-white to-white px-6 pb-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Gift className="size-5" aria-hidden />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              WiAuto
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 shrink-0" aria-hidden />
            1 destacado gratis
          </span>
        </div>

        <h2
          id="referral-invite-heading"
          className="mt-5 text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          Invita a un amigo y gana
        </h2>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-gray-600">
          Consigue más visibilidad para tu coche cuando publiquen su anuncio.
        </p>

        {rewardedCount > 0 ? (
          <p
            className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-800"
            role="status"
          >
            Has ganado {rewardedCount}{" "}
            {rewardedCount === 1 ? "destacado" : "destacados"} por invitaciones.
          </p>
        ) : null}
      </div>

      <div className="space-y-5 px-6 py-5">
        <ol className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <ReferralStep
            step={1}
            icon={<Share2 className="size-4" />}
            title="Comparte tu enlace"
            description="Invita a alguien que quiera vender su coche."
          />
          <ReferralStep
            step={2}
            icon={<CarFront className="size-4" />}
            title="Tu amigo publica su coche"
            description="Entra con tu enlace, se registra si hace falta y publica un anuncio válido."
          />
          <ReferralStep
            step={3}
            icon={<Sparkles className="size-4" />}
            title="Ganas un destacado gratis"
            description="Para uno de tus anuncios durante 7 días."
          />
        </ol>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Tu enlace de invitación
          </p>
          <div className="flex items-stretch gap-2 rounded-xl border border-primary/15 bg-primary/[0.04] p-1">
            <p
              className="min-w-0 flex-1 break-all px-3 py-2.5 font-mono text-xs leading-relaxed text-gray-800"
              title={shareUrl}
            >
              {shareUrl}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "size-auto shrink-0 rounded-lg border-primary/20 bg-white px-3 hover:bg-primary/5",
                buttonInteractionClass,
              )}
              aria-label="Copiar enlace de invitación"
              onClick={() => {
                void handleCopyLinkOnly();
              }}
            >
              <Link2 className="size-4 text-primary" aria-hidden />
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500">
            Código de referido:{" "}
            <span className="font-semibold tabular-nums text-gray-800">
              {referralCode}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            className={cn(
              "w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
              buttonInteractionClass,
            )}
            aria-label="Copiar mensaje de invitación con enlace"
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
            className={cn(
              "w-full gap-2 border-gray-200 hover:bg-gray-50",
              buttonInteractionClass,
            )}
            aria-label="Compartir invitación a WiAuto"
            onClick={() => {
              void handleShare();
            }}
          >
            <Share2 className="size-4" aria-hidden />
            Compartir
          </Button>
        </div>
      </div>
    </article>
  );
};
