import { StrapiLink } from "@/interfaces/strapi-components.interface";
import { StrapiButton } from "./strapiButton";

export const HeroActions = ({ actions }: { actions: StrapiLink[] }) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {actions.map((action) => (
        <StrapiButton key={action.id} button={action} />
      ))}
    </div>
  );
};
