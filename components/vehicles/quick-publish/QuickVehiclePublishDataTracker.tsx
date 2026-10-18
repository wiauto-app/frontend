"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { makesService } from "@/components/vehicles/services/makesService";
import { modelService } from "@/components/vehicles/services/modelService";
import { yearsService } from "@/components/vehicles/services/yearsService";
import { track } from "@/lib/analytics/funnel";

let requestCheck: (() => void) | null = null;

/** El paso de datos avisa en el blur de km/precio o al cerrar marca, modelo y año. */
export const requestPublishDatosCheck = (): void => {
  requestCheck?.();
};

const isVehicleDataValid = (values: QuickVehicleSchema): boolean => {
  const mileage = Number(values.mileage);
  const price = Number(values.price);

  return (
    Boolean(values.catalog_make_id) &&
    Boolean(values.catalog_model_id) &&
    Boolean(values.catalog_year_id) &&
    Number.isFinite(mileage) &&
    mileage >= 0 &&
    Number.isFinite(price) &&
    price > 0
  );
};

/** Dispara `publicar_datos` cuando marca, modelo, año, km y precio ya son válidos. */
export const QuickVehiclePublishDataTracker = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const trackedRef = useRef(false);

  const evaluate = useCallback(async () => {
    if (trackedRef.current) {
      return;
    }

    const values = form.getValues();
    if (!isVehicleDataValid(values)) {
      return;
    }

    trackedRef.current = true;

    const makeId = Number(values.catalog_make_id);
    const modelId = Number(values.catalog_model_id);
    const yearId = Number(values.catalog_year_id);

    let brand = String(makeId);
    let model = String(modelId);
    let year = yearId;

    try {
      const [make, modelItem, yearItem] = await Promise.all([
        makesService.findOne(makeId),
        modelService.findOne(modelId),
        yearsService.findOne(yearId),
      ]);
      brand = make.name;
      model = modelItem.name;
      year = yearItem.year;
    } catch {
      // Si el catálogo no responde, el evento sale con los ids.
    }

    track("publicar_datos", {
      brand,
      model,
      year,
      price: Number(values.price),
      currency: "EUR",
    });
  }, [form]);

  useEffect(() => {
    requestCheck = () => {
      void evaluate();
    };

    return () => {
      if (requestCheck) {
        requestCheck = null;
      }
    };
  }, [evaluate]);

  return null;
};
