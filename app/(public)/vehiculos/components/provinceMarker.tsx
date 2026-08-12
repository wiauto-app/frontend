import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface ProvinceMarkerProps {
  lat: number;
  lng: number;
  className?: string;
  name: string;
}

export function ProvinceMarker({
  lat,
  lng,
  className,
  name,
}: ProvinceMarkerProps) {
  const width = Math.max(100, name.length * 8 + 32);

  return (
    <AdvancedMarker
      position={{
        lat,
        lng,
      }}
    >
     <div className="bg-primary text-primary-foreground rounded-full p-1">
      <p className="text-xs max-w-22 truncate">{name}</p>
     </div>
    </AdvancedMarker>
  );
}
