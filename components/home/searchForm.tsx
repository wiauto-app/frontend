"use client";

import { useState } from "react";
import { ConditionButton } from "./conditionButton";
import { HeroSearchForm } from "./HeroSearchForm";
import { useRouter } from "next/navigation";

export const SearchForm = () => {
  const [condition, setCondition] = useState<"new" | "used">("new");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-0 w-full md:max-w-[85%]">
      <div className="flex">
        <ConditionButton
          isActive={condition === "new"}
          onClick={() => setCondition("new")}
        >
          Nuevos
        </ConditionButton>
        <ConditionButton
          isActive={condition === "used"}
          onClick={() => setCondition("used")}
        >
          Usados
        </ConditionButton>
        <ConditionButton
          isActive={false}
          onClick={() => router.push("/crear-vehiculo")}
        >
          Vender
        </ConditionButton>
      </div>
      <HeroSearchForm/>
    </div>
  );
};
