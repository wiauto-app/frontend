import { API_URL } from "@/constants";
import { readSessionTokensFromCookies } from "@/lib/ensure-session.server";
import { V1_VEHICLES } from "@/components/vehicles/services/route.constants";
import type { VehicleReport } from "@/interfaces/vehicle-report.interface";

interface BackendEnvelope<T> {
  ok?: boolean;
  status?: number;
  message?: string;
  data?: T;
}

export interface GetVehicleReportDataResult {
  ok: boolean;
  status: number;
  data: VehicleReport | null;
}

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  return `${base}${path}`;
};

export const getVehicleReportData = async (
  vehicleId: string,
): Promise<GetVehicleReportDataResult> => {
  const { access_token } = await readSessionTokensFromCookies();

  if (!access_token) {
    return { ok: false, status: 401, data: null };
  }

  const response = await fetch(buildApiUrl(`${V1_VEHICLES}/${vehicleId}/report`), {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-store",
  });

  const body = (await response
    .json()
    .catch(() => null)) as BackendEnvelope<VehicleReport> | null;

  if (!response.ok) {
    return { ok: false, status: response.status, data: null };
  }

  return {
    ok: true,
    status: response.status,
    data: body?.data ?? null,
  };
};
