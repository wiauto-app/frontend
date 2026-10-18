import type { ComponentProps } from "react";

import { PublicarLink } from "@/components/analytics/PublicarLink";
import { Button } from "@/components/ui/button";

type NavbarPublishButtonProps = ComponentProps<typeof Button>;

export function NavbarPublishButton({ ...props }: NavbarPublishButtonProps) {
  return (
    <PublicarLink href="/publicar" source="header">
      <Button {...props} size="sm">
        Vender
      </Button>
    </PublicarLink>
  );
}
