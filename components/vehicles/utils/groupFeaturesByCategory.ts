export const FEATURES_CATALOG_LIMIT = 200;

export const FEATURE_CATEGORY_ORDER = [
  "seguridad_asistentes",
  "aparcamiento",
  "confort",
  "multimedia_conectividad",
  "iluminacion_exterior",
  "interior",
  "conduccion_prestaciones",
  "electricos_hibridos",
] as const;

export type FeatureCategorySlug = (typeof FEATURE_CATEGORY_ORDER)[number];

export const FEATURE_CATEGORY_LABELS: Record<FeatureCategorySlug, string> = {
  seguridad_asistentes: "Seguridad y asistentes",
  aparcamiento: "Aparcamiento",
  confort: "Confort",
  multimedia_conectividad: "Multimedia y conectividad",
  iluminacion_exterior: "Iluminación y exterior",
  interior: "Interior",
  conduccion_prestaciones: "Conducción y prestaciones",
  electricos_hibridos: "Eléctricos e híbridos enchufables",
};

export const HIDDEN_FEATURE_CATEGORY = "otros";

export interface GroupableFeature {
  name: string;
  category: string;
}

export interface FeatureCategoryGroup<T extends GroupableFeature = GroupableFeature> {
  slug: FeatureCategorySlug;
  label: string;
  features: T[];
}

const isVisibleFeatureCategory = (category: string): category is FeatureCategorySlug => {
  return (FEATURE_CATEGORY_ORDER as readonly string[]).includes(category);
};

export const formatSelectedCountLabel = (count: number): string => {
  if (count === 1) {
    return "1 seleccionado";
  }

  return `${count} seleccionados`;
};

export const groupFeaturesByCategory = <T extends GroupableFeature>(
  features: T[],
): FeatureCategoryGroup<T>[] => {
  const featuresByCategory = new Map<FeatureCategorySlug, T[]>();

  for (const feature of features) {
    if (!isVisibleFeatureCategory(feature.category)) {
      continue;
    }

    const current = featuresByCategory.get(feature.category) ?? [];
    current.push(feature);
    featuresByCategory.set(feature.category, current);
  }

  return FEATURE_CATEGORY_ORDER.flatMap((slug) => {
    const categoryFeatures = featuresByCategory.get(slug);
    if (!categoryFeatures?.length) {
      return [];
    }

    return [
      {
        slug,
        label: FEATURE_CATEGORY_LABELS[slug],
        features: categoryFeatures,
      },
    ];
  });
};

export const filterFeatureGroupsByQuery = <T extends GroupableFeature>(
  groups: FeatureCategoryGroup<T>[],
  query: string,
): FeatureCategoryGroup<T>[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase("es-ES");
  if (!normalizedQuery) {
    return groups;
  }

  return groups.flatMap((group) => {
    const features = group.features.filter((feature) =>
      feature.name.toLocaleLowerCase("es-ES").includes(normalizedQuery),
    );

    if (features.length === 0) {
      return [];
    }

    return [{ ...group, features }];
  });
};
