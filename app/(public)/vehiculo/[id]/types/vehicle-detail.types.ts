export type VehicleDetailReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
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

