"use client";
import { GOOGLE_MAPS_API_KEY } from "@/constants";
import { APIProvider, Map, type MapProps } from "@vis.gl/react-google-maps";

export const CustomMap = ({ ...props }: MapProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not set");
  }
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map {...props} />
    </APIProvider>
  );
};
