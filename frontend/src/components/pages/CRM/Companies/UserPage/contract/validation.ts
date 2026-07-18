import { z } from "zod";

export const validation = z.object({
  contract_date: z.date().min(1, "تاریخ قرارداد الزامی است"),
  amount: z.string().min(0, "مبلغ باید مثبت باشد"),
  delivery_date: z.date().min(1, "تاریخ تحویل الزامی است"),
});