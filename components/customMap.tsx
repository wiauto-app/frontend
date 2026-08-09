"use client";

import { APIProvider, Map, type MapProps } from "@vis.gl/react-google-maps";

import { GOOGLE_MAPS_API_KEY } from "@/constants";

interface GoogleMapsApiProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsApiProvider = ({
  children,
}: GoogleMapsApiProviderProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not set");
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      {children}
    </APIProvider>
  );
};

interface CustomMapProps extends MapProps {
  /** Si ya hay un `GoogleMapsApiProvider` padre, pasar `false`. @default true */
  withProvider?: boolean;
}

export const CustomMap = ({
  withProvider = true,
  ...props
}: CustomMapProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not set");
  }

  const map = <Map {...props} />;

  if (!withProvider) {
    return map;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      {map}
    </APIProvider>
  );
};
