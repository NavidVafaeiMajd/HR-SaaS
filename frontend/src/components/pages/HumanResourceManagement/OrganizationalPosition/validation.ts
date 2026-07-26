import z from "zod";

export const validation = z.object({
   departmentId: z.string().min(1,"واحد سازمانی را انتخاب کنید"),
   title: z.string().min(1,"نام سمت سازمانی را وارد کنید"),
   description: z.string().optional(),
});
