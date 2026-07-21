"use client";
import { Button } from "@/components/ui/button";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { HiOutlineMap } from "react-icons/hi";
import { SHOW_MAP_KEY } from "../[[...slug]]/constants/filterKeys.constants";
import { cn } from "@/lib/utils";

export const MapButton = () => {
  const { values, handleChange } = useFiltersManager({
    keys: [SHOW_MAP_KEY],
  });

  const isMapVisible = values[SHOW_MAP_KEY] === "true";

  return (
    <Button
      variant="ghost"
      className={
        cn(
          isMapVisible && "text-primary bg-primary/10"
        )
      }
      onClick={() =>
        handleChange(SHOW_MAP_KEY, isMapVisible ? "false" : "true")
      }
    >
      {isMapVisible ? "Ocultar mapa" : "Ver en mapa"}
      <HiOutlineMap />
    </Button>
  );
};
