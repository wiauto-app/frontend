"use client";

import { Filter, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MakeOnlySelector } from "../selectors/makeOnlySelector";
import { HeroFiltersLocationSelector } from "./HeroFiltersLocationSelector";
import type { ProvinceQuickBadgeItem } from "../selectors/utils/build-province-badges";
import type { MakeLogoBadgeItem } from "../selectors/utils/build-make-logo-badges";

export interface ExtraFiltersClientProps {
  showProvinceBadges?: boolean;
  showMakeBadges?: boolean;
  provinceBadgeLimit?: number;
  makeBadgeLimit?: number;
  provinceBadges?: ProvinceQuickBadgeItem[];
  makeBadges?: MakeLogoBadgeItem[];
}

export const ExtraFiltersClient = ({
  showProvinceBadges = false,
  showMakeBadges = false,
  provinceBadgeLimit = 7,
  makeBadgeLimit = 9,
  provinceBadges = [],
  makeBadges = [],
}: ExtraFiltersClientProps) => {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Filter className="size-5 text-primary" aria-hidden />
        <h2 className="text-xl font-semibold">
          Filtros para encontrar tu vehículo ideal
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" aria-hidden />
              Filtra por provincia
            </CardTitle>
            <CardDescription>
              Selecciona tu provincia y descubre vehículos cerca de ti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeroFiltersLocationSelector
              navigateOnSelect
              onNavigate={handleNavigate}
              placeholder="Selecciona provincia o municipio"
              showQuickBadges={showProvinceBadges}
              quickBadgeLimit={provinceBadgeLimit}
              quickBadgeProvinces={provinceBadges}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5" aria-hidden />
              Filtra por marca
            </CardTitle>
            <CardDescription>
              Elige entre las marcas más populares del mercado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MakeOnlySelector
              showQuickBadges={showMakeBadges}
              quickBadgeLimit={makeBadgeLimit}
              quickBadgeMakes={makeBadges}
              onNavigate={handleNavigate}
            />
          </CardContent>
        </Card>

        {/* Card 3: placeholder para futuros filtros */}
      </div>
    </section>
  );
};
