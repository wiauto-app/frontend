import Link from "next/link";
import type { ComponentProps } from "react";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";

type NavbarPublishButtonProps = ComponentProps<typeof Button>;

export function NavbarPublishButton({ ...props }: NavbarPublishButtonProps) {
  const { user } = useUser();

  if (user) {
    return (
      <Link href="/publicar">
        <Button {...props} size="sm">Publicar</Button>
      </Link>
    );
  }

  return (
    <SignInDialog
      returnTo="/publicar"
      trigger={<Button {...props} size="sm">Publicar</Button>}
    />
  );
}
