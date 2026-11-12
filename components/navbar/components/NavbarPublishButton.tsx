import type { ComponentProps } from "react";

import { PublicarLink } from "@/components/analytics/PublicarLink";
import { Button } from "@/components/ui/button";

interface NavbarPublishButtonProps extends ComponentProps<typeof Button> {
  href: string;
  children?: React.ReactNode;
}

export function NavbarPublishButton({ ...props }: NavbarPublishButtonProps) {
  return (
    <PublicarLink href="/publicar" source="header" className="hidden lg:block">
      <Button {...props} size="sm">
        {props.children || "Vender"}
      </Button>
    </PublicarLink>
  );
}
