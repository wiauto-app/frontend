import { VehicleListItem } from '@/interfaces/vehicle.interface';
interface VehicleGridCardBadgesProps {
  vehicle: VehicleListItem;
}

export const VehicleGridCardBadges = ({ vehicle }: VehicleGridCardBadgesProps) => {
  if (!vehicle.is_premium) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute top-2 left-2 z-10 flex max-w-[70%] flex-wrap gap-1.5">
      <span className="rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-sm">
        Profesional
      </span>
    </div>
  );
};

