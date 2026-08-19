"use client";

import { ShieldCheck, Star, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_BLUE } from "@/app/(public)/concesionarias/constants";
import type { DealerProfile } from "../interfaces";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { Card, CardContent } from "@/components/ui/card";

const BRAND_BLUE_TEXT = BRAND_BLUE;

type DealerProfileSidebarProps = {
  dealer: DealerProfile;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-bold text-slate-900">{children}</h3>;
}

export function DealerProfileSidebar({ dealer }: DealerProfileSidebarProps) {
  const has_contact =
    dealer.contact.phone ||
    dealer.contact.email ||
    dealer.contact.location ||
    dealer.contact.schedule;

  return (
    <div className="relative z-20 -mt-20 space-y-4 sm:-mt-24">
      <Card size="sm">
        <CardContent>
          <div className="absolute inset-x-0 top-0 h-28 overflow-hidden rounded-t-2xl">
            <div
              className="absolute inset-x-[-10%] top-[-50%] h-[150%] w-[120%] rounded-[50%]"
              style={{ backgroundColor: "#001B3D" }}
            />
          </div>

          <div className="relative z-10 mt-10 size-20 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-sm sm:size-24">
            {dealer.avatar ? (
              <WiautoImage
                src={dealer.avatar ?? ""}
                unoptimized
                alt={dealer.name}
                fill
                className="size-full object-cover"
              />
            ) : (
              <div
                className="flex size-full items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                {dealer.name.charAt(0)}
              </div>
            )}
          </div>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Concesionaria
          </p>

          <div className="mt-1 flex items-center justify-center gap-1.5">
            <h2 className="text-lg font-bold text-slate-900">{dealer.name}</h2>
            {dealer.isVerified ? (
              <ShieldCheck
                className="size-4 shrink-0"
                style={{ color: BRAND_BLUE_TEXT }}
              />
            ) : null}
          </div>

          {dealer.reviewCount > 0 ? (
            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm">
              <Star className="size-4 fill-[#FFB800] text-[#FFB800]" />
              <span className="font-bold text-slate-800">
                {dealer.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">
                ({dealer.reviewCount} reseñas)
              </span>
            </div>
          ) : null}

          {dealer.memberSince ? (
            <div className="mt-3 text-xs text-slate-500">
              <div className="flex items-center justify-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />
                Miembro desde {dealer.memberSince}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex w-full flex-col gap-2.5">
            <Button
              id="dealer-send-message"
              className="w-full rounded-xl font-semibold text-white shadow-none"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              Enviar mensaje
            </Button>
            {dealer.contact.phone ? (
              <Button
                id="dealer-call-btn"
                variant="outline"
                className="w-full rounded-xl font-semibold shadow-none hover:bg-slate-50"
                style={{
                  borderColor: `${BRAND_BLUE}50`,
                  color: BRAND_BLUE,
                }}
                render={
                  <a href={`tel:${dealer.contact.phone.replace(/\s/g, "")}`}>
                    Llamar
                  </a>
                }
              ></Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {dealer.about ? (
        <Card>
          <CardContent >
            <SectionTitle>Sobre nosotros</SectionTitle>
            <p className="text-sm leading-relaxed text-slate-600">
              {dealer.about}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {has_contact ? (
        <Card >
          <CardContent >
            <SectionTitle>Contacto</SectionTitle>
            <ul className="space-y-3.5 text-sm text-slate-600">
              {dealer.contact.phone ? (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.phone}
                </li>
              ) : null}
              {dealer.contact.email ? (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.email}
                </li>
              ) : null}
              {dealer.contact.location ? (
                <li className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0 text-[#0061F2]" />
                  {dealer.contact.location}
                </li>
              ) : null}
              {dealer.contact.schedule ? (
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-[#0061F2]" />
                  <span className="whitespace-pre-line">
                    {dealer.contact.schedule}
                  </span>
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {dealer.isVerified ? (
        <div className="overflow-hidden rounded-2xl border-transparent bg-[#F5F8FF] shadow-none">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Vendedor verificado
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Este vendedor ha sido verificado por WiAuto.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
