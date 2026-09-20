import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllColaboraciones } from "@/services/colaboracionesService";

export const VehicleDetailCollaborationsSection = async () => {
  const collaborations = await getAllColaboraciones();

  if (collaborations.length === 0) {
    return null;
  }

  return (
    <Card aria-label="Colaboraciones y servicios" size="sm">
      <CardContent className="flex flex-col gap-6">
        {collaborations.map((collaboration, index) => (
          <CollaborationHeroCard
            key={collaboration.id}
            content={collaboration}
            size="md"
            className={cn(
              "border-b border-slate-200 last:border-b-0",
              index === collaborations.length - 1 && "border-b-0",
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
};
