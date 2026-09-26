import { Card, CardContent } from "../ui/card";
import { RiTargetFill } from "react-icons/ri";

export const WiautoMatchCard = () => {
  return (
    <Card size="sm" variant="soft">
      <CardContent className="flex items-center justify-center">
        <div className="min-w-10">
          <RiTargetFill className="size-8 text-primary" />
        </div>
        <div className="flex flex-col ">
          <p className="text-sm font-medium">Wiauto Match</p>
          <p className="text-xs text-muted-foreground">
            Recibe oportunidades de compradores que buscan vehículos como los tuyos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
