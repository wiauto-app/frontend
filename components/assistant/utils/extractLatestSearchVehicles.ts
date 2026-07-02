import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { getToolName, isToolUIPart, type UIMessage } from "ai";

export interface SearchVehiclesToolOutput {
  total: number;
  vehicles: VehicleListItem[];
  appliedFilters: Record<string, unknown>;
}

export const isSearchVehiclesOutput = (
  output: unknown,
): output is SearchVehiclesToolOutput => {
  if (!output || typeof output !== "object") {
    return false;
  }

  const candidate = output as SearchVehiclesToolOutput;
  return (
    Array.isArray(candidate.vehicles) && typeof candidate.total === "number"
  );
};

export const extractLatestSearchVehicles = (
  messages: UIMessage[],
): SearchVehiclesToolOutput | null => {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
    const message = messages[messageIndex];

    for (
      let partIndex = message.parts.length - 1;
      partIndex >= 0;
      partIndex -= 1
    ) {
      const part = message.parts[partIndex];

      if (!isToolUIPart(part) || getToolName(part) !== "searchVehicles") {
        continue;
      }

      if (part.state !== "output-available" || !("output" in part)) {
        continue;
      }

      if (!isSearchVehiclesOutput(part.output)) {
        continue;
      }

      return part.output;
    }
  }

  return null;
};
