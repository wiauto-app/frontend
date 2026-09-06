"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const VEHICLE_DETAIL_TABS = [
  {
    label: "Datos principales",
    value: "main-data",
  },
  {
    label: "Equipamiento",
    value: "equipment",
  },
  {
    label: "Descripción",
    value: "description",
  },
  {
    label: "Financiación",
    value: "financing",
  },
  {
    label: "Garantías",
    value: "guarantees",
  },
  {
    label: "Ubicación",
    value: "location",
  },
] as const;

export type VehicleDetailTabValue =
  (typeof VEHICLE_DETAIL_TABS)[number]["value"];

interface VehicleDetailTabsProps {
  value: VehicleDetailTabValue;
  onValueChange: (value: VehicleDetailTabValue) => void;
}

export const VehicleDetailTabs = ({
  value,
  onValueChange,
}: VehicleDetailTabsProps) => {
  const handleTabChange = (nextValue: string) => {
    onValueChange(nextValue as VehicleDetailTabValue);
  };

  return (
    <Tabs
      value={value}
      onValueChange={handleTabChange}
      className="w-full gap-0 border-b border-border"
    >
      <TabsList
        variant="line"
        className={cn(
          "w-full justify-start gap-0 overflow-visible rounded-none bg-transparent p-0",
        )}
      >
        {VEHICLE_DETAIL_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            id={`vehicle-tab-${tab.value}`}
            aria-controls={`vehicle-panel-${tab.value}`}
            className={cn(
              "h-auto flex-none rounded-t-lg border-0 bg-transparent px-4 py-3 text-sm text-gray-500 shadow-none",
              "hover:bg-transparent hover:text-gray-900",
              "data-active:bg-transparent data-active:text-primary data-active:shadow-none hover:bg-gray-100 hover:text-gray-900",
              "after:bg-primary group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
              "group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5",
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
