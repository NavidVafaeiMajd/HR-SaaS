import z from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("لینک معتبر وارد کنید"),
]);

const optionalEmail = z.union([
  z.literal(""),
  z.string().email("ایمیل وارد شده معتبر نیست"),
]);

export const validation = z.object({
  instagram: optionalUrl,
  twitter: optionalUrl,
  linkedin: optionalUrl,
  email: optionalEmail,
});