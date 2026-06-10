"use client";
import { servicesService } from "@/app/(landing)/servicios/services/servicesService";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ServicesDropdown = () => {
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesService.findAll(),
  });

  const services = data?.data ?? [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="link"
            className="text-sm font-bold text-slate-900 transition-colors hover:text-[#0061F2]"
          >
            Services
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        {services?.map((service) => (
          <DropdownMenuItem
            key={service.id}
            render={
              <Link href={`/servicios/${service.slug}`}>{service.titulo}</Link>
            }
          ></DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
