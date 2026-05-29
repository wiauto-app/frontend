import { ChevronDown } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
export function BaseSelect({
  label,
  options,
  isLoading,
}: {
  label: string;
  options: string[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="relative">
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }
  return (
    <Popover>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent>
        {options.map((option) => (
          <div key={option}>{option}</div>
        ))}
      </PopoverContent>
    </Popover>
    // <div className="relative">
    //   <label className="pointer-events-none absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-slate-500">
    //     {label}
    //   </label>
    //   <div className="relative">
    //     <select
    //       className="h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm text-slate-700 outline-none focus:border-[#0061F2] focus:ring-1 focus:ring-[#0061F2]"
    //       defaultValue=""
    //     >
    //       <option value="" disabled>
    //         Selecciona
    //       </option>
    //       {options.map((option) => (
    //         <option key={option} value={option}>
    //           {option}
    //         </option>
    //       ))}
    //     </select>
    //     <ChevronDown
    //       className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-400"
    //       aria-hidden
    //     />
    //   </div>
    // </div>
  );
}
