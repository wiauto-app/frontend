import Image from "next/image";
import {
  AlertTriangle,
  Calendar,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Lock,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { SAMPLE_VEHICLE } from "../constants";

const STATS = [
  { icon: Gauge, label: "Kilometraje", value: SAMPLE_VEHICLE.mileage },
  { icon: Users, label: "Propietarios", value: SAMPLE_VEHICLE.owners },
  {
    icon: CheckCircle2,
    label: "Situación administrativa",
    value: SAMPLE_VEHICLE.adminStatus,
    success: true,
  },
  {
    icon: ClipboardCheck,
    label: "Inspecciones",
    value: SAMPLE_VEHICLE.inspections,
    success: true,
  },
  {
    icon: AlertTriangle,
    label: "Incidencias",
    value: SAMPLE_VEHICLE.incidents,
    highlight: true,
  },
  {
    icon: Calendar,
    label: "Última actualización",
    value: SAMPLE_VEHICLE.lastUpdate,
  },
];

export const ReportPreviewCard = () => {
  return (
    <div className="w-full max-w-[430px] overflow-hidden rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 ring-border">
      {/* Header inside card */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/60">
        <span className="text-xl font-black tracking-tight text-primary">
          Wi<span className="text-slate-900">Auto</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          Informe generado el {SAMPLE_VEHICLE.lastUpdate}
        </span>
      </div>

      {/* Car details row */}
      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-24 w-36 shrink-0">
          <Image
            src={SAMPLE_VEHICLE.image}
            alt={`${SAMPLE_VEHICLE.make} ${SAMPLE_VEHICLE.model}`}
            fill
            className="object-contain"
            sizes="150px"
            priority
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">
            {SAMPLE_VEHICLE.make} {SAMPLE_VEHICLE.model}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {SAMPLE_VEHICLE.variant}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {SAMPLE_VEHICLE.year} · Híbrido · {SAMPLE_VEHICLE.power}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            VIN: {SAMPLE_VEHICLE.vin}
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="size-3.5 fill-emerald-500 text-white" />
            Sin cargas importantes
          </div>
        </div>
      </div>

      {/* Grid of stats (2 columns, separated by thin borders) */}
      <div className="mt-5 grid grid-cols-2 rounded-2xl border border-slate-100 bg-white divide-x divide-y divide-slate-100">
        {/* Row 1 */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Gauge className="size-3.5" />
            <span className="text-[11px] text-slate-400">Kilometraje actual</span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900">{SAMPLE_VEHICLE.mileage}</p>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="size-3.5" />
            <span className="text-[11px] text-slate-400">Propietarios</span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900">{SAMPLE_VEHICLE.owners}</p>
        </div>

        {/* Row 2 */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ClipboardCheck className="size-3.5" />
            <span className="text-[11px] text-slate-400">Situación administrativa</span>
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-600">En orden</p>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="size-3.5" />
            <span className="text-[11px] text-slate-400">Inspecciones</span>
          </div>
          <p className="mt-1 text-xs font-bold text-emerald-600">ITV al día</p>
        </div>

        {/* Row 3 */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <AlertTriangle className="size-3.5" />
            <span className="text-[11px] text-slate-400">Incidencias</span>
          </div>
          <div className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-600">
            1 encontrada
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="size-3.5" />
            <span className="text-[11px] text-slate-400">Última actualización</span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900">{SAMPLE_VEHICLE.lastUpdate}</p>
        </div>
      </div>

      {/* Bottom banner link */}
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50/70 py-3 text-xs font-bold text-primary">
        <Lock className="size-3.5" />
        Informe completo con más de 30 comprobaciones
      </div>
    </div>
  );
};
