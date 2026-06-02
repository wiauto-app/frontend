import type { PublisherType, TransmissionType } from "@/interfaces/vehicle.interface";

export type MakeModelValue = {
  make_slug?: string;
  model_slug?: string;
};

export type NumericRangeValue = {
  since?: number;
  until?: number;
};

export type MultiSlugValue = string[];

export type PriceFilterValue = NumericRangeValue & {
  cuota_slug?: string;
};

export type PublisherTypesValue = PublisherType[];

export type TransmissionTypesValue = TransmissionType[];
