import { z } from "zod";

export const validation = z.object({
  logo: z
    .instanceof(File, {
      message: "لطفاً لوگوی شرکت را انتخاب کنید",
    })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "حجم تصویر نباید بیشتر از ۲ مگابایت باشد",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "فرمت تصویر باید JPG، PNG یا WEBP باشد",
    ),
});