import { IconContainer } from "../ui/iconContainer";
import { VehicleExtraServiceItem } from "./types/home-page.types";

export const ServiceHomeItem = ({
  item,
}: {
  item: VehicleExtraServiceItem;
}) => {
  return (
    <div className="flex items-center gap-2">
      <IconContainer Icon={item.icon} />
      <div>
        <h3 className="text-sm font-bold ">
          {item.name}
        </h3>
        <p className="text-xs leading-relaxed text-slate-500">
          {item.description}
        </p>
      </div>
    </div>
  );
};
