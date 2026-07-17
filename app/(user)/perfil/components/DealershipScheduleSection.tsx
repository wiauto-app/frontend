"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DEALERSHIP_WEEK_DAYS } from "@/services/dealerships/constants/dealership-week-days";
import { dealershipService } from "@/services/dealerships/dealershipService";
import type { DealershipScheduleDay } from "@/services/dealerships/types/dealership.types";
import {
  DEFAULT_OPEN_SLOT,
  dealershipScheduleFormSchema,
  mapScheduleFormToPayload,
  mapSchedulesToFormValues,
  type DealershipScheduleFormValues,
} from "../schemas/dealership-schedule.schema";

interface DealershipScheduleSectionProps {
  dealershipId: string;
  schedules?: DealershipScheduleDay[];
  canEdit: boolean;
}

interface DayRowProps {
  dayIndex: number;
  dayName: string;
  canEdit: boolean;
  control: ReturnType<
    typeof useForm<DealershipScheduleFormValues>
  >["control"];
  setValue: ReturnType<
    typeof useForm<DealershipScheduleFormValues>
  >["setValue"];
  watch: ReturnType<typeof useForm<DealershipScheduleFormValues>>["watch"];
}

const DayScheduleRow = ({
  dayIndex,
  dayName,
  canEdit,
  control,
  setValue,
  watch,
}: DayRowProps) => {
  const isOpen = watch(`days.${dayIndex}.is_open`);
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.open_times`,
  });

  const handleToggleOpen = (nextOpen: boolean) => {
    setValue(`days.${dayIndex}.is_open`, nextOpen, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextOpen && fields.length === 0) {
      append({ ...DEFAULT_OPEN_SLOT });
      return;
    }

    if (!nextOpen) {
      setValue(`days.${dayIndex}.open_times`, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleAddSlot = () => {
    append({ ...DEFAULT_OPEN_SLOT });
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-900">{dayName}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {isOpen ? "Abierto" : "Cerrado"}
          </span>
          <Controller
            name={`days.${dayIndex}.is_open`}
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={handleToggleOpen}
                disabled={!canEdit}
                aria-label={`${dayName}: ${field.value ? "abierto" : "cerrado"}`}
              />
            )}
          />
        </div>
      </div>

      {isOpen ? (
        <div className="mt-3 space-y-3">
          {fields.map((field, slotIndex) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <Controller
                name={`days.${dayIndex}.open_times.${slotIndex}.open_time`}
                control={control}
                render={({ field: timeField, fieldState }) => (
                  <Field
                    className="flex-1"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel
                      htmlFor={`schedule-${dayIndex}-open-${slotIndex}`}
                    >
                      Apertura
                    </FieldLabel>
                    <Input
                      id={`schedule-${dayIndex}-open-${slotIndex}`}
                      type="time"
                      disabled={!canEdit}
                      aria-invalid={fieldState.invalid}
                      {...timeField}
                    />
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name={`days.${dayIndex}.open_times.${slotIndex}.close_time`}
                control={control}
                render={({ field: timeField, fieldState }) => (
                  <Field
                    className="flex-1"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel
                      htmlFor={`schedule-${dayIndex}-close-${slotIndex}`}
                    >
                      Cierre
                    </FieldLabel>
                    <Input
                      id={`schedule-${dayIndex}-close-${slotIndex}`}
                      type="time"
                      disabled={!canEdit}
                      aria-invalid={fieldState.invalid}
                      {...timeField}
                    />
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              {canEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => remove(slotIndex)}
                  disabled={fields.length <= 1}
                  aria-label={`Eliminar tramo ${slotIndex + 1} de ${dayName}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              ) : null}
            </div>
          ))}

          <Controller
            name={`days.${dayIndex}.open_times`}
            control={control}
            render={({ fieldState }) =>
              fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : null
            }
          />

          {canEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-blue-700"
              onClick={handleAddSlot}
              aria-label={`Añadir tramo a ${dayName}`}
            >
              <Plus className="size-4" aria-hidden />
              Añadir tramo
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export const DealershipScheduleSection = ({
  dealershipId,
  schedules,
  canEdit,
}: DealershipScheduleSectionProps) => {
  const queryClient = useQueryClient();

  const form = useForm<DealershipScheduleFormValues>({
    resolver: zodResolver(dealershipScheduleFormSchema),
    defaultValues: mapSchedulesToFormValues(schedules),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, isDirty },
  } = form;

  useEffect(() => {
    reset(mapSchedulesToFormValues(schedules));
  }, [schedules, reset]);

  const onSubmit = async (values: DealershipScheduleFormValues) => {
    if (!canEdit) {
      return;
    }

    const response = await dealershipService.updateSchedules(
      dealershipId,
      mapScheduleFormToPayload(values),
    );

    if (!response.ok) {
      toast.error(
        response.message || "No se pudieron guardar los horarios",
      );
      return;
    }

    toast.success("Horarios guardados");
    await queryClient.invalidateQueries({
      queryKey: ["dealership-profile", dealershipId],
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <Clock className="size-5" aria-hidden />
          </div>
          <div>
            <CardTitle>Horario de atención</CardTitle>
            <CardDescription>
              {canEdit
                ? "Define los días y tramos en los que atiendes al público. Puedes añadir varios tramos por día."
                : "Solo los administradores pueden editar el horario. Aquí puedes consultarlo."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-3">
          {DEALERSHIP_WEEK_DAYS.map((weekDay, dayIndex) => (
            <DayScheduleRow
              key={weekDay.id}
              dayIndex={dayIndex}
              dayName={weekDay.name}
              canEdit={canEdit}
              control={control}
              setValue={setValue}
              watch={watch}
            />
          ))}
        </CardContent>

        {canEdit ? (
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Guardando...
                </>
              ) : (
                "Guardar horarios"
              )}
            </Button>
          </CardFooter>
        ) : null}
      </form>
    </Card>
  );
};
