import z, { boolean } from "zod";
import { imageSchema } from "@/components/shared/validation";

export const validation = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255),
  Users_view: z.boolean(),
  Users_post: z.boolean(),
  Users_edit: z.boolean(),
  Users_delete: z.boolean(),
  Hr_view:  z.boolean(),
  Hr_post:  z.boolean(),
  Hr_edit:  z.boolean(),
  Hr_delete:  z.boolean(),

  Role_view:  z.boolean(),
  Role_post:  z.boolean(),
  Role_edit:  z.boolean(),
  Role_delete:  z.boolean()
});
