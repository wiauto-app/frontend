/** Feature de hero compartida (home, soporte, etc.). */
export interface HeroFeature {
  id: string;
  label: string;
  description: string | null;
  icon_url: string | null;
  icon_alt: string | null;
}
