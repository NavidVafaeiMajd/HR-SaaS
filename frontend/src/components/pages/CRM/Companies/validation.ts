import z from "zod";

export const validation = z.object({
  full_name: z
    .string()
    .min(1, "نام الزامی است")
    .describe("مثلاً: نوید"),
  company_name: z
    .string()
    .min(1, "نام شرکت الزامی است")
    .describe("مثلاً: شرکت فناوری"),

  business_manager: z
    .string()
    .optional()
    .describe("مدیر کسب و کار (اختیاری)"),

  company_address: z
    .string()
    .optional()
    .describe("آدرس شرکت (اختیاری)"),

  company_email: z
    .string()
    .email("ایمیل معتبر نیست")
    .optional()
    .describe("مثلاً: carolyne.luettgen@example.org"),

  personal_phone: z
    .string()
    .optional()
    .describe("شماره تلفن شخصی (اختیاری)"),

  company_phone: z
    .string()
    .optional()
    .describe("شماره تلفن شرکت (اختیاری)"),
});
