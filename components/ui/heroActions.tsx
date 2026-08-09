import { StrapiLink } from "@/interfaces/strapi-components.interface";
import { StrapiButton } from "./strapiButton";

export const HeroActions = ({ actions }: { actions: StrapiLink[] }) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-3 ">
      {actions.map((action) => (
        <StrapiButton className="w-full lg:w-auto" key={action.id} button={action} />
      ))}
    </div>
  );
};
