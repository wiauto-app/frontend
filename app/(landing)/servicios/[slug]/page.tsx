import { notFound } from "next/navigation";

import { servicesService } from "../services/servicesService";
import { LandingHeader } from "@/components/ui/landingHeader";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: ServicePageProps) {
  const { slug } = await params;

  let service;
  try {
    service = await servicesService.findBySlug(slug);
  } catch {
    notFound();
  }


  return (
    <div>
      <LandingHeader title={service.titulo} />
    </div>
  );
}
