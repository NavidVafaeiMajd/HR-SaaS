import { z } from "zod";

export const validation = z.object({
  Name: z
    .string()
    .min(2, "نام شرکت باید حداقل ۲ کاراکتر باشد")
    .max(200, "نام شرکت نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد"),

  LegalName: z
    .string()
    .max(250, "نام رسمی نمی‌تواند بیشتر از ۲۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  NationalId: z
    .string()
    .max(50, "شناسه ملی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  RegistrationNumber: z
    .string()
    .max(50, "شماره ثبت نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  EconomicCode: z
    .string()
    .max(50, "کد اقتصادی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  CompanyType: z
    .string()
    .max(100, "نوع شرکت نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  FoundedDate: z.date().nullable().optional(),

  Description: z
    .string()
    .optional()
    .or(z.literal("")),

  Phone: z
    .string()
    .max(30, "شماره تلفن نمی‌تواند بیشتر از ۳۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Mobile: z
    .string()
    .max(30, "شماره موبایل نمی‌تواند بیشتر از ۳۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Email: z
    .string()
    .email("ایمیل وارد شده معتبر نیست")
    .max(150, "ایمیل نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Website: z
    .string()
    .url("آدرس وب‌سایت معتبر نیست")
    .max(250, "آدرس وب‌سایت نمی‌تواند بیشتر از ۲۵۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Fax: z
    .string()
    .max(30, "شماره فکس نمی‌تواند بیشتر از ۳۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Country: z
    .string()
    .max(100, "نام کشور نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Province: z
    .string()
    .max(100, "نام استان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  City: z
    .string()
    .max(100, "نام شهر نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  Address: z
    .string()
    .optional()
    .or(z.literal("")),

  PostalCode: z
    .string()
    .max(20, "کدپستی نمی‌تواند بیشتر از ۲۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
});