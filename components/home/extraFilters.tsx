import { buildMakeLogoBadges } from "../selectors/utils/build-make-logo-badges";
import { buildPopularProvinceBadges } from "../selectors/utils/build-province-badges";
import {
  ExtraFiltersClient,
  type ExtraFiltersClientProps,
} from "./ExtraFiltersClient";

export interface ExtraFiltersProps {
  showProvinceBadges?: boolean;
  showMakeBadges?: boolean;
  provinceBadgeLimit?: number;
  makeBadgeLimit?: number;
}

export const ExtraFilters = async ({
  showProvinceBadges = false,
  showMakeBadges = false,
  provinceBadgeLimit = 7,
  makeBadgeLimit = 9,
}: ExtraFiltersProps) => {
  const [provinceBadges, makeBadges] = await Promise.all([
    showProvinceBadges
      ? buildPopularProvinceBadges(provinceBadgeLimit)
      : Promise.resolve([]),
    showMakeBadges
      ? buildMakeLogoBadges(makeBadgeLimit)
      : Promise.resolve([]),
  ]);

  const client_props: ExtraFiltersClientProps = {
    showProvinceBadges,
    showMakeBadges,
    provinceBadgeLimit,
    makeBadgeLimit,
    provinceBadges,
    makeBadges,
  };

  return <ExtraFiltersClient {...client_props} />;
};
