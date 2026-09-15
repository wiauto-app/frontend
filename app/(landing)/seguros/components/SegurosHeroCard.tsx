"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconContainer } from "@/components/ui/iconContainer";
import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import { SegurosLeadForm } from "./SegurosLeadForm";

interface SegurosHeroCardProps {
  card?: StrapiCard | null;
}

export const SegurosHeroCard = ({ card }: SegurosHeroCardProps) => {
  const [open, setOpen] = useState(false);
  const Icon = resolveStrapiIconName(
    card?.iconName ?? null,
    defaultStrapiIconPack,
  );

  const title = card?.titulo?.trim() || "Calcula tu seguro";
  const description =
    card?.descripcion?.trim() ||
    "Indica los datos de tu vehículo y te ayudamos a encontrar la cobertura adecuada.";
  const buttonLabel = card?.boton?.label?.trim() || "Calcular seguro";

  return (
    <>
      <Card className="z-10 h-fit max-w-64">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {Icon ? <IconContainer size="xl" rounded Icon={Icon} /> : null}
          {card?.imagen?.url ? (
            <Image
              src={card.imagen.url}
              alt={card.imagen.alternativeText ?? title}
              width={100}
              height={100}
            />
          ) : null}
          <CardTitle className="text-center text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="button"
            size="lg"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {buttonLabel}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Calcular seguro</DialogTitle>
            <DialogDescription>
              Completa el formulario y te contactaremos con una propuesta.
            </DialogDescription>
          </DialogHeader>
          <SegurosLeadForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
