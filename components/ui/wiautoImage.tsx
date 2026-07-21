import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import NextImage, { ImageProps as NextImageProps } from "next/image";

interface ImageProps extends NextImageProps {
  src: string;
  alt: string;
  className?: string;
  unoptimized?: boolean;
}

export function WiautoImage({ src, alt, className, unoptimized = true, ...props }: ImageProps) {
  const imageUrl = getImageUrl(src);
  return (
    <NextImage
      unoptimized={unoptimized}
      src={imageUrl}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
