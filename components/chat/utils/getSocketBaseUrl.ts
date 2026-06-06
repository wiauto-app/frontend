import { API_URL } from "@/constants";

export const getSocketBaseUrl = (): string => {
  return (API_URL ?? "").replace(/\/$/, "");
};
