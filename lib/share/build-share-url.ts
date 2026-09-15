import type { SocialNetworkId } from "@/components/home/footer/footer.constants";

export interface BuildShareActionParams {
  url: string;
  title?: string;
  imageUrl?: string;
}

export const buildShareMessage = ({
  url,
  title,
}: BuildShareActionParams): string => {
  const trimmedTitle = title?.trim();

  if (!trimmedTitle) {
    return url;
  }

  return `${trimmedTitle} - ${url}`;
};

export const buildShareActionUrl = (
  networkId: SocialNetworkId,
  params: BuildShareActionParams,
): string | null => {
  const url = params.url.trim();
  if (!url) {
    return null;
  }

  const message = buildShareMessage(params);
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);
  const encodedTitle = encodeURIComponent(params.title?.trim() ?? "");

  switch (networkId) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedMessage}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case "pinterest": {
      const media = params.imageUrl
        ? `&media=${encodeURIComponent(params.imageUrl)}`
        : "";
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}${media}`;
    }
    case "copy_link":
      return url;
    default:
      return null;
  }
};

export const copyShareUrl = async (url: string): Promise<boolean> => {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

export const openShareWindow = (shareUrl: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
};
