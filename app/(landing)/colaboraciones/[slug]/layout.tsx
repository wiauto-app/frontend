import type { ReactNode } from "react";

interface ColaboracionLayoutProps {
  children: ReactNode;
}

export default function ColaboracionLayout({
  children,
}: ColaboracionLayoutProps) {
  return <>{children}</>;
}
