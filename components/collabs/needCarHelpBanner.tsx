import {
  ChevronRightIcon,
  FileTextIcon,
  LockIcon,
  ShieldCheck,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconContainer } from "../ui/iconContainer";
import { IoCarSportOutline } from "react-icons/io5";

const image =
  "https://needcarhelp.es/wp-content/uploads/2025/11/logo-de-needcarhelp.svg";

const caracteristicas = [
  {
    title: "Más de 200 puntos de revisión",
    icon: <ShieldCheck />,
  },
  {
    title: "Técnicos profesionales",
    icon: <UserIcon />,
  },
  {
    title: "Informe detallado y objetivo",
    icon: <FileTextIcon />,
  },
];

export const NeedCarHelpBanner = () => {
  return (
    <Card className="border border-need-car-help-banner pb-0">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <IconContainer
              backgroundColor="#fff"
              iconColor="var(--need-car-help-banner)"
              Icon={IoCarSportOutline}
              size="xl"
            />
            <div className="">
              <CardTitle>
                ¿Quieres revisar este coche antes de comprarlo?
              </CardTitle>
              <CardDescription>
                Inspección profesional para conocer el estado real del vehículo
                antes de decidir.
              </CardDescription>
            </div>
          </div>
          <Image src={image} alt="Need Car Help" width={180} height={140} />
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          {caracteristicas.map((caracteristica) => {
            const Icon = caracteristica.icon;
            return (
              <div
                className="flex items-center gap-2 text-sm text-primary"
                key={caracteristica.title}
              >
                {Icon}
                <p>{caracteristica.title}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-1 items-center">
          <Button className="bg-need-car-help-banner hover:bg-need-car-help-banner/80 text-white">
            Solicitar revisión <ChevronRightIcon />
          </Button>
          <span className="flex items-center gap-2 text-xs text-muted-foreground ">
            <LockIcon className="size-4" /> Pago 100% seguro
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted-foreground/10 border-t [.border-t]:py-2">
        <p>
          Servicio realizado por <strong> NeedCarHelp</strong>
        </p>
      </CardFooter>
    </Card>
  );
};
