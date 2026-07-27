import z from "zod";

const shiftTimeSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),

    startTime: z.string(),

    endTime: z.string(),
  })
  .refine(
    (data) => {
      // اگر هر دو خالی باشند، یعنی آن روز تعطیل است
      if (!data.startTime && !data.endTime) {
        return true;
      }

      // اگر یکی پر و دیگری خالی باشد، خطا
      return !!data.startTime && !!data.endTime;
    },
    {
      message: "ساعت شروع و پایان باید هر دو وارد شوند.",
      path: ["endTime"],
    }
  );

export const validation = z.object({
  name: z
    .string()
    .min(2, "نام شیفت الزامی است.")
    .max(100),

  shiftTimes: z
    .array(shiftTimeSchema)
    .length(7),
});