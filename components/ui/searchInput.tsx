"use client";

import { Search, X } from "lucide-react";
import { Input } from "./input";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput = ({
  placeholder,
  onChange,
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
        className="pl-10"
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
