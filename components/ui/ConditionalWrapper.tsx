"use client";

import { useUserType } from "@/hooks/useUserType";
import { usePathname } from "next/navigation";

interface ConditionalWrapperProps {
  children: React.ReactNode;
  paths?: string[];
  justParticular?: boolean;
  justProfessional?: boolean;
  className?: string;
}

export const ConditionalWrapper = ({
  children,
  paths = [],
  justParticular = false,
  justProfessional = false,
  className,
}: ConditionalWrapperProps) => {
  const pathname = usePathname();
  const { isParticular } = useUserType();

  // Si no coincide la ruta, no aplicamos ninguna restricción.
  const matchesPath =
    paths.length === 0 || paths.some((path) => pathname.includes(path));

  if (matchesPath) {
    if (justParticular && !isParticular) {
      return null;
    }

    if (justProfessional && isParticular) {
      return null;
    }
  }

  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
};