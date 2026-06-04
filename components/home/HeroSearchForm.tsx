"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PriceUntilSelector } from "../selectors/priceUntilSelector";
import {
  HeroSearchFiltersProvider,
  useHeroSearchFilters,
} from "./HeroSearchFiltersContext";
import { HeroFiltersMakeSelector } from "./HeroFiltersMakeSelector";
import { HeroFiltersLocationSelector } from "./HeroFiltersLocationSelector";

const BRAND_BLUE = "#0061F2";

const TABS = [
  { id: "comprar", label: "Comprar" },
  { id: "vender", label: "Vender" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type SellOption = "particular" | "profesional";

const HeroSearchFormContent = () => {
  const router = useRouter();
  const { buildListingHref } = useHeroSearchFilters();
  const [activeTab, setActiveTab] = useState<TabId>("comprar");
  const [sellOption, setSellOption] = useState<SellOption>("particular");

  const handleSearch = () => {
    router.push(buildListingHref());
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors",
              activeTab === tab.id
                ? "text-white"
                : "bg-white text-slate-800 hover:bg-slate-50",
            )}
            style={
              activeTab === tab.id
                ? { backgroundColor: BRAND_BLUE }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "comprar" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <HeroFiltersMakeSelector />
          <HeroFiltersLocationSelector />
          <PriceUntilSelector />

          <button
            type="submit"
            className="h-12 w-full rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Buscar
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <SellOptionCard
            selected={sellOption === "particular"}
            label="Véndelo a un particular"
            onSelect={() => setSellOption("particular")}
          />
          <SellOptionCard
            selected={sellOption === "profesional"}
            label="Véndelo a un profesional"
            onSelect={() => setSellOption("profesional")}
          />
          <Link
            href="/crear-vehiculo"
            className={cn(
              buttonVariants(),
              "flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold text-white hover:opacity-90",
            )}
            style={{ backgroundColor: BRAND_BLUE }}
          >
            Continuar
          </Link>
        </div>
      )}
    </div>
  );
};

export function HeroSearchForm() {
  return (
    <HeroSearchFiltersProvider>
      <HeroSearchFormContent />
    </HeroSearchFiltersProvider>
  );
}

function SellOptionCard({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg border-2 px-4 py-4 text-left transition-colors",
        selected
          ? "border-[#0061F2] bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <Wallet
        className={cn(
          "size-6 shrink-0",
          selected ? "text-[#0061F2]" : "text-slate-300",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-sm font-semibold",
          selected ? "text-[#0061F2]" : "text-slate-400",
        )}
      >
        {label}
      </span>
    </button>
  );
}
