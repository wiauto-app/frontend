import { apiPost, type ApiResponse } from "@/lib/api";

export type VehicleContactClickType = "phone" | "whatsapp";

export interface VehiclePhoneClickResponse {
  phone_code: string;
  phone: string;
}

export interface VehicleWhatsAppClickResponse {
  whatsapp_url: string;
}

export const vehicleContactClickService = {
  recordPhoneClick: (
    vehicleId: string,
  ): Promise<ApiResponse<VehiclePhoneClickResponse>> =>
    apiPost<VehiclePhoneClickResponse>(
      `/v1/vehicles/${vehicleId}/contact-clicks`,
      { type: "phone" satisfies VehicleContactClickType },
    ),

  recordWhatsAppClick: (
    vehicleId: string,
  ): Promise<ApiResponse<VehicleWhatsAppClickResponse>> =>
    apiPost<VehicleWhatsAppClickResponse>(
      `/v1/vehicles/${vehicleId}/contact-clicks`,
      { type: "whatsapp" satisfies VehicleContactClickType },
    ),
};
