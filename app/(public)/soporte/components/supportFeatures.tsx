import { SoporteIconFeature } from "../interfaces/soporte.interface"
import { SupportFeature } from "./supportFeature";

export const SupportFeatures = ({ data }: { data: SoporteIconFeature[] | null }) => {
  if (!data) return null;
  return (
    <div className="bg-primary/10 rounded-xl p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 divide-x">
        {data.map((feature) => (
          <SupportFeature key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  )
}
