import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteUserSchema, inviteUserSchema } from "../schemas/inviteUser.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ControllerInput } from "@/components/ui/controllerInput";
import { InvitationRoleSelector } from "./invitationRoleSelector";
import { dealershipInvitationService } from "@/services/dealerships/dealershipInvitationService";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const InviteUserDialog = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<InviteUserSchema>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async(data: InviteUserSchema) => {
    const response = await dealershipInvitationService.createInvitation(data);
    if(!response.ok) {
      toast.error(response.message || "No se pudo enviar la invitación");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["dealership-members"] });
    queryClient.invalidateQueries({ queryKey: ["dealership-invitations"] });
    toast.success("Invitación enviada correctamente");
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Invitar miembro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar miembro</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ControllerInput control={form.control} name="email" label="Email" />
          <ControllerInput control={form.control} name="role" label="Rol">
            {({ field }) => (
              <InvitationRoleSelector
                onValueChange={field.onChange}
                value={field.value}
              />
            )}  
          </ControllerInput>

          <Button type="submit" className="w-full" disabled={isLoading}>
            Invitar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
