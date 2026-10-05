"use client";

import { cn } from "@/lib/utils";

import { MotionStagger } from "./motion";
import {
  AppStoreLink,
  PlayStoreLink,
  type StoreButtonsProps,
} from "./StoreButtons";

export const MobileStoreButtonsMotion = ({
  className,
  soon = false,
}: StoreButtonsProps) => {
  return (
    <MotionStagger
      inView={false}
      className={cn("flex flex-wrap gap-3", className)}
    >
      <AppStoreLink soon={soon} />
      <PlayStoreLink />
    </MotionStagger>
  );
};
