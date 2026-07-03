export interface DiscoveryPillLink {
  label: string;
  href: string;
}

export interface QuickLink {
  label: string;
  description?: string;
  href: string;
}

export interface DiscoveryAccordionSection {
  id: string;
  title: string;
  pills: DiscoveryPillLink[];
}

export interface VehicleDiscoverySectionProps {
  title?: string;
  quickLinks?: QuickLink[];
  sections?: DiscoveryAccordionSection[];
  className?: string;
}
