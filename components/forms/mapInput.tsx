"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 40.4168, lng: -3.7038 };

export type MapInputValue = {
  lat: number;
  lng: number;
};

type MapInputProps = {
  value: MapInputValue;
  onChange: (value: MapInputValue) => void;
  ariaInvalid?: boolean;
};

const MapInputInner = ({ value, onChange, ariaInvalid }: MapInputProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const [isLocating, setIsLocating] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const lat = event.detail.latLng?.lat;
      const lng = event.detail.latLng?.lng;
      if (lat == null || lng == null) return;
      onChange({ lat, lng });
    },
    [onChange],
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (!placesLibrary || !searchInputRef.current) return;

    const autocomplete = new placesLibrary.Autocomplete(searchInputRef.current, {
      fields: ["geometry", "formatted_address"],
      types: ["geocode"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (!location) return;
      onChange({ lat: location.lat(), lng: location.lng() });
      setSearchValue(place.formatted_address ?? "");
    });

    return () => {
      listener.remove();
    };
  }, [placesLibrary, onChange]);

  const hasCoords = Number.isFinite(value.lat) && Number.isFinite(value.lng);

  return (
    <div className="flex flex-col gap-3" data-invalid={ariaInvalid}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Buscar localidad o dirección"
            className="pl-9"
            aria-invalid={ariaInvalid}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="shrink-0"
        >
          <LocateFixed className="size-4" />
          {isLocating ? "Localizando..." : "Mi ubicación"}
        </Button>
      </div>

      <div
        className={cn(
          "aspect-video overflow-hidden rounded-lg border",
          ariaInvalid && "border-destructive",
        )}
      >
        <Map
          mapId="vehicle-publish-map"
          gestureHandling="greedy"
          defaultCenter={hasCoords ? value : DEFAULT_CENTER}
          defaultZoom={hasCoords ? 14 : 6}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
        >
          {hasCoords ? (
            <AdvancedMarker position={value}>
              <MapPin className="size-8 text-primary fill-primary/20" aria-hidden />
            </AdvancedMarker>
          ) : null}
        </Map>
      </div>

      <p className="text-xs text-muted-foreground">
        Haz clic en el mapa o busca una dirección para fijar la ubicación del anuncio.
      </p>
    </div>
  );
};

export const MapInput = (props: MapInputProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <p className="text-sm text-destructive">
        Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para seleccionar ubicación.
      </p>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <MapInputInner {...props} />
    </APIProvider>
  );
};
