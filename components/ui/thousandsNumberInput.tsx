"use client";

import { useLayoutEffect, useRef, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";

/** "15000" → "15.000". Siempre agrupa (Intl es-ES no agrupa números de 4 cifras). */
export const formatThousands = (digits: string): string =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const countDigits = (text: string): number => text.replace(/\D/g, "").length;

type ThousandsNumberInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "type" | "inputMode"
> & {
  value: number | null | undefined;
  onValueChange: (value: number | undefined) => void;
  /** Máximo de dígitos aceptados. */
  maxDigits?: number;
};

/**
 * Input numérico entero con puntos de miles solo visuales: el formulario
 * recibe el número limpio y el cursor se mantiene tras el mismo dígito.
 */
export const ThousandsNumberInput = ({
  value,
  onValueChange,
  maxDigits = 7,
  ...props
}: ThousandsNumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const digitsBeforeCaretRef = useRef<number | null>(null);

  const displayValue =
    value == null || Number.isNaN(value) ? "" : formatThousands(String(value));

  useLayoutEffect(() => {
    const input = inputRef.current;
    const digitsBeforeCaret = digitsBeforeCaretRef.current;
    if (!input || digitsBeforeCaret === null) return;

    digitsBeforeCaretRef.current = null;
    let caret = 0;
    let seen = 0;
    while (caret < input.value.length && seen < digitsBeforeCaret) {
      if (/\d/.test(input.value[caret])) seen += 1;
      caret += 1;
    }
    input.setSelectionRange(caret, caret);
  }, [displayValue]);

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={displayValue}
      onChange={(event) => {
        const { value: raw, selectionStart } = event.target;
        const digits = raw.replace(/\D/g, "").slice(0, maxDigits);

        digitsBeforeCaretRef.current = Math.min(
          countDigits(raw.slice(0, selectionStart ?? raw.length)),
          digits.length,
        );
        onValueChange(digits ? Number(digits) : undefined);
      }}
    />
  );
};
