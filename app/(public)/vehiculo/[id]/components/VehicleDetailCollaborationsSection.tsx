import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";

import { vehicleDetailCmsService } from "../services/vehicleDetailCmsService";

export const VehicleDetailCollaborationsSection = async () => {
  const collaborations =
    await vehicleDetailCmsService.getHeroCollaborations();

  if (collaborations.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Colaboraciones y servicios"
      className="grid grid-cols-1  "
    >
      {collaborations.map((collaboration) => (
        <CollaborationHeroCard
          key={collaboration.id}
          content={collaboration}
        />
      ))}
    </section>
  );
};
