import Link from "next/link";
import { BRAND_BLUE } from "../constants";

export type Insurer = {
  id: number;
  name: string;
  tagline: string;
};

type InsurersCardProps = {
  insurer: Insurer;
};

export function InsurersCard({ insurer }: InsurersCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex h-28 items-center justify-center overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 h-full w-12"
          style={{ backgroundColor: BRAND_BLUE }}
        />
        <div className="relative z-10 ml-8 flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
          <div
            className="flex size-7 items-center justify-center rounded-md text-xs font-bold text-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            W
          </div>
          <span className="text-lg font-bold" style={{ color: BRAND_BLUE }}>
            WiAuto
          </span>
          <span className="hidden text-[9px] leading-tight text-slate-400 sm:block">
            COMPRA VENDE FINANCIA
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:px-8">
        <p className="text-base text-slate-600 sm:text-lg">{insurer.tagline}</p>
        <Link
          href="#"
          className="mt-auto w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          Ver oferta
        </Link>
      </div>
    </article>
  );
}
