import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { getServerSession } from "@/lib/ensure-session.server";
import { BillingPlanCheckoutContent } from "./components/BillingPlanCheckoutContent";

export const metadata: Metadata = {
  title: "Contratar plan | WiAuto",
  description:
    "Completa tus datos profesionales y continúa al pago seguro de tu plan WiAuto.",
};

interface BillingPlanPageProps {
  searchParams: Promise<{ plan_price_id?: string }>;
}

export default async function BillingPlanPage({
  searchParams,
}: BillingPlanPageProps) {
  const params = await searchParams;
  const planPriceId = params.plan_price_id?.trim() ?? "";

  if (!planPriceId) {
    redirect("/planes");
  }

  const session = await getServerSession();

  if (!session.ok) {
    const returnPath = `/billing-plan?plan_price_id=${encodeURIComponent(planPriceId)}`;
    redirect(
      `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(returnPath)}`,
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8 md:py-12">
      <BillingPlanCheckoutContent planPriceId={planPriceId} />

      <div className="flex justify-start">
        <Button variant="ghost" render={<Link href="/planes" />}>
          Volver a planes
        </Button>
      </div>
    </div>
  );
}
