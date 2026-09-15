"use client";

import { Suspense, type ReactNode } from "react";

type ConcesionariasListingShellProps = {
  children: ReactNode;
};

export const ConcesionariasListingShell = ({
  children,
}: ConcesionariasListingShellProps) => (
  <Suspense>{children}</Suspense>
);
