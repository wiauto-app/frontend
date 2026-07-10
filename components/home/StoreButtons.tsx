import { FaApple, FaGooglePlay } from "react-icons/fa";
import type { StoreButtonLabels } from "./types/home-page.types";

type StoreButtonsProps = {
  className?: string;
  google_store_labels: StoreButtonLabels;
  apple_store_labels: StoreButtonLabels;
};

export function StoreButtons({
  className,
  google_store_labels,
  apple_store_labels,
}: StoreButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity hover:opacity-90"
        aria-label={`${apple_store_labels.line1} ${apple_store_labels.line2}`}
      >
        <FaApple className="size-6"/>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] leading-none">{apple_store_labels.line1}</span>
          <span className="text-[15px] font-semibold leading-tight">
            {apple_store_labels.line2}
          </span>
        </span>
      </a>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border border-white/20 bg-white px-4 text-black transition-opacity hover:opacity-95"
        aria-label={`${google_store_labels.line1} ${google_store_labels.line2}`}
      >
        <FaGooglePlay className="size-6"/>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-medium uppercase leading-none">
            {google_store_labels.line1}
          </span>
          <span className="text-[15px] font-semibold leading-tight">
            {google_store_labels.line2}
          </span>
        </span>
      </a>
    </div>
  );
}

