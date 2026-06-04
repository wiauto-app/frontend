import {
  MAKE_KEY,
  MODEL_KEY,
  MUNICIPALITY_KEY,
  PRICE_KEYS,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { MakeModelUrlPayload } from "@/components/selectors/FilterMakeSelector/utils/make-model-selection";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import {
  FILTERS_QS_STRINGIFY_REPEAT_OPTIONS,
  stringifyFiltersQuery,
  type FiltersQueryRecord,
} from "./filters-query";
import { VEHICLES_LISTING_BASE_PATH } from "./constants";

export type HeroListingSearchState = MakeModelUrlPayload &
  LocationUrlPayload & {
    [PRICE_KEYS.UNTIL]?: number;
  };

export const buildHeroListingHref = (state: HeroListingSearchState): string => {
  const record: FiltersQueryRecord = {};

  if (state[MAKE_KEY]?.length) {
    record[MAKE_KEY] = state[MAKE_KEY];
  }
  if (state[MODEL_KEY]?.length) {
    record[MODEL_KEY] = state[MODEL_KEY];
  }
  if (state[PROVINCE_KEY]?.length) {
    record[PROVINCE_KEY] = state[PROVINCE_KEY];
  }
  if (state[MUNICIPALITY_KEY]?.length) {
    record[MUNICIPALITY_KEY] = state[MUNICIPALITY_KEY];
  }
  if (state[PRICE_KEYS.UNTIL] !== undefined) {
    record[PRICE_KEYS.UNTIL] = String(state[PRICE_KEYS.UNTIL]);
  }

  const search = stringifyFiltersQuery(
    record,
    FILTERS_QS_STRINGIFY_REPEAT_OPTIONS,
  );

  return search
    ? `${VEHICLES_LISTING_BASE_PATH}?${search}`
    : VEHICLES_LISTING_BASE_PATH;
};
