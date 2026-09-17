"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/home/SectionHeading";

export const FinanciacionSimuladorCard = () => {
  const [precio, setPrecio] = useState<number>(20000);
  const [entrada, setEntrada] = useState<number>(4000); // 20%
  const [plazo, setPlazo] = useState<number>(60);

  const financiado = Math.max(0, precio - entrada);
  const tasaAnual = 0.064; // 6.40%
  const tasaMensual = tasaAnual / 12;

  // Cálculo de cuota mensual
  const cuota =
    financiado > 0 && plazo > 0
      ? (financiado * (tasaMensual * Math.pow(1 + tasaMensual, plazo))) /
        (Math.pow(1 + tasaMensual, plazo) - 1)
      : 0;

  return (
    <div className="bg-[#0b1936] text-white p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
      
        <h3 className="text-xl sm:text-2xl font-bold mb-1">
          Simula tu financiación ahora
        </h3>
        <p className="text-sm text-slate-300 mb-6">y conoce tu cuota ideal</p>

        <div className="space-y-5">
          {/* Slider 1: Precio del vehiculo */}
          <div>
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-slate-300">Precio del vehículo</span>
              <span className="bg-[#162a52] px-3 py-1 rounded text-xs font-semibold text-white">
                {precio.toLocaleString("es-ES")} €
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={50000}
              step={500}
              value={precio}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPrecio(val);
                if (entrada > val) setEntrada(val);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5.000 €</span>
              <span>50.000 €</span>
            </div>
          </div>

          {/* Slider 2: Entrada Inicial */}
          <div>
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-slate-300">Entrada inicial</span>
              <span className="bg-[#162a52] px-3 py-1 rounded text-xs font-semibold text-white">
                {Math.round((entrada / precio) * 100)}% (
                {entrada.toLocaleString("es-ES")} €)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={precio * 0.5}
              step={500}
              value={entrada}
              onChange={(e) => setEntrada(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Slider 3: Plazo */}
          <div>
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-slate-300">Plazo</span>
              <span className="bg-[#162a52] px-3 py-1 rounded text-xs font-semibold text-white">
                {plazo} meses
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={72}
              step={12}
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>12 meses</span>
              <span>72 meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Blanca Resultado */}
      <Card>
        <CardHeader>
          <SectionHeading
          className="text-start"
            lead="Tu cuota mensual estimada"
          />
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[32px] font-extrabold tracking-tight text-slate-900">
              {cuota.toFixed(2).replace(".", ",")} €
            </span>
            <span className="text-sm font-medium text-slate-500">/mes</span>
          </div>
        </CardHeader>
        <Separator/>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-blue-600 shrink-0" />
              <span>
                Tasa de interés anual: <strong>6,40%</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-blue-600 shrink-0" />
              <span>
                Cantidad financiada:{" "}
                <strong>{financiado.toLocaleString("es-ES")} €</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-blue-600 shrink-0" />
              <span>
                Plazo: <strong>{plazo} meses</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            *Esta es una simulación referencial.
          </p>

          {/* <Button >
            Solicitar financiación
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};
