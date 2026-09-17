import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";

import { vehicleDetailCmsService } from "../services/vehicleDetailCmsService";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const VehicleDetailCollaborationsSection = async () => {
  const collaborations = await vehicleDetailCmsService.getHeroCollaborations();

  if (collaborations.length === 0) {
    return null;
  }

  return (
    <Card aria-label="Colaboraciones y servicios" size="sm">
      <CardContent className="flex flex-col gap-6 ">
        {collaborations.map((collaboration, index) => (
          <CollaborationHeroCard
            key={collaboration.id}
            content={collaboration}
            className={cn(
              "pb-4",
              "border-b border-slate-200 last:border-b-0",
              index === collaborations.length - 1 && "border-b-0",
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
};
