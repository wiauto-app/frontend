"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { ControlledInput } from "@/components/forms/controlledInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { alertService } from "@/services/alertService";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import {
  saveSearchFormSchema,
  type SaveSearchFormValues,
} from "../schemas/saveSearchForm.schema";
import {
  buildCreateAlertPayload,
  hasAlertFilters,
} from "../utils/buildCreateAlertPayload";
import { ActiveFiltersChips } from "./ActiveFiltersChips";

interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
}

const EMPTY_FORM_VALUES: SaveSearchFormValues = {
  email: "",
  phone: {
    phone_code: "",
    phone: "",
  },
};

export const SaveSearchDialog = ({
  open,
  onOpenChange,
  defaultName,
}: SaveSearchDialogProps) => {
  const { user, isAuthenticated } = useUser();
  const { filters } = useVehiclesListingFilters();

  const form = useForm<SaveSearchFormValues>({
    resolver: zodResolver(saveSearchFormSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isAuthenticated && user) {
      form.reset({
        email: user.email ?? "",
        phone: {
          phone_code: user.phone_code ?? "",
          phone: user.phone ?? "",
        },
      });
      return;
    }

    form.reset(EMPTY_FORM_VALUES);
  }, [open, isAuthenticated, user, form]);

  const handleSubmit = async (data: SaveSearchFormValues) => {
    if (!hasAlertFilters(filters)) {
      toast.error("Añade al menos un filtro antes de guardar la búsqueda");
      return;
    }

    try {
      const response = await alertService.create(
        buildCreateAlertPayload({
          filters,
          email: data.email,
          phone: data.phone.phone,
          phone_code: data.phone.phone_code,
          name: defaultName,
        }),
      );

      if (!response.ok) {
        toast.error(response.message || "No se pudo guardar la búsqueda");
        return;
      }

      toast.success("Búsqueda guardada. Te avisaremos por correo.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la búsqueda",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Guardar búsqueda</DialogTitle>
          <DialogDescription>
            Recibe alertas cuando haya anuncios nuevos que coincidan con estos
            filtros.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Filtros activos</p>
          <ActiveFiltersChips readOnly />
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          noValidate
        >
          <ControlledInput
            name="email"
            control={form.control}
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
          />

          <ControlledInput
            name="phone"
            control={form.control}
            label="Teléfono"
            type="phone"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-label="Confirmar guardar búsqueda"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Guardando...
                </>
              ) : (
                <>
                  <Bell className="size-4" aria-hidden />
                  Guardar búsqueda
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
