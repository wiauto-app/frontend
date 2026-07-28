"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { servicesService } from "@/app/(landing)/servicios/services/servicesService";
import { Service } from "@/app/(landing)/servicios/interfaces/service.interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { isServicesNavActive } from "../constants/navLinks.constants";
import { getNavLinkItemClassName } from "./getNavLinkItemClassName";

type ServicesDropdownProps = {
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
};

const ServicesList = ({
  services,
  onNavigate,
  className,
}: {
  services: Service[];
  onNavigate?: () => void;
  className?: string;
}) => {
  if (services.length === 0) {
    return (
      <p className={cn("px-3 py-2 text-sm text-slate-500", className)}>
        No hay servicios disponibles
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col", className)}>
      {services.map((service) => (
        <li key={service.id}>
          <Link
            href={`/servicios/${service.slug}`}
            onClick={onNavigate}
            className="flex min-h-11 items-center px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-[#0061F2]"
          >
            {service.titulo}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const ServicesNavSection = ({
  onNavigate,
}: {
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = isServicesNavActive(pathname);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesService.findAll(),
  });

  const services = data?.data ?? [];

  return (
    <Accordion className="border-b border-slate-100">
      <AccordionItem value="servicios" className="border-none">
        <AccordionTrigger
          className={cn(
            getNavLinkItemClassName("mobile", isActive),
            "min-h-11 py-3 hover:no-underline focus-visible:ring-0",
          )}
        >
          Servicios
        </AccordionTrigger>
        <AccordionContent className="pb-2 pt-0">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-slate-500">Cargando servicios...</p>
          ) : (
            <ServicesList services={services} onNavigate={onNavigate} className="pl-2" />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const ServicesDropdown = ({
  variant = "dropdown",
  onNavigate,
}: ServicesDropdownProps) => {
  const pathname = usePathname();
  const isActive = isServicesNavActive(pathname);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesService.findAll(),
  });

  const services = data?.data ?? [];

  if (variant === "inline") {
    return <ServicesNavSection onNavigate={onNavigate} />;
  }

  return (
    <li className="list-none">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={cn(
                getNavLinkItemClassName("desktop", isActive),
                "gap-1 bg-transparent",
              )}
              aria-label="Servicios"
            >
              Servicios
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
          }
        />
        <DropdownMenuContent className="w-80" align="start">
          {isLoading ? (
            <p className="px-2 py-3 text-sm text-slate-500">Cargando servicios...</p>
          ) : (
            services.map((service) => (
              <DropdownMenuItem
                key={service.id}
                render={
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="text-sm font-medium"
                    onClick={onNavigate}
                  >
                    {service.titulo}
                  </Link>
                }
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
