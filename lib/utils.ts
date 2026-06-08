import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const OPTIONAL_FIELD_SUFFIX = "(opcional)";

export const formatFieldLabel = (label: string, optional = false): string =>
  optional ? `${label} ${OPTIONAL_FIELD_SUFFIX}` : label;
