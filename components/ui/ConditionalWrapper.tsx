"use client";

import { usePathname } from "next/navigation";

interface ConditionalWrapperProps {
  children: React.ReactNode;
  /** Si la ruta actual incluye alguno de estos paths, no se renderizan los children. */
  hideOnPaths?: string[];
  className?: string;
}

export const ConditionalWrapper = ({
  children,
  hideOnPaths = [],
  className,
}: ConditionalWrapperProps) => {
  const pathname = usePathname();

  const shouldHide =
    hideOnPaths.length > 0 &&
    hideOnPaths.some((path) => pathname.includes(path));

  if (shouldHide) {
    return null;
  }

  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
};
