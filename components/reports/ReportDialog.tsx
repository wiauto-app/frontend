"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ControlledInput } from "@/components/forms/controlledInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportCategory, ReportTarget } from "@/interfaces/report.interface";
import { getReportTargetTypeLabel } from "@/lib/reports/resolve-advertiser-report-target";
import { reportService } from "@/services/reportService";

import {
  reportFormSchema,
  type ReportFormValues,
} from "./schemas/report.schema";

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ReportTarget;
  onSuccess?: () => void;
};

const buildDefaultValues = (targetName: string): ReportFormValues => ({
  category_id: "",
  title: `Denuncia sobre ${targetName}`,
  description: "",
});

export const ReportDialog = ({
  open,
  onOpenChange,
  target,
  onSuccess,
}: ReportDialogProps) => {
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: buildDefaultValues(target.targetName),
  });

  const { isSubmitting } = form.formState;
  const targetTypeLabel = getReportTargetTypeLabel(target.targetType);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(buildDefaultValues(target.targetName));

    const loadCategories = async () => {
      setIsLoadingCategories(true);

      try {
        const response = await reportService.findCategories({
          target_type: target.targetType,
        });

        if (!response.ok) {
          toast.error(response.message || "No se pudieron cargar las categorías");
          setCategories([]);
          return;
        }

        setCategories(response.data?.data ?? []);
      } catch {
        toast.error("No se pudieron cargar las categorías");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    void loadCategories();
  }, [open, target.targetName, target.targetType]);

  const onSubmit = async (data: ReportFormValues) => {
    try {
      const response = await reportService.create({
        category_id: data.category_id,
        title: data.title.trim(),
        description: data.description.trim(),
        target_type: target.targetType,
        target_id: target.targetId,
      });

      if (!response.ok) {
        toast.error(response.message || "No se pudo enviar la denuncia");
        return;
      }

      toast.success("Denuncia enviada correctamente");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("No se pudo enviar la denuncia");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reportar {targetTypeLabel}</DialogTitle>
          <DialogDescription>
            Estás reportando a <strong>{target.targetName}</strong>. Describe el
            motivo de tu denuncia con el mayor detalle posible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            name="category_id"
            control={form.control}
            label="Motivo"
          >
            {({ field, fieldState }) =>
              isLoadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Cargando motivos...
                </div>
              ) : (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="report-category"
                    aria-label="Motivo de la denuncia"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
          </ControlledInput>

          <ControlledInput
            name="title"
            control={form.control}
            label="Título"
            placeholder="Título de la denuncia"
          />

          <ControlledInput
            name="description"
            control={form.control}
            label="Descripción"
            type="textarea"
            placeholder="Explica qué ocurrió y por qué quieres reportar este anunciante"
            rows={4}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoadingCategories}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              "Enviar denuncia"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
