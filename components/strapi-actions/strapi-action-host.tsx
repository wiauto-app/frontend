"use client";

import { SegurosLeadForm } from "@/app/(landing)/seguros/components/SegurosLeadForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  STRAPI_ACTION_KEYS,
  type StrapiActionKey,
} from "./strapi-action-keys";

interface StrapiActionHostProps {
  actionKey: StrapiActionKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StrapiActionHost = ({
  actionKey,
  open,
  onOpenChange,
}: StrapiActionHostProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  switch (actionKey) {
    case STRAPI_ACTION_KEYS.SEGUROS_FORM:
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-h-[calc(100vh-2rem)] max-w-lg overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>Calcular seguro</DialogTitle>
              <DialogDescription>
                Completa el formulario y te contactaremos con una propuesta.
              </DialogDescription>
            </DialogHeader>
            <SegurosLeadForm onSuccess={handleClose} />
          </DialogContent>
        </Dialog>
      );
    default:
      return null;
  }
};
