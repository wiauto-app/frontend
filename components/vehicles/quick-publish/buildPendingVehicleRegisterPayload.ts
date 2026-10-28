import { serializeVehiclePayload } from "@/components/vehicles/utils/serializeVehiclePayload";
import {
  buildPublishTracking,
  createPublishEventId,
} from "@/lib/analytics/buildPublishTracking";
import type { PendingVehiclePayload } from "@/validations/Schemas";

import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import {
  isQuickPublishHandoffValid,
  useQuickPublishHandoffStore,
} from "./stores/quickPublishHandoffStore";

/** Anuncio del invitado: prop del modal o handoff en sessionStorage (p. ej. /registro). */
export const buildPendingVehicleRegisterPayload = (
  explicit?: PendingVehiclePayload,
): PendingVehiclePayload | undefined => {
  if (explicit) {
    return explicit;
  }

  const handoff = useQuickPublishHandoffStore.getState();
  if (!isQuickPublishHandoffValid(handoff) || !handoff.values) {
    return undefined;
  }

  return {
    ...serializeVehiclePayload(handoff.values as QuickVehicleSchema),
    tracking: buildPublishTracking(createPublishEventId()),
  };
};

export const clearPendingVehicleHandoff = (): void => {
  useQuickPublishHandoffStore.getState().clearHandoff();
};
