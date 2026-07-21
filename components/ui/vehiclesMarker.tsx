import { AdvancedMarker, AdvancedMarkerProps } from "@vis.gl/react-google-maps"
import Image from "next/image"

export type VehiclesMarkerVariant = "default" | "dot";

export interface VehiclesMarkerProps extends AdvancedMarkerProps {
  variant: VehiclesMarkerVariant;
}

export const VehiclesMarker = ({
  variant = "default",
  ...props
}: VehiclesMarkerProps) => {
  return (
    <AdvancedMarker {...props}>
      <Image
        unoptimized
        src={variant === "default" ? "/map/maker.svg" : "/map/dotMarker.svg"}
        alt="Vehículo"
        width={20}
        height={30}
      />
    </AdvancedMarker>
  )
}