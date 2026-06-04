import { AppleIcon } from "@/components/icons/AppleIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";

type AppleLoginProps = {
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
};

export const AppleLogin = ({
  disabled = false,
  className,
  iconClassName,
}: AppleLoginProps) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("flex-1", className)}
      disabled={disabled}
      render={
        <a href={authService.appleLogin()}>
          <AppleIcon className={iconClassName} />
          Continuar con Apple ID
        </a>
      }
    ></Button>
  );
};
