export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  image_url: string | null;
}

export interface FooterSectionItem {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterData {
  logo_url: string | null;
  description: string | null;
  social_links: FooterLinkItem[];
  sections: FooterSectionItem[];
  copyright: string | null;
}
