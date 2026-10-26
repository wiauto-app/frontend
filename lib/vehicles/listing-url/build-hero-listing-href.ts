import {
  COMMUNITY_KEY,
  MAKE_KEY,
  MODEL_KEY,
  MUNICIPALITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { MakeModelUrlPayload } from "@/components/selectors/FilterMakeSelector/utils/make-model-selection";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import type {
  ConditionVehicle,
  FindAllVehiclesParams,
} from "@/interfaces/vehicle.interface";

import { buildVehicleListingHref } from "./build-listing-url";
import { emptyToUndefined } from "./empty-to-undefined";

export type HeroListingSearchState = MakeModelUrlPayload &
  LocationUrlPayload & {
    precio_hasta?: number;
    condicion?: ConditionVehicle;
  };

export const buildHeroListingHref = (state: HeroListingSearchState): string => {
  const params: FindAllVehiclesParams = {
    makes_slugs: emptyToUndefined(state[MAKE_KEY]),
    models_slugs: emptyToUndefined(state[MODEL_KEY]),
    comunities_slugs: emptyToUndefined(state[COMMUNITY_KEY]),
    provinces_slugs: emptyToUndefined(state[PROVINCE_KEY]),
    municipalities_slugs: emptyToUndefined(state[MUNICIPALITY_KEY]),
    until_price: state.precio_hasta,
    condition: state.condicion,
  };

  return buildVehicleListingHref(params);
};
