import Link from "next/link";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type NavbarPublishButtonProps = ComponentProps<typeof Button>;

export function NavbarPublishButton({ ...props }: NavbarPublishButtonProps) {
  return (
    <Link href="/publicar">
      <Button {...props} size="sm">
        Vender
      </Button>
    </Link>
  );
}
