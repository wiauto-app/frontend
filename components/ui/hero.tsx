import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroProps {
  id?: string;
  image?: string;
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  floatingContent?: React.ReactNode;
  className?: string;
  fade?: boolean;
  imageClassName?: string;
  contentClassName?: string;
}

export const Hero = ({
  id,
  image,
  rightContent,
  leftContent,
  floatingContent,
  className,
  imageClassName,
  contentClassName,
  fade = false,
}: HeroProps) => {
  return (
    <section
      id={id}
      className={cn(
        "relative lg:h-140 rounded-lg py-6 lg:py-12 px-4 lg:px-10 rounded-b-lg overflow-hidden",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt="Hero Background"
          fill
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 960px, 1300px"
          priority
        />
      ) : null}

      {floatingContent}

      {fade ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-linear-to-t from-background via-background/70 to-transparent sm:h-20"
          aria-hidden
        />
      ) : null}

      <div className={cn("relative z-[2] mx-auto flex h-full flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-10", contentClassName)}>
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:items-start">
          {leftContent}
        </div>
        <div className="flex w-full flex-col gap-4">{rightContent}</div>
      </div>
    </section>
  );
};
