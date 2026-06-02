"use client";

import { Service } from "@/interfaces/vehicle.interface";
import { MultiCheckboxFilter } from "./multiCheckboxFilter";
import type { MultiSlugValue } from "./types";

type ServicesSelectorProps = {
  services: Service[];
  value: MultiSlugValue;
  onChange: (value: MultiSlugValue) => void;
};

export const ServicesSelector = ({
  services,
  value,
  onChange,
}: ServicesSelectorProps) => {
  return (
    <MultiCheckboxFilter
      title="Servicios"
      items={services.map((service) => ({
        key: service.slug,
        label: service.name,
      }))}
      value={value}
      onChange={onChange}
    />
  );
};
