import { useEffect, useId, useMemo, useRef, useState } from "react";

import { countryCodes } from "@/lib/countryCodes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MAX_SUBSCRIBER_DIGITS_E164 = 15;

/** Prefijo por defecto (España) cuando `phone_code` llega vacío al montar. */
export const DEFAULT_PHONE_CODE = "+34";

/** Fila estable en módulo: evita reordenar y re-mapear en cada render. */
const COUNTRY_ROWS = [...countryCodes]
  .map((entry) => ({
    iso: entry.code,
    dial_code: entry.dial_code,
    name: entry.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

export type PhoneFieldValue = {
  phone_code?: string;
  phone?: string;
};

export type PhoneInputProps = {
  value: PhoneFieldValue;
  onChange: (next: PhoneFieldValue) => void;
  disabled?: boolean;
  className?: string;
  ariaInvalid?: boolean;
  dialListLabel?: string;
  nationalNumberLabel?: string;
  nationalNumberPlaceholder?: string;
};

export const PhoneInput = ({
  value,
  onChange,
  disabled = false,
  className,
  ariaInvalid = false,
  dialListLabel = "Buscar país o prefijo",
  nationalNumberLabel = "Número de teléfono",
  nationalNumberPlaceholder = "Número",
}: PhoneInputProps) => {
  const baseId = useId();
  const dialTriggerId = `${baseId}-dial-trigger`;
  const nationalInputId = `${baseId}-national`;
  const searchInputId = `${baseId}-dial-search`;

  const [dialPopoverOpen, setDialPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");

  const appliedDefaultDialRef = useRef(false);

  const dialTrimmed = value.phone_code?.trim() ?? "";

  const effectiveDialCode =
    dialTrimmed.length > 0 ? dialTrimmed : DEFAULT_PHONE_CODE;

  useEffect(() => {
    if (appliedDefaultDialRef.current) return;

    const hasExplicitCode = dialTrimmed.length > 0;

    if (hasExplicitCode) {
      appliedDefaultDialRef.current = true;
      return;
    }

    appliedDefaultDialRef.current = true;
    onChange({
      ...value,
      phone_code: DEFAULT_PHONE_CODE,
    });
  }, [dialTrimmed, onChange, value]);

  const triggerHint = useMemo(() => {
    const match = COUNTRY_ROWS.find(
      (row) => row.dial_code === effectiveDialCode,
    );

    if (!match) return effectiveDialCode;

    return `${match.name} (${match.dial_code})`;
  }, [effectiveDialCode]);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    if (!normalizedSearch) {
      return COUNTRY_ROWS;
    }

    return COUNTRY_ROWS.filter((row) => {
      const searchableText = [
        row.name,
        row.dial_code,
        row.iso,
      ]
        .join(" ")
        .toLocaleLowerCase("es");

      return searchableText.includes(normalizedSearch);
    });
  }, [search]);

  const handlePopoverChange = (open: boolean) => {
    setDialPopoverOpen(open);

    if (!open) {
      setSearch("");
    }
  };

  const handleDialCodeSelect = (dialCode: string) => {
    if (dialCode !== dialTrimmed) {
      onChange({
        ...value,
        phone_code: dialCode,
      });
    }

    setSearch("");
    setDialPopoverOpen(false);
  };

  const handleNationalPhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const digitsOnly = event.target.value
      .replace(/\D/g, "")
      .slice(0, MAX_SUBSCRIBER_DIGITS_E164);

    if (digitsOnly === value.phone) return;

    onChange({
      ...value,
      phone: digitsOnly,
    });
  };

  return (
    <div
      className={cn(
        "flex w-full  gap-1.5 flex-row items-start ",
        className,
      )}
    >
      <Popover
        open={dialPopoverOpen}
        onOpenChange={handlePopoverChange}
      >
        <PopoverTrigger
          disabled={disabled}
          className="shrink-0 "
          render={
            <Button
              id={dialTriggerId}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={ariaInvalid || undefined}
              aria-haspopup="listbox"
              aria-expanded={dialPopoverOpen}
              aria-label="Prefijo internacional del teléfono"
              title={triggerHint}
              className="h-9 justify-between gap-1 bg-transparent font-normal tabular-nums "
            >
              <span className="min-w-0 flex-1 truncate text-left">
                <span
                  className={cn(
                    "font-medium tabular-nums text-foreground",
                    dialTrimmed.length === 0 &&
                      "text-muted-foreground",
                  )}
                >
                  {effectiveDialCode}
                </span>
              </span>

            </Button>
          }
        />
        
        <PopoverContent
          className="w-[min(100vw-1.5rem,20rem)] max-w-none p-0 shadow-md sm:min-w-[280px]"
          align="start"
          sideOffset={4}
        >
          <div className="flex max-h-56 flex-col">
            <div className="border-b p-2">
              <Input
                id={searchInputId}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={dialListLabel}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-8"
              />
            </div>

            <div
              role="listbox"
              aria-label={dialListLabel}
              className="min-h-0 overflow-y-auto overscroll-contain p-1"
            >
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No se encontraron países.
                </div>
              ) : (
                filteredCountries.map((row) => {
                  const key = `${row.iso}|${row.dial_code}|${row.name}`;

                  return (
                    <button
                      key={key}
                      type="button"
                      role="option"
                      aria-selected={row.dial_code === dialTrimmed}
                      onClick={() =>
                        handleDialCodeSelect(row.dial_code)
                      }
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:bg-accent focus-visible:text-accent-foreground",
                        row.dial_code === dialTrimmed &&
                          "bg-accent/50",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {row.name}
                      </span>

                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {row.dial_code}
                      </span>

                      <span className="sr-only">
                        {row.iso}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Input
        id={nationalInputId}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        name="phone-national"
        disabled={disabled}
        aria-invalid={ariaInvalid || undefined}
        aria-label={nationalNumberLabel}
        placeholder={nationalNumberPlaceholder}
        value={value.phone ?? ""}
        onChange={handleNationalPhoneChange}
        className="min-w-0 flex-1"
      />
    </div>
  );
};