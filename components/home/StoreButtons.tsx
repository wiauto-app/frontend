import { FaApple } from "react-icons/fa";
import Image from "next/image";
type StoreButtonsProps = {
  className?: string;
};

export function StoreButtons({
  className,
}: StoreButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl bg-black px-4 text-white transition-opacity hover:opacity-90"
        aria-label="App Store"
      >
        <FaApple className="size-6"/>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] leading-none">Descarga la app</span>
          <span className="text-[15px] font-semibold leading-tight">
            En la App Store
          </span>
        </span>
      </a>
      <a
        href="#"
        className="inline-flex h-[52px] min-w-[155px] items-center gap-2.5 rounded-xl border  bg-white px-4 text-black transition-opacity hover:opacity-95 border"
        aria-label="Google Play"
      >
        <Image src="/icons/playStore.svg" alt="Google Play" width={24} height={24} />
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] font-medium uppercase leading-none">
            Descarga la app
          </span>
          <span className="text-[15px] font-semibold leading-tight">
            En Google Play
          </span>
        </span>
      </a>
    </div>
  );
}

