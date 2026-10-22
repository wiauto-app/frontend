const FOCUSABLE_SELECTOR =
  'input:not([type="hidden"]), textarea, select, button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const focusQuickVehicleField = (fieldName: string): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const root =
    document.querySelector(`[data-field-name="${fieldName}"]`) ??
    document.getElementById(fieldName) ??
    document.querySelector(`[name="${fieldName}"]`);

  if (!(root instanceof HTMLElement)) {
    return false;
  }

  root.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusTarget =
    root.matches(FOCUSABLE_SELECTOR)
      ? root
      : root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

  focusTarget?.focus({ preventScroll: true });
  return true;
};
