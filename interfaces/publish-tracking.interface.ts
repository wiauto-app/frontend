export interface PublishTrackingPayload {
  eventId: string;
  fbp?: string;
  fbc?: string;
  pageUrl: string;
  consent: boolean;
  vehicleDataEventId?: string;
}

export interface RegistrationTrackingPayload {
  eventId: string;
  fbp?: string;
  fbc?: string;
  pageUrl: string;
  consent: boolean;
  method: string;
}
