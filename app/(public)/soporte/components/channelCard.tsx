"use client";

import { useState } from "react";

import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { IconContainer } from "@/components/ui/iconContainer";
import { SoporteCard } from "../interfaces/soporte.interface";
import { StrapiButton } from "@/components/ui/strapiButton";

export const ChannelCard = ({ channel }: { channel: SoporteCard }) => {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {channel.iconName ? (
            <IconContainer
              size="xl"
              Icon={resolveStrapiIconName(
                channel.iconName,
                defaultStrapiIconPack,
              )}
            />
          ) : null}
          <CardTitle className="text-center text-2xl font-bold">
            {channel.titulo}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-center text-sm">
            {channel.descripcion}
          </CardDescription>
          {channel.boton ? (
            <StrapiButton
              button={channel.boton}
              onFunctionClick={() => setIsTicketDialogOpen(true)}
            />
          ) : null}
        </CardContent>
      </Card>

      {channel.boton?.funcion ? (
        <CreateTicketDialog
          open={isTicketDialogOpen}
          onOpenChange={setIsTicketDialogOpen}
        />
      ) : null}
    </>
  );
};
