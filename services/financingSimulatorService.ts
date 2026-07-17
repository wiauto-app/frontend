import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  FinancingSimulatorConfigDto,
  SimulateFinancingDto,
  SimulateFinancingResultDto,
} from "@/interfaces/financing-simulator.interface";

const BASE_PATH = "/v1/financing/simulator";

export const financingSimulatorService = {
  getConfig: (): Promise<ApiResponse<FinancingSimulatorConfigDto>> =>
    apiGet<FinancingSimulatorConfigDto>(`${BASE_PATH}/config`),

  simulate: (
    payload: SimulateFinancingDto,
  ): Promise<ApiResponse<SimulateFinancingResultDto>> =>
    apiPost<SimulateFinancingResultDto>(`${BASE_PATH}/simulate`, payload),
};
