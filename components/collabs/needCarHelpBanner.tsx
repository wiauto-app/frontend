import { ChevronRightIcon, LockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { collabsService } from "./services/collabsService";
import { HeroFeatures } from "../home/heroFeatures";
import { StrapiRenderer } from "../ui/strapiRenderer";

export const NeedCarHelpBanner = async () => {
  const content = await collabsService.getReviewCollabContent();
  const card = content?.card;
  const primaryAction = card?.acciones?.[0];
  const imageUrl = card?.imagen?.url;

  return (
    <Card className="border border-need-car-help-banner pb-0">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <IconContainer
              backgroundColor="#fff"
              iconColor="var(--need-car-help-banner)"
              Icon={IoCarSportOutline}
              size="lg"
              className="size-12 sm:size-16 lg:size-20"
            />
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">
                {card?.titulo}
              </CardTitle>
              <CardDescription className="text-xs text-pretty sm:text-sm">
                {card?.descripcion}
              </CardDescription>
            </div>
          </div>

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              width={180}
              height={140}
              sizes="(min-width: 1024px) 180px, 112px"
              className="hidden h-auto w-28 shrink-0 sm:block lg:w-[180px]"
            />
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-stretch gap-4 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <HeroFeatures
          features={card?.caracteristicas || []}
          className="text-primary"
          containerClassName="flex flex-col gap-3"
        />

        {primaryAction ? (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <Button
              nativeButton={false}
              className="w-full bg-need-car-help-banner text-white hover:bg-need-car-help-banner/80 sm:w-auto"
              render={<Link href={primaryAction.url} />}
            >
              {primaryAction.label}
              <ChevronRightIcon />
            </Button>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <LockIcon className="size-4 shrink-0" aria-hidden />
              Pago 100% seguro
            </span>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="border-t bg-muted-foreground/10 px-4 text-xs [.border-t]:py-2 sm:px-6">
        <StrapiRenderer content={card?.footer} />
      </CardFooter>
    </Card>
  );
};
