"use client";

import { Cuota } from "@/interfaces/vehicle.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { PriceFilterValue } from "./types";

const cuotaPrices = [50, 100, 150, 200, 300, 500, 600, 700, 800, 900, 1000];

const prices = [
  1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000,
  24000, 25000, 30000, 35000, 40000, 50000, 60000, 70000,
];

type PriceSelectorProps = {
  cuotas: Cuota[];
  value: PriceFilterValue;
  onChange: (value: PriceFilterValue) => void;
};

export const PriceSelector = ({ cuotas, value, onChange }: PriceSelectorProps) => {
  return (
    <div>
      <Tabs>
        <TabsList className="w-full">
          <TabsTrigger value="cash">Contado</TabsTrigger>
          <TabsTrigger value="cuota">Cuota</TabsTrigger>
        </TabsList>
        <TabsContent value="cash">
          <div className="flex flex-col gap-2">
            <PriceSelect
              prices={prices}
              placeholder="Desde"
              value={value.since?.toString() ?? ""}
              onValueChange={(raw) =>
                onChange({
                  ...value,
                  since: raw ? Number(raw) : undefined,
                })
              }
            />
            <PriceSelect
              prices={prices}
              placeholder="Hasta"
              value={value.until?.toString() ?? ""}
              onValueChange={(raw) =>
                onChange({
                  ...value,
                  until: raw ? Number(raw) : undefined,
                })
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="cuota">
          <div className="flex flex-col gap-2">
            <PriceSelect
              prices={cuotaPrices}
              placeholder="Desde"
              value={value.since?.toString() ?? ""}
              onValueChange={(raw) =>
                onChange({
                  ...value,
                  since: raw ? Number(raw) : undefined,
                })
              }
            />
            <PriceSelect
              prices={cuotaPrices}
              placeholder="Hasta"
              value={value.until?.toString() ?? ""}
              onValueChange={(raw) =>
                onChange({
                  ...value,
                  until: raw ? Number(raw) : undefined,
                })
              }
            />
            <Select
              value={value.cuota_slug ?? ""}
              onValueChange={(raw) =>
                onChange({
                  ...value,
                  cuota_slug: raw || undefined,
                })
              }
              items={cuotas.map((cuota) => ({
                label: `${cuota.name}${
                  cuota.value > 12 ? ` (${(cuota.value / 12).toFixed(1)} años)` : ""
                }`,
                value: cuota.slug,
              }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una cuota" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {cuotas.map((cuota) => (
                  <SelectItem key={cuota.id} value={cuota.slug}>
                    {cuota.name}{" "}
                    {cuota.value > 12 &&
                      `(${(cuota.value / 12).toFixed(1)} años)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PriceSelect = ({
  prices,
  placeholder,
  onValueChange,
  value,
}: {
  prices: number[];
  placeholder: string;
  onValueChange: (value: string) => void;
  value: string;
}) => {
  return (
    <Select value={value} onValueChange={(next) => onValueChange(next ?? "")}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {prices.map((price) => (
          <SelectItem
            key={price}
            value={price.toString()}
            className="text-lg font-medium"
          >
            {price} €
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
