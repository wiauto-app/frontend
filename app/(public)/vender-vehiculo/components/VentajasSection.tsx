import { VentajasSection as VentajasSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { resolveStrapiIconName } from "../../simulador-financiamiento/utils/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";

interface Props {
  data: VentajasSectionInterface;
}

export function VentajasSection({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-bold  text-foreground">{data.titulo}</h2>
        {data.descripcion ? (
          <p className="text-lg text-muted-foreground">{data.descripcion}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
        {(data.ventaja ?? []).map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center gap-2"
          >
            {item.iconName ? (
              <IconContainer
                size="lg"
                Icon={resolveStrapiIconName(item.iconName)}
              />
            ) : null}
            <h3 className="text-base md:text-lg font-semibold text-foreground ">
              {item.titulo}
            </h3>
            <p className="text-muted-foreground ">{item.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
