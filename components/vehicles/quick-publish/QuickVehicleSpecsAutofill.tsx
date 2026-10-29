"use client";

import { useVehicleSpecsAutofill } from "./hooks/useVehicleSpecsAutofill";

/** Autocompleta la ficha técnica sin pintarla (alta rápida). */
export const QuickVehicleSpecsAutofill = () => {
  useVehicleSpecsAutofill();
  return null;
};
