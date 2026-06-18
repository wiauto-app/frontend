"use client";

import {
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "@/app/(public)/concesionarias/constants";
import type { DealerProfile } from "../interfaces";

const BRAND_BLUE_TEXT = BRAND_BLUE;

type DealerProfileSidebarProps = {
  dealer: DealerProfile;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-sm font-bold text-slate-900">{children}</h3>
  );
}

export function DealerProfileSidebar({ dealer }: DealerProfileSidebarProps) {
  return (
    <div className="-mt-20 space-y-4 sm:-mt-24 relative z-20">
      {/* ── Card 1: Avatar + Name + Actions ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex flex-col items-center px-5 pb-5 text-center">
          {/* Fondo azul curvado superior */}
          <div className="absolute inset-x-0 top-0 h-28 overflow-hidden rounded-t-2xl">
            <div
              className="absolute inset-x-[-10%] top-[-50%] h-[150%] w-[120%] rounded-[50%]"
              style={{ backgroundColor: "#001B3D" }}
            />
          </div>

          {/* Circular avatar */}
          <div className="relative z-10 mt-10 size-20 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-sm sm:size-24">
            {dealer.avatar ? (
              <img
                src={dealer.avatar}
                alt={dealer.name}
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

          {/* Label */}
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Concesionaria
          </p>

          {/* Name + verified badge */}
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <h2 className="text-lg font-bold text-slate-900">{dealer.name}</h2>
            {dealer.isVerified && (
              <ShieldCheck
                className="size-4 shrink-0"
                style={{ color: BRAND_BLUE_TEXT }}
              />
            )}
          </div>

          {/* Rating */}
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm">
            <Star className="size-4 fill-[#FFB800] text-[#FFB800]" />
            <span className="font-bold text-slate-800">
              {dealer.rating.toFixed(1)}
            </span>
            <span className="text-slate-500">({dealer.reviewCount} reseñas)</span>
          </div>

          {/* Membership */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="size-3.5 text-slate-400" />
              Miembro desde {dealer.memberSince}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="size-3.5 text-slate-400" />
              Última conexión: {dealer.lastConnection}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex w-full flex-col gap-2.5">
            <Button
              id="dealer-send-message"
              className="w-full rounded-xl font-semibold text-white shadow-none"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              Enviar mensaje
            </Button>
            <Button
              id="dealer-call-btn"
              variant="outline"
              className="w-full rounded-xl font-semibold shadow-none hover:bg-slate-50"
              style={{
                borderColor: `${BRAND_BLUE}50`,
                color: BRAND_BLUE,
              }}
            >
              Llamar
            </Button>
          </div>
        </div>
      </div>

      {/* ── Card 2: Sobre nosotros ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionTitle>Sobre nosotros</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-600">
            {dealer.about}
          </p>
          <ul className="mt-4 space-y-3">
            {dealer.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <div className="mt-0.5 rounded-full bg-[#0061F2]/10 p-0.5">
                  <CheckCircle2
                    className="size-3.5 shrink-0"
                    style={{ color: BRAND_BLUE_TEXT }}
                  />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Card 3: Contacto ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionTitle>Contacto</SectionTitle>
          <ul className="space-y-3.5 text-sm text-slate-600">
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-[#0061F2]" />
              {dealer.contact.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-[#0061F2]" />
              {dealer.contact.email}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-[#0061F2]" />
              {dealer.contact.location}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-[#0061F2]" />
              {dealer.contact.schedule}
            </li>
          </ul>
        </div>
      </div>

      {/* ── Card 4: Vendedor verificado ── */}
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
                Este vendedor ha sido verificado por WiAuto.{" "}
                <span className="font-medium" style={{ color: BRAND_BLUE }}>
                  Más información
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 5: Descripción (Stats + Rating bars) ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionTitle>Descripción</SectionTitle>

          {/* 3-stat row */}
          <div className="mb-6 mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 px-2 py-3">
              <div className="flex items-center justify-center gap-1">
                <Star className="size-3.5 fill-[#0061F2] text-[#0061F2]" />
                <p className="text-base font-bold text-slate-900">
                  {dealer.stats.score.toFixed(1)}
                </p>
              </div>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Puntuación</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-3">
              <p className="text-base font-bold text-slate-900">
                {dealer.stats.completedSales}
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Ventas<br/>concretadas</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-3">
              <p className="text-base font-bold text-slate-900">
                {dealer.stats.responseTime}
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Tiempo de<br/>respuesta</p>
            </div>
          </div>

          {/* Rating bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const item = dealer.ratingDistribution?.find(
                (e) => e.stars === stars,
              );
              const count = item?.count ?? 0;
              const maxCount = Math.max(
                ...(dealer.ratingDistribution?.map((e) => e.count) ?? [1]),
                1,
              );
              const width = `${(count / maxCount) * 100}%`;
              return (
                <div
                  key={stars}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span className="w-2.5 shrink-0 text-right font-medium">{stars}</span>
                  <Star className="size-3 shrink-0 fill-[#0061F2] text-[#0061F2]" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width, backgroundColor: BRAND_BLUE }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
