"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconContainer } from "@/components/ui/iconContainer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { HERO_TRUST_ITEMS } from "../constants";
import { ReportPreviewCard } from "./ReportPreviewCard";
import { SpanishLicensePlateInput } from "./SpanishLicensePlateInput";

export const PlateSearch = () => {
  const [plate, setPlate] = useState("");
  const [vin, setVin] = useState("");

  const handleSearch = () => {
    // TODO: conectar con flujo de consulta de informe
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-custom relative z-10 mx-auto px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <FileText className="size-3.5" aria-hidden />
              Informe WiAuto
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                Conoce el coche antes de comprarlo
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
                Consulta el historial completo de cualquier vehículo en
                segundos y compra con total seguridad.
              </p>
            </div>

            <Card className="border-0 bg-white py-0 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 rounded-2xl">
              <CardContent className="p-6">
                <Tabs defaultValue="plate">
                  <TabsList
                    variant="line"
                    className="mb-5 h-auto w-full justify-start gap-8 border-b border-slate-100 bg-transparent p-0"
                  >
                    <TabsTrigger
                      value="plate"
                      className="rounded-none px-2 pb-3 text-sm font-bold text-slate-500 after:bg-primary data-[state=active]:text-primary data-[state=active]:font-bold transition-all"
                    >
                      Matrícula
                    </TabsTrigger>
                    <TabsTrigger
                      value="vin"
                      className="rounded-none px-2 pb-3 text-sm font-bold text-slate-500 after:bg-primary data-[state=active]:text-primary data-[state=active]:font-bold transition-all"
                    >
                      VIN
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="plate" className="mt-0">
                    <div className="relative">
                      <SpanishLicensePlateInput
                        id="plate-input"
                        value={plate}
                        onChange={setPlate}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className="flex size-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-400">?</span>
                        <span className="leading-tight text-[11px]">¿Dónde<br className="sm:hidden" /> encontrarla?</span>
                      </button>
                    </div>
                  </TabsContent>

                  <TabsContent value="vin" className="mt-0">
                    <div className="relative">
                      <Input
                        id="vin-input"
                        value={vin}
                        onChange={(event) =>
                          setVin(event.target.value.toUpperCase())
                        }
                        placeholder="Introduce el VIN / bastidor"
                        className="h-14 pl-5 pr-28 text-left sm:text-base text-sm font-semibold tracking-wide rounded-xl border-slate-200"
                        maxLength={17}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className="flex size-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-400">?</span>
                        <span className="leading-tight text-[11px]">¿Dónde<br className="sm:hidden" /> encontrarlo?</span>
                      </button>
                    </div>
                  </TabsContent>

                  <Button
                    size="lg"
                    className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-bold text-white shadow-md hover:bg-primary/95 transition-all"
                    onClick={handleSearch}
                  >
                    <Search className="size-4" aria-hidden />
                    Consultar vehículo
                  </Button>
                </Tabs>
              </CardContent>
            </Card>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {HERO_TRUST_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label} className="flex items-center gap-2">
                    <div className="flex size-5 items-center justify-center rounded-full border border-primary/30 text-primary">
                      <Icon className="size-3" aria-hidden />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {/* Centered blue circle with radial gradient: darker in center, fading to edges */}
            <div 
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] sm:size-[580px] rounded-full bg-[radial-gradient(circle_at_center,#DBEAFE_0%,#EBF3FF_55%,transparent_75%)] opacity-80" 
              aria-hidden 
            />
            {/* Decorative dot matrix pattern in top right */}
            <div 
              className="pointer-events-none absolute -right-6 -top-6 hidden h-28 w-28 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-50 lg:block" 
              aria-hidden 
            />

            <div className="relative z-10 w-full flex justify-center lg:justify-end">
              <ReportPreviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
