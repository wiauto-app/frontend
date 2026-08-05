"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/app/contexts/auth/useUser";
import { canManageTeam } from "@/app/usuario/equipo/utils/teamPermissions";
import { dealershipInvitationService } from "@/services/dealerships/dealershipInvitationService";
import {
  inviteMemberFormSchema,
  type InviteMemberFormValues,
} from "@/validations/dealership/team.schema";

export const InviteMemberPageContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading } = useUser();
  const membership = user?.dealership_membership;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!membership) {
      router.replace("/inicio");
      return;
    }

    if (!canManageTeam(membership.role)) {
      router.replace("/equipo");
    }
  }, [isUserLoading, membership, router]);

  const handleSubmit = async (values: InviteMemberFormValues) => {
    if (!membership) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dealershipInvitationService.createInvitation({
        email: values.email,
        role: values.role,
        dealership_id: membership.dealership_id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["dealership-invitations", membership.dealership_id],
      });

      toast.success("Invitación enviada correctamente");
      router.push("/equipo");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la invitación",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || !membership) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link
          href="/equipo"
          className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Volver al equipo
        </Link>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <UserPlus className="size-5 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invitar miembro</h1>
            <p className="text-sm text-gray-500">{membership.dealership_name}</p>
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
        >
          <div>
            <Label htmlFor="invite-email">Correo electrónico</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              {...form.register("email")}
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="invite-role">Rol</Label>
            <Select
              value={form.watch("role")}
              onValueChange={(value) =>
                form.setValue("role", value as InviteMemberFormValues["role"], {
                  shouldValidate: true,
                })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="member">Miembro</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando invitación..." : "Enviar invitación"}
          </Button>
        </form>
      </div>
    </div>
  );
};
