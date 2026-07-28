import z from "zod";
import { imageSchema } from "@/components/shared/validation";

export const validation = z.object({
  firstName: z
    .string()
    .min(1, "نام الزامی است")
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .describe("مثلاً: نوید"),

  lastName: z
    .string()
    .min(1, "نام خانوادگی الزامی است")
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است")
    .describe("مثلاً: محمدی"),

  PersonnelCode: z
    .string()
    .regex(/^\d+$/, "فقط عدد مجاز است")
    .min(1, "کد پرسنلی الزامی است")
    .describe("مثلاً: 12345"),

  phoneNumber: z
    .string()
    .regex(/^09\d{9}$/, "شماره تماس معتبر نیست")
    .describe("مثلاً: 09121234567"),

  gender: z.string().refine((val) => val !== "", {
    message: "لطفاً یک گزینه انتخاب کنید",
  }),

  shiftId: z.string().refine((val) => val !== "", {
    message: "لطفاً یک گزینه انتخاب کنید",
  }),

  departmentId: z.coerce.number().min(1, "واحد سازمانی الزامی است"),

  positionId: z.coerce.number().min(1, "سمت سازمانی الزامی است"),

  isActive: z.boolean().default(true),

  image: imageSchema,
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
  dashboardType: z.string().refine((val) => val !== "", {
    message: "لطفاً یک گزینه انتخاب کنید",
  }),
  role: z.string().refine((val) => val !== "", {
    message: "لطفاً یک گزینه انتخاب کنید",
  }),
});
