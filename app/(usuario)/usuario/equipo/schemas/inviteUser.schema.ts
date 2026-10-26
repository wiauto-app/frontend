import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;