import { z } from "zod";

  export const validation = z.object({
    date: z
      .any()
      .refine((d: unknown) => d instanceof Date && !isNaN(d.getTime()), {
        message: "تاریخ الزامی است و یا معتبر نیست",
      }),
  });

    export const createLeaveValidation = z
    .object({
      leaveTypeId: z.string().min(1, "نوع مرخصی را انتخاب کنید"),

      startDate: z.date({
        message: "تاریخ شروع را انتخاب کنید",
      }),

      endDate: z.date({
        message: "تاریخ پایان را انتخاب کنید",
      }),

      reason: z.string().min(1, "دلیل را بنویسید"),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد",
      path: ["endDate"],
    });
