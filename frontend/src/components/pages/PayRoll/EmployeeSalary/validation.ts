import { z } from "zod";

export const validation = z.object({
  userId: z
    .string()
    .min(1, "انتخاب کارمند الزامی است"),

  baseSalary: z
    .number()
    .min(0, "حقوق پایه نمی‌تواند منفی باشد"),

  housingAllowance: z
    .number()
    .min(0, "حق مسکن نمی‌تواند منفی باشد"),

  foodAllowance: z
    .number()
    .min(0, "حق غذا نمی‌تواند منفی باشد"),

  transportationAllowance: z
    .number()
    .min(0, "حق ایاب و ذهاب نمی‌تواند منفی باشد"),

  childAllowance: z
    .number()
    .min(0, "حق اولاد نمی‌تواند منفی باشد"),

  seniorityAllowance: z
    .number()
    .min(0, "سنوات نمی‌تواند منفی باشد"),

  latePerHour: z
    .number()
    .min(0, "کسری تأخیر نمی‌تواند منفی باشد"),

  leavePerDay: z
    .number()
    .min(0, "کسری مرخصی نمی‌تواند منفی باشد"),

  absentPerDay: z
    .number()
    .min(0, "کسری غیبت نمی‌تواند منفی باشد"),

  overtimePerHour: z
    .number()
    .min(0, "مبلغ اضافه‌کاری نمی‌تواند منفی باشد"),

  tax: z
    .number()
    .min(0, "مالیات نمی‌تواند منفی باشد"),

  insurance: z
    .number()
    .min(0, "بیمه نمی‌تواند منفی باشد"),

  bankName: z
    .string()
    .max(100, "نام بانک نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

  accountHolderName: z
    .string()
    .max(150, "نام صاحب حساب نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد"),

  accountNumber: z
    .string()
    .max(30, "شماره حساب نامعتبر است"),

  cardNumber: z
    .string()
    .max(20, "شماره کارت نامعتبر است"),

  shebaNumber: z
    .string()
    .max(30, "شماره شبا نامعتبر است"),

  effectiveFrom: z
    .date({
      message: "تاریخ شروع حقوق الزامی است",
    }),
});

export type EmployeeSalaryFormType = z.infer<typeof validation>;