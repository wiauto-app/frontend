
export const VehicleFormStep = ({
  number,
  label,
  description,
}: {
  number: number;
  label: string;
  description?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-base">
        {number}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">{label}</p>{" "}
           
        </div>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
    </div>
  );
};
