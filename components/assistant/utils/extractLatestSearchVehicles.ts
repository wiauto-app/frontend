import { getToolName, isToolUIPart, type UIMessage } from "ai";
import {
  isSearchVehiclesOutput,
  type SearchVehiclesToolOutput,
} from "../types/assistant-tool-outputs";

export type { SearchVehiclesToolOutput } from "../types/assistant-tool-outputs";
export { isSearchVehiclesOutput } from "../types/assistant-tool-outputs";

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
