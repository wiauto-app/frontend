import {
  Card as CardInterface,
  Media,
} from "../interfaces/vender-vehiculo.interface";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Tag } from "lucide-react";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroCard } from "@/components/ui/heroCard";
import Link from "next/link";

interface HeroSectionProps {
  titulo: string;
  descripcion: string;
  profesional: CardInterface;
  particular: CardInterface;
  imagen: Media;
}

export function HeroSection({
  titulo,
  descripcion,
  profesional,
  particular,
  imagen,
}: HeroSectionProps) {
  return (
    <>
      <Hero
        image={imagen.url}
        floatingContent={<HeroBackdrop />}
        leftContent={
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white">
              {titulo}
            </h1>
            <p className="text-base md:text-base text-slate-300">
              {descripcion}
            </p>
          </div>
        }
        rightContent={
          <div className=" flex flex-col gap-2 justify-center ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl">
              {/* Card Profesional */}
              <HeroCard
                title={profesional.titulo}
                description={profesional.descripcion}
                content={
                  <Link href={profesional.boton?.url || ""}>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      {profesional.boton?.label}
                    </Button>
                  </Link>
                }
                iconName="FaAward"
              />
              <HeroCard
                title={particular.titulo}
                description={particular.descripcion}
                content={
                  <Link href={particular.boton?.url || ""}>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      {particular.boton?.label}
                    </Button>
                  </Link>
                }
                iconName="FaTag"
              />
            </div>
          </div>
        }
      />
    </>
  );
}
