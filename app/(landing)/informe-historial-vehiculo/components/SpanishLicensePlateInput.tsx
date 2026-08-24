import { cn } from "@/lib/utils";

interface SpanishLicensePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export const SpanishLicensePlateInput = ({
  value,
  onChange,
  className,
  id,
}: SpanishLicensePlateInputProps) => {
  return (
    <div
      className={cn(
        "flex h-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 transition-all",
        className,
      )}
    >
      <div className="flex w-12 shrink-0 flex-col items-center justify-center bg-[#003399] text-white select-none">
        <svg viewBox="0 0 24 24" className="size-4 fill-amber-300">
          <circle cx="12" cy="4" r="1" />
          <circle cx="16" cy="5.1" r="1" />
          <circle cx="18.9" cy="8" r="1" />
          <circle cx="20" cy="12" r="1" />
          <circle cx="18.9" cy="16" r="1" />
          <circle cx="16" cy="18.9" r="1" />
          <circle cx="12" cy="20" r="1" />
          <circle cx="8" cy="18.9" r="1" />
          <circle cx="5.1" cy="16" r="1" />
          <circle cx="4" cy="12" r="1" />
          <circle cx="5.1" cy="8" r="1" />
          <circle cx="8" cy="5.1" r="1" />
        </svg>
        <span className="mt-0.5 text-xs font-black leading-none">E</span>
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        placeholder="1234 ABC"
        className="flex-1 bg-transparent px-4 text-center text-xl font-bold tracking-[0.18em] text-slate-800 placeholder:text-slate-300 outline-hidden"
        maxLength={10}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
};
