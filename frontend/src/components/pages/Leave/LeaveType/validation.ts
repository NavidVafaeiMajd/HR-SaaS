import { z } from "zod";

export const validation = z.object({
  Name: z
    .string({
      error: "نوع مرخصی الزامی است",
    })
    .min(1, "نوع مرخصی الزامی است")
    .max(100, "نوع مرخصی نمی‌تواند بیشتر از 100 کاراکتر باشد"),

AnnualLimit: z.preprocess(
  (value) => {
    if (typeof value === "string") {
      return Number(
        value.replace(/[۰-۹]/g, (d) =>
          String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        )
      );
    }

    return value;
  },
  z.number({
    error: "تعداد روزها باید عدد باشد",
  })
  .int("تعداد روزها باید عدد صحیح باشد")
  .min(1, "تعداد روزها باید حداقل 1 روز باشد")
  .max(365, "تعداد روزها نمی‌تواند بیشتر از 365 روز باشد")
),
  Description: z
    .string({
      error: "توضیحات الزامی است",
    })
    .min(1, "توضیحات الزامی است")
      .max(500, "توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد"),
    IsActive: z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return value;
  },
  z.boolean({
    error: "وضعیت الزامی است",
  })
   ),

       IsPaid: z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    return value;
  },
  z.boolean({
    error: "وضعیت الزامی است",
  })
)
});
