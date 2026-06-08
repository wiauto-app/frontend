export type VehicleDetailReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
};

export type VehicleDetailAdvertiser = {
  name: string;
  email: string;
  email_verified: boolean;
  phone: string;
  profile_href: string;
};

export type VehicleDetailSellerComments = {
  description: string;
  equipment_title: string;
  equipment_items: string[];
  footer_note: string;
  legal_notes: string[];
  reference: string;
};

export type VehicleDetailPriceAnalysis = {
  message: string;
  badge: string;
  disclaimer: string;
};

export type VehicleDetailSpec = {
  label: string;
  value: string;
};

export type VehicleDetailLocation = {
  area: string;
  road: string;
  address_lines: string[];
};

export type VehicleDetailVerifiedSeller = {
  name: string;
  subtitle: string;
  rating: string;
  completed_sales: string;
  response_time: string;
  whatsapp_verified: boolean;
};

export type VehicleDetailView = {
  id: string;
  title: string;
  condition_label: string;
  published_at: string;
  modified_at: string;
  price: string;
  previous_price: string | null;
  price_note: string | null;
  financing: string | null;
  vat_note: string;
  images: string[];
  services: string[];
  advertiser: VehicleDetailAdvertiser;
  seller_comments: VehicleDetailSellerComments;
  price_analysis: VehicleDetailPriceAnalysis;
  specs: VehicleDetailSpec[];
  reviews: VehicleDetailReview[];
  location: VehicleDetailLocation;
  verified_seller: VehicleDetailVerifiedSeller;
  contact_phone: string;
};
