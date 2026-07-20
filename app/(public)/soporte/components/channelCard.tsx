import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { IconContainer } from "@/components/ui/iconContainer";
import { resolveStrapiIconName } from "../../simulador-financiamiento/utils/resolveStrapiIconName";
import { SoporteCard } from "../interfaces/soporte.interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ChannelCard = ({ channel }: { channel: SoporteCard }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {channel.iconName ? (
          <IconContainer size="xl" Icon={resolveStrapiIconName(channel.iconName)} />
        ) : null}
        <CardTitle className="text-2xl font-bold text-center">{channel.titulo}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">{channel.descripcion}</CardDescription>
        <Link href={channel.boton?.url ?? ""}>
          <Button variant={channel.boton?.destacado ? "default" : "outline"}>
            {channel.boton?.label}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
