"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useUser } from "@/app/contexts/auth/useUser";

/** Sin sesión no hay perfil al que volver. */
export const QuickPublishBackLink = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/usuario/perfil"
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Volver al perfil
    </Link>
  );
};
