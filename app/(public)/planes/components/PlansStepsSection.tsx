import { StepsSection } from "@/components/landings/StepsSection";

import type { PlanesCaracteristicasBlock } from "../interfaces/planes.interface";
import { plansIconPack } from "../utils/plansIconPack";

interface PlansStepsSectionProps {
  data: PlanesCaracteristicasBlock;
}

export const PlansStepsSection = ({ data }: PlansStepsSectionProps) => (
  <StepsSection data={data} iconPack={plansIconPack} />
);
