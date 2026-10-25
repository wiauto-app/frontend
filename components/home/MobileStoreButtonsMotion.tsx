import { cn } from "@/lib/utils";

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
    <div className={cn("flex flex-wrap gap-3 overflow-x-clip", className)}>
      <AppStoreLink soon={soon} />
      <PlayStoreLink />
    </div>
  );
};
