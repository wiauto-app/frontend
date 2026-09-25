import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllColaboraciones } from "@/services/colaboracionesService";
import React from "react";

export const VehicleDetailCollaborationsSection = async () => {
  const collaborations = await getAllColaboraciones();

  if (collaborations.length === 0) {
    return null;
  }

  return (
    <Card aria-label="Colaboraciones y servicios" size="sm">
      <CardContent className="flex flex-col gap-2">
        {collaborations.map((collaboration, index) => (
          <React.Fragment key={collaboration.id}>
            <CollaborationHeroCard
              key={collaboration.id}
              content={collaboration}
              size="md"
            />
            {index !== collaborations.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
