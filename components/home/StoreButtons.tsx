type StoreButtonsProps = {
  className?: string;
};

export function StoreButtons({ className }: StoreButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity hover:opacity-90"
        aria-label="Descargar en App Store"
      >
        <AppleIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] leading-none">Download on the</span>
          <span className="text-[15px] font-semibold leading-tight">App Store</span>
        </span>
      </a>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border border-white/20 bg-white px-4 text-black transition-opacity hover:opacity-95"
        aria-label="Descargar en Google Play"
      >
        <GooglePlayIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-medium uppercase leading-none">GET IT ON</span>
          <span className="text-[15px] font-semibold leading-tight">Google Play</span>
        </span>
      </a>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg className="size-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg className="size-7 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#00A0FF" d="M4.5 2.5v19l10.5-9.5L4.5 2.5z" />
      <path fill="#00D654" d="M15 12 4.5 21.5 19 14.5 15 12z" />
      <path fill="#FFBA00" d="M4.5 2.5 15 12l4.5-3.5L19 9.5 4.5 2.5z" />
      <path fill="#FF3A44" d="M4.5 2.5 19 14.5 15 12 4.5 21.5 4.5 2.5z" />
    </svg>
  );
}
