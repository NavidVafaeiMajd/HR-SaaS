import { z } from "zod";

export const validation = z.object({
  marketing_staff_id: z.string().min(1, "انتخاب پرسنل بازاریابی الزامی است"),
  introduction_date: z.date(),
  method: z.string().min(1, "انتخاب روش آشنایی الزامی است"),
  location: z.string().optional(),
  status: z.string().min(1, "انتخاب وضعیت الزامی است"),
});