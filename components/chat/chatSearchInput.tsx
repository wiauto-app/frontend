"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useChatFilters } from "@/components/chat/hooks/useChatFilters";

export const ChatSearchInput = () => {
  const { handleChange, search: currentSearch } = useChatFilters();
  const handleChangeRef = useRef(handleChange);

  useEffect(() => {
    handleChangeRef.current = handleChange;
  }, [handleChange]);

  const [searchValue, setSearchValue] = useState(currentSearch ?? "");
  const debouncedSearchValue = useDebouncedValue(searchValue, 350);

  useEffect(() => {
    const normalizedValue = debouncedSearchValue.trim();
    const nextSearch = normalizedValue || undefined;
    const currentNormalized = (currentSearch ?? "").trim() || undefined;

    if (nextSearch === currentNormalized) {
      return;
    }

    handleChangeRef.current("search", nextSearch);
  }, [debouncedSearchValue, currentSearch]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="relative w-full">
      <SearchIcon
        className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        className="pl-8"
        placeholder="Buscar..."
        value={searchValue}
        onChange={handleSearchChange}
        aria-label="Buscar conversaciones"
      />
    </div>
  );
};
