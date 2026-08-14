import { z } from "zod";

export const validation = z.object({
  requestedBaseSalary: z.coerce
    .number()
    .positive("حقوق پایهٔ درخواستی باید بیشتر از صفر باشد"),
  effectiveFrom: z.date({ message: "تاریخ اثر افزایش الزامی است" }),
  reason: z.string().optional(),
});
