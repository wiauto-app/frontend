import { Car, CreditCard, Scale, Shield } from "lucide-react";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { IconContainer } from "../ui/iconContainer";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

const TOOLS_SHORTCUTS_DATA = [
  {
    title: "Valorar mi coche",
    description: "Conoce el precio del mercado",
    icon: Car,
    href: "/valora-tu-vehiculo",
    label: "Valorar",
  },
  {
    title: "Comparador de coches",
    description: "Compara y elige mejor",
    icon: Scale,
    href: "/comparador-de-coches",
    label: "Comparar",
  },
  {
    title: "Simulador de financiación",
    description: "Calcula tu cuota mensual",
    icon: CreditCard,
    href: "/simulador-de-financiamiento",
    label: "Simular",
  },
  {
    title: "Calculadora de seguro",
    description: "Calcula tu seguro",
    icon: Shield,
    href: "/calculadora-de-seguro",
    label: "Calcular",
  },
];

export const ToolsShortcuts = () => {
  return (
    <SectionContainer>
      <SectionHeading lead="Herramientas" highlight="rápidas" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOOLS_SHORTCUTS_DATA.map((item) => (
          <Card key={item.title} size="sm">
            <CardContent className="flex flex-col gap-4 items-center">
              <IconContainer className="bg-white/10 shadow-md " Icon={item.icon} />
              <div>
                <h3 className="text-base font-bold">
                  {item.title}
                </h3>
                <p className="text-xs  text-muted-foreground">
                  {item.description}
                </p>
                <Link href={item.href} className="text-sm text-primary underline-offset-4 hover:underline mt-2 block">
                  {item.label}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
};
