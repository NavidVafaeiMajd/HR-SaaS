import { z } from "zod";

export const validation = z.object({
  name: z.string().min(1, "نام شیفت الزامی است"),
  saturday_start: z.string().optional(),
  saturday_end: z.string().optional(),
  sunday_start: z.string().optional(),
  sunday_end: z.string().optional(),
  monday_start: z.string().optional(),
  monday_end: z.string().optional(),
  tuesday_start: z.string().optional(),
  tuesday_end: z.string().optional(),
  wednesday_start: z.string().optional(),
  wednesday_end: z.string().optional(),
  thursday_start: z.string().optional(),
  thursday_end: z.string().optional(),
  friday_start: z.string().optional(),
  friday_end: z.string().optional(),
});
