import { Badge } from "@/components/ui/badge";

interface VehicleFormStepProps {
  number: number;
  label: string;
  description?: string;
  children?: React.ReactNode;
  isOptional?: boolean;
}

export const VehicleFormStep = ({
  number,
  label,
  description,
  children,
  isOptional = false,
}: VehicleFormStepProps) => {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
          {number}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{label}</p>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {isOptional && <Badge className="">Recomendado</Badge>}
 
      </div>
      {children ? <div className="flex flex-col gap-4">{children}</div> : null}
    </section>
  );
};
