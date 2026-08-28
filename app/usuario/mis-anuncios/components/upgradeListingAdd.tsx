import { BrandLogo } from "@/components/ui/brandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  GalleryHorizontal,
  Star,
  TrendingUp,
  TvMinimalPlay,
} from "lucide-react";
import { FaCrown } from "react-icons/fa";
import Image from "next/image";

const FEATURE_ICON_CLASS = "size-5 sm:size-6";

export const UpgradeListingAdd = () => {
  const imageUrl =
    "https://media.wiauto.es/wiauto-strapi/exec_4327be29_212e_499e_91f2_cc9a5e030c33_26fc3a64a7.png";
  const features = [
    {
      icon: <GalleryHorizontal className={FEATURE_ICON_CLASS} />,
      title: "Publica sin límites",
    },
    {
      icon: <TrendingUp className={FEATURE_ICON_CLASS} />,
      title: "Más visibilidad",
    },
    {
      icon: <TvMinimalPlay className={FEATURE_ICON_CLASS} />,
      title: "Añade vídeos",
    },
    {
      icon: <Star className={FEATURE_ICON_CLASS} />,
      title: "Destaca tus anuncios",
    },
  ];

  return (
    <Card>
      {/*
        Móvil: una columna en orden texto → media → CTA.
        lg: dos columnas; el bloque de media ocupa las dos filas de la derecha
        y el CTA queda bajo el texto, a la izquierda.
      */}
      <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
          <BrandLogo
            variant="pro-sm-black"
            className="h-16 w-40 sm:h-24 sm:w-56 lg:h-32 lg:w-64"
            sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 160px"
          />
          <h2 className="text-2xl font-bold text-balance sm:text-3xl lg:text-4xl">
            ¿Quieres publicar <span className="text-primary">más de 2</span>{" "}
            anuncios?
          </h2>
          <p className="text-sm font-semibold text-pretty sm:text-base">
            Cámbiate al plan <span className="text-primary">WiAuto Pro</span> y
            disfruta de todas las ventajas.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:row-span-2 justify-center">
          <Image
            src={imageUrl}
            alt="Ventajas del plan WiAuto Pro"
            width={500}
            height={500}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full rounded-xl object-contain"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex min-w-0 flex-col items-center justify-start gap-2"
              >
                <div className="rounded-md p-2 text-primary shadow-md">
                  {feature.icon}
                </div>
                <p className="text-center text-xs font-semibold text-balance">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end lg:pb-1">
          <Button className="flex h-12 w-full items-center justify-between gap-2 rounded-xl px-4 text-base font-medium sm:h-14 sm:px-6 sm:text-xl lg:h-16 lg:rounded-2xl lg:text-2xl">
            <FaCrown className="size-5 shrink-0 sm:size-6 lg:size-8" />
            <span className="truncate">Cambiarme a Pro</span>
            <ChevronRight className="size-5 shrink-0 sm:size-6 lg:size-8" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
