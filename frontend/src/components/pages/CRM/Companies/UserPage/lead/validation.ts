import { z } from "zod";

export const validation = z.object({
  priority: z.string().min(1, "انتخاب اولویت الزامی است")
});