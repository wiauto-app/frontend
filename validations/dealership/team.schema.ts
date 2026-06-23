import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  role: z.enum(["admin", "member"], {
    message: "Selecciona un rol válido",
  }),
  dealership_id: z.string().uuid("Concesionario no válido"),
});

export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export type UpdateMemberRoleDto = z.infer<typeof updateMemberRoleSchema>;

export const inviteMemberFormSchema = createInvitationSchema.pick({
  email: true,
  role: true,
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;
