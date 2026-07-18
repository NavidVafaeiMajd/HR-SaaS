import { z } from "zod";

export const validation = z.object({
  stage: z.string().min(1, "انتخاب کاریز الزامی است"),
  new_stage: z.string().min(1, "انتخاب کاریز جدید الزامی است"),
  changed_at: z.date().min(1, "تاریخ تغییر الزامی است"),
  note: z.string().optional(),
});