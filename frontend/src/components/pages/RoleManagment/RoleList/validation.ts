import { z } from "zod";
import { permission } from "../utils/utils";

const permissionValidation = permission.reduce(
  (acc, group) => {
    group.itemPermission.forEach((item) => {
      acc[item] = z.boolean();
    });

    return acc;
  },
  {} as Record<string, z.ZodBoolean>
);


export const validation = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255),

  ...permissionValidation,
});