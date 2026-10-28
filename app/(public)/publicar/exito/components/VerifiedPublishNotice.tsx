"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { track } from "@/lib/analytics/funnel";

interface VerifiedPublishNoticeProps {
  vehicleId: string;
}

const buildTrackedKey = (vehicleId: string): string =>
  `wia_anuncio_publicado_verificado_${vehicleId}`;

/** Se monta tras verificar el correo (`?verified=1`): el borrador acaba de publicarse. */
export const VerifiedPublishNotice = ({
  vehicleId,
}: VerifiedPublishNoticeProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    toast.success("Cuenta verificada", {
      description: "Tu anuncio ya está publicado.",
    });

    const trackedKey = buildTrackedKey(vehicleId);
    if (!sessionStorage.getItem(trackedKey)) {
      sessionStorage.setItem(trackedKey, "1");
      track("anuncio_publicado", { listing_id: vehicleId });
    }

    const params = new URLSearchParams({ id: vehicleId });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [vehicleId, pathname, router]);

  return null;
};
