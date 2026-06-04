"use client";

import { Search, X } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchInput = ({
  placeholder,
  onChange,
  className,
  onClear,
  ...props
}: SearchInputProps) => {

  const handleClear = () => {
    onChange?.("");
    onClear?.();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        className={cn("pl-10", className)}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      <button className="absolute right-3 top-1/2 size-4 -translate-y-1/2" onClick={handleClear}>
        <X className="size-4 text-slate-400" />
      </button>
    </div>
  );
};
