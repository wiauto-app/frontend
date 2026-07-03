import { AuthRequiredGate } from "@/components/auth/AuthRequiredGate";

interface AuthRequiredScreenProps {
  children: React.ReactNode;
  returnTo?: string;
  title?: string;
  description?: string;
  features?: string[];
}

export const AuthRequiredScreen = ({
  children,
  returnTo,
  title,
  description,
  features,
}: AuthRequiredScreenProps) => {
  return (
    <AuthRequiredGate
      returnTo={returnTo}
      title={title}
      description={description}
      features={features}
    >
      {children}
    </AuthRequiredGate>
  );
};
