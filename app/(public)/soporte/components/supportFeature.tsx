import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";
import { SoporteIconFeature } from "../interfaces/soporte.interface";

export const SupportFeature = ({
  feature,
}: {
  feature: SoporteIconFeature;
}) => {
  return (
    <div>
      <div className="flex  gap-2 items-center">
        <IconContainer Icon={resolveStrapiIconName(feature.iconName, defaultStrapiIconPack)} />
        <div>
          <h3 className=" font-bold ">{feature.label}</h3>
          <p className="text-xs text-muted-foreground ">
            {feature.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};
