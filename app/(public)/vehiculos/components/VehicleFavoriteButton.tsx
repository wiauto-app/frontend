"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useVehicleListMembership } from "../hooks/useVehicleListMembership";

const createListSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
});

type CreateListFormValues = z.infer<typeof createListSchema>;
  
type VehicleFavoriteButtonProps = {
  vehicleId: string;
  variant?: "ghost" | "outline";
  className?: string;
};

export const VehicleFavoriteButton = ({ vehicleId, variant = "ghost", className }: VehicleFavoriteButtonProps) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const autoAddedRef = useRef(false);

  const { 
    lists,
    membership,
    isFavorited,
    isLoading,
    toggleListMembership,
    createList,
    isCreatingList,
    pendingListIds,
    resolveDefaultList,
    addToList,
  } = useVehicleListMembership({
    vehicleId,
    enabled: open && isAuthenticated,
  });

  const form = useForm<CreateListFormValues>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && isAuthLoading) {
      return;
    }

    if (nextOpen && !isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      setShowCreateForm(false);
      form.reset();
    }
  };

  const handleSignInSuccess = () => {
    setSignInOpen(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      autoAddedRef.current = false;
      return;
    }

    if (isLoading || autoAddedRef.current) {
      return;
    }

    const defaultList = resolveDefaultList();
    if (!defaultList || membership.has(defaultList.id)) {
      return;
    }

    autoAddedRef.current = true;

    void addToList(defaultList.id)
      .then(() => {
        toast.success("Guardado en Favoritos");
      })
      .catch(() => {
        toast.error("No se pudo guardar en Favoritos");
      });
  }, [open, isLoading, membership, resolveDefaultList, addToList]);

  const handleToggleList = async (listId: string, checked: boolean) => {
    try {
      await toggleListMembership(listId, checked);
    } catch {
      toast.error("No se pudo actualizar la lista");
    }
  };

  const handleCreateList = form.handleSubmit(async (values) => {
    try {
      await createList({
        name: values.name.trim(),
        description: values.description,
      });
      toast.success("Lista creada y vehículo agregado");
      form.reset();
      setShowCreateForm(false);
    } catch {
      toast.error("No se pudo crear la lista");
    }
  });

  return (
    <>
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        aria-expanded={open}
        aria-label="Guardar en listas"
        disabled={isAuthLoading}
        className={cn(
          "rounded-full p-2 transition-colors hover:bg-muted",
          variant === "outline" && "border-2 border-muted-foreground/50 rounded-md",
          isFavorited ? "text-red-500" : "text-muted-foreground hover:text-foreground",
          className,
        )}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Heart
          className={cn("size-4", isFavorited && "fill-current")}
          aria-hidden
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <PopoverHeader>
          <PopoverTitle>Guardar en listas</PopoverTitle>
        </PopoverHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span className="sr-only">Cargando listas</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {lists.map((list) => {
                const isChecked = membership.has(list.id);
                const isPending = pendingListIds.has(list.id);

                return (
                  <li key={list.id}>
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={isChecked}
                        disabled={isPending}
                        onCheckedChange={(checked) => {
                          void handleToggleList(list.id, checked === true);
                        }}
                        aria-label={`${isChecked ? "Quitar de" : "Agregar a"} ${list.name}`}
                      />
                      <FieldContent>
                        <FieldLabel className="font-normal">{list.name}</FieldLabel>
                      </FieldContent>
                      {isPending && (
                        <Loader2
                          className="size-4 shrink-0 animate-spin text-muted-foreground"
                          aria-hidden
                        />
                      )}
                    </Field>
                  </li>
                );
              })}
            </ul>

            {showCreateForm ? (
              <form onSubmit={handleCreateList} className="space-y-3 border-t pt-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`list-name-${vehicleId}`}>Nombre</FieldLabel>
                    <Input
                      id={`list-name-${vehicleId}`}
                      placeholder="Mi lista"
                      {...form.register("name")}
                      aria-invalid={!!form.formState.errors.name}
                    />
                    <FieldError errors={[form.formState.errors.name]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`list-description-${vehicleId}`}>
                      Descripción (opcional)
                    </FieldLabel>
                    <Textarea
                      id={`list-description-${vehicleId}`}
                      rows={2}
                      placeholder="Describe tu lista"
                      {...form.register("description")}
                    />
                  </Field>
                </FieldGroup>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setShowCreateForm(false);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="flex-1"
                    disabled={isCreatingList}
                  >
                    {isCreatingList ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="size-4" aria-hidden />
                Crear lista
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>

    <SignInDialog
      open={signInOpen}
      onOpenChange={setSignInOpen}
      returnTo={pathname}
      onSuccess={handleSignInSuccess}
    />
    </>
  );
};
