import { z } from "zod";

export const validation = z.object({
    salaryAmount: z.string().min(1, "دستمزد ماهانه الزامی است"),

});