import { z } from "zod";

export const validation = z.object({
  name: z.string().min(1, "نام فعالیت الزامی است"),
  marketing_staff_id: z.string().min(1, "انتخاب پرسنل بازاریابی الزامی است"),
  activity_date: z.date(),
  type: z.string().min(1, "نوع فعالیت الزامی است"),
  note: z.string().optional(),
});
