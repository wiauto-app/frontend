"use client";

import Image from "next/image";
import { FaApple } from "react-icons/fa";

import { cn } from "@/lib/utils";

import { MotionSection } from "./motion";

interface StoreButtonsProps {
  className?: string;
  /** When true (default), wraps with fade-up on mount for above-the-fold use */
  animateEntrance?: boolean;
}

export function StoreButtons({
  className,
  animateEntrance = false,
}: StoreButtonsProps) {
  const content = (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity hover:opacity-90"
        aria-label="App Store"
      >
        <FaApple className="size-6" />
        <span className="flex flex-col leading-tight">
          <span className="hidden text-[10px] leading-none lg:block">
            Descarga la app
          </span>
          <span className="text-[15px] leading-tight font-semibold">
            En la App Store
          </span>
        </span>
      </a>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border-2 bg-white px-4 text-black transition-opacity hover:opacity-95"
        aria-label="Google Play"
      >
        <Image
          src="/icons/playStore.svg"
          alt="Google Play"
          width={24}
          height={24}
          sizes="24px"
        />
        <span className="flex flex-col leading-tight">
          <span className="hidden text-[9px] font-medium tracking-wide uppercase leading-none lg:block">
            Descarga la app
          </span>
          <span className="text-[15px] leading-tight font-semibold">
            En Google Play
          </span>
        </span>
      </a>
    </div>
  );

  if (!animateEntrance) {
    return content;
  }

  return <MotionSection inView={false}>{content}</MotionSection>;
}
