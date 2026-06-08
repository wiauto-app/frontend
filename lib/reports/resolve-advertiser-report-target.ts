import {
  PUBLISHER_TYPE,
  type Publisher,
  type PublisherType,
  type VehicleDetailDealership,
} from "@/interfaces/vehicle.interface";
import {
  REPORT_TARGET_TYPE,
  type ReportTarget,
} from "@/interfaces/report.interface";

type ResolveAdvertiserReportTargetInput = {
  publisherType: PublisherType;
  profileId?: string;
  publisher: Pick<Publisher, "id" | "name">;
  dealership?: Pick<VehicleDetailDealership, "id" | "name">;
};

export const resolveAdvertiserReportTarget = (
  input: ResolveAdvertiserReportTargetInput,
): ReportTarget | null => {
  if (input.publisherType === PUBLISHER_TYPE.PROFESSIONAL) {
    const dealershipId = input.dealership?.id?.trim();

    if (!dealershipId) {
      return null;
    }

    return {
      targetType: REPORT_TARGET_TYPE.DEALERSHIP,
      targetId: dealershipId,
      targetName: input.dealership?.name?.trim() || "Concesionario",
    };
  }

  const profileId = input.profileId?.trim() || input.publisher.id?.trim();

  if (!profileId) {
    return null;
  }

  return {
    targetType: REPORT_TARGET_TYPE.PROFILE,
    targetId: profileId,
    targetName: input.publisher.name?.trim() || "Vendedor",
  };
};

export const getReportTargetTypeLabel = (targetType: ReportTarget["targetType"]) => {
  if (targetType === REPORT_TARGET_TYPE.DEALERSHIP) {
    return "concesionario";
  }

  if (targetType === REPORT_TARGET_TYPE.PROFILE) {
    return "vendedor";
  }

  return "anuncio";
};
