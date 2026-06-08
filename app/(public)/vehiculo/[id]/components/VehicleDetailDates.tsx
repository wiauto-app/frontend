import { formatDate } from "@/app/(public)/vehiculos/utils";
import { Calendar, Clock } from "lucide-react";

type VehicleDetailDatesProps = {
  created_at: string;
  updated_at: string;
};

export const VehicleDetailDates = ({ created_at, updated_at }: VehicleDetailDatesProps) => {
  return (
    <div className="flex items-center gap-4 text-sm ">
      <span className="flex items-center gap-1">
        <Calendar className="size-4" aria-hidden />
        Publicado: {formatDate(created_at)}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="size-4" aria-hidden />
        Modificado: {formatDate(updated_at)}
      </span>
    </div>
  );
};
