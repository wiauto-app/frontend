export type VehicleContactTab = "contact" | "call-me";

export const VEHICLE_CONTACT_TAB_EVENT = "vehicle-detail-contact-tab";

export const scrollToVehicleContactTab = (tab: VehicleContactTab): void => {
  window.dispatchEvent(
    new CustomEvent(VEHICLE_CONTACT_TAB_EVENT, { detail: { tab } }),
  );
};
