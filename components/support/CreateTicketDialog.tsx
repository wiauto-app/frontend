"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FileInput } from "@/components/ui/fileInput";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ticketsService } from "@/services/tickets/ticketsService";

const createTicketSchema = z.object({
  category_id: z.string().uuid("Selecciona una categoría"),
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  file_url: z.string().optional().nullable(),
});

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTicketDialog = ({
  open,
  onOpenChange,
}: CreateTicketDialogProps) => {
  const router = useRouter();
  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      category_id: "",
      title: "",
      description: "",
      file_url: null,
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["ticket-categories"],
    queryFn: () => ticketsService.findCategories(),
    enabled: open,
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const response = await ticketsService.create({
      category_id: values.category_id,
      title: values.title.trim(),
      description: values.description.trim(),
      file_url: values.file_url,
    });

    if (!response.ok) {
      toast.error(response.message || "No se pudo crear el ticket");
      return;
    }

    toast.success("Ticket enviado correctamente");
    onOpenChange(false);

    if (response.data.chat_id) {
      router.push(`/usuario/mensajes?chat_id=${response.data.chat_id}`);
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar un ticket</DialogTitle>
          <DialogDescription>
            Cuéntanos tu consulta y el equipo de soporte te responderá por el
            chat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ticket-category">Categoría</FieldLabel>
              <Controller
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={isLoadingCategories || isSubmitting}
                    items={categories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                  >
                    <SelectTrigger
                      id="ticket-category"
                      aria-label="Categoría del ticket"
                      aria-invalid={!!form.formState.errors.category_id}
                    >
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[form.formState.errors.category_id]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="ticket-title">Título</FieldLabel>
              <Input
                id="ticket-title"
                placeholder="Resumen de tu consulta"
                {...form.register("title")}
                aria-invalid={!!form.formState.errors.title}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="ticket-description">Descripción</FieldLabel>
              <Textarea
                id="ticket-description"
                rows={5}
                placeholder="Describe el problema o la duda con el mayor detalle posible"
                {...form.register("description")}
                aria-invalid={!!form.formState.errors.description}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>

            <Field>
              <Controller
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FileInput
                    label="Adjunto (opcional)"
                    description="Imagen o documento de apoyo"
                    bucketName="files"
                    path="tickets"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Enviar ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
