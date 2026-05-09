import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const { logout } = useUser();
  return (
    <Button size="sm" variant="outline" onClick={async () => await logout()}>
      Cerrar sesión
    </Button>
  );
};
