"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  getSocialNetworksByIds,
  NEWS_SHARE_NETWORK_IDS,
  type SocialNetworkConfig,
  type SocialNetworkId,
} from "@/components/home/footer/footer.constants";
import {
  buildShareActionUrl,
  copyShareUrl,
  openShareWindow,
} from "@/lib/share/build-share-url";
import { cn } from "@/lib/utils";

interface NewsShareButtonsProps {
  url: string;
  title: string;
  imageUrl?: string;
  className?: string;
}

const SHARE_NETWORKS = getSocialNetworksByIds(NEWS_SHARE_NETWORK_IDS);

export const NewsShareButtons = ({
  url,
  title,
  imageUrl,
  className,
}: NewsShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (network: SocialNetworkConfig) => {
    if (network.id === "copy_link") {
      const copiedOk = await copyShareUrl(url);

      if (!copiedOk) {
        toast.error("No se pudo copiar el enlace");
        return;
      }

      setCopied(true);
      toast.success("Enlace copiado");
      window.setTimeout(() => setCopied(false), 2000);
      return;
    }

    const shareUrl = buildShareActionUrl(network.id as SocialNetworkId, {
      url,
      title,
      imageUrl,
    });

    if (!shareUrl) {
      toast.error("No se pudo abrir esta opción");
      return;
    }

    openShareWindow(shareUrl);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SHARE_NETWORKS.map((network) => {
        const Icon = network.Icon;
        const isCopy = network.id === "copy_link";
        const label = isCopy && copied ? "Enlace copiado" : network.label;

        return (
          <button
            key={network.id}
            type="button"
            aria-label={label}
            onClick={() => {
              void handleShare(network);
            }}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Icon
              className="size-4"
              color={isCopy && copied ? "#16A34A" : network.color}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
};
