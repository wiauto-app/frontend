import { Card as CardInterface } from "../interfaces/vender-vehiculo.interface";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Tag } from "lucide-react";

interface HeroSectionProps {
  titulo: string;
  descripcion: string;
  profesional: CardInterface;
  particular: CardInterface;
}

export function HeroSection({ titulo, descripcion, profesional, particular }: HeroSectionProps) {
  return (
    <section className="relative px-10 md:px-0 w-full overflow-hidden bg-slate-900 text-white py-10 lg:py-20">
      {/* TODO: Add background image from API if available or use CSS background */}
      <div className="absolute inset-0 z-0 bg-[url('/hero-car-bg.jpg')] bg-cover bg-center opacity-40"></div>
      
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            {titulo}
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            {descripcion}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl">
          {/* Card Profesional */}
          <Card className="bg-white backdrop-blur-md border-white/20 text-slate-900 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">{profesional.titulo}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2 text-base">
                    {profesional.descripcion}
                  </CardDescription>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-full shrink-0">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              {profesional.boton && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  {profesional.boton.label}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Card Particular */}
          <Card className="bg-white text-slate-900 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">{particular.titulo}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2 text-base">
                    {particular.descripcion}
                  </CardDescription>
                </div>
                <div className="p-2 bg-slate-100 rounded-full shrink-0">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              {particular.boton && (
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50" size="lg">
                  {particular.boton.label}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
