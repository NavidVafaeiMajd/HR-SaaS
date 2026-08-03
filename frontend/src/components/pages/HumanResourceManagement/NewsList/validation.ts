import { z } from "zod";

export const validation = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است"),

  content: z
    .string()
    .min(1, "متن ابلاغیه الزامی است"),

  summary: z
    .string()
    .min(1, "اختصاری الزامی است"),

  publish_date: z.date().nullable(),

  end_date: z.date().nullable(),

  departmentIds: z
    .array(z.string())
    .min(1, "حداقل یک واحد سازمانی انتخاب کنید"),

  positionIds: z
    .array(z.string()),

  userIds: z
    .array(z.string()),
});


export type NewsFormType = z.infer<typeof validation>;