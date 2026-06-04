import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
type GoogleLoginProps = {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
};

export const GoogleLogin = ({
  disabled = false,
  className,
  iconClassName,
}: GoogleLoginProps) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("flex-1", className)}
      disabled={disabled}
      render={
        <a href={authService.googleLogin()}>
          <GoogleIcon className={iconClassName} />
          Continuar con Google
        </a>
      }
    ></Button>
  );
};
