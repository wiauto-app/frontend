"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActiveFiltersStore } from "../stores/activeFiltersStore";
import { SaveSearchDialog } from "./SaveSearchDialog";

export const SaveSearchButton = () => {
  const [open, setOpen] = useState(false);
  const { activeFilters } = useActiveFiltersStore();

  const handleOpenDialog = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full border-primary bg-primary/10 text-primary h-12 rounded-full hover:bg-primary/20 hover:text-primary"
        aria-label="Guardar búsqueda"
        onClick={handleOpenDialog}
      >
        Guardar búsqueda <Bell className="size-5" aria-hidden />
      </Button>
      <SaveSearchDialog
        open={open}
        onOpenChange={setOpen}
        defaultName={activeFilters?.title}
      />
    </>
  );
};
