"use client";

import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Alert, UpdateAlertPayload } from "@/interfaces/alert.interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SavedSearchAlertToggles } from "./SavedSearchAlertToggles";
import { DeleteSavedSearchDialog } from "./DeleteSavedSearchDialog";
import { buildSavedSearchEditHref } from "../utils/alert-filters.utils";

type SavedSearchCardProps = {
  alert: Alert;
  onUpdate: (alertId: string, payload: UpdateAlertPayload) => Promise<void>;
  onDelete: (alertId: string) => Promise<void>;
  onExpand?: (alertId: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

export const SavedSearchCard = ({
  alert,
  onUpdate,
  onDelete,
  onExpand,
  isUpdating = false,
  isDeleting = false,
}: SavedSearchCardProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async (payload: UpdateAlertPayload) => {
    await onUpdate(alert.id, payload);
  };

  const handleDelete = async () => {
    await onDelete(alert.id);
  };

  const handleExpand = () => {
    void onExpand?.(alert.id);
  };

  return (
    <>
      <Accordion className="rounded-lg border border-gray-100">
        <AccordionItem value={alert.id} className="border-0">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <AccordionTrigger
              className="flex-1 py-0 hover:no-underline"
              onClick={handleExpand}
            >
              <div className="flex flex-1 items-center justify-between gap-4 text-left">
                <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">Nuevos</p>
                  <p className="text-lg font-bold text-gray-900">
                    {alert.new_matches_count}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <div className="flex items-center gap-2 md:shrink-0">
              <Link
                href={buildSavedSearchEditHref(alert.filters)}
                aria-label={`Editar búsqueda ${alert.name}`}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 p-2 text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                aria-label={`Eliminar búsqueda ${alert.name}`}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AccordionContent className="px-4 pb-4">
            <SavedSearchAlertToggles
              alert={alert}
              onUpdate={handleUpdate}
              isUpdating={isUpdating}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DeleteSavedSearchDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        searchName={alert.name}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
