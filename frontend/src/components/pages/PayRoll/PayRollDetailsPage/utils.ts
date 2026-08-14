export const monthLabels: Record<number, string> = {
  1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور",
  7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند",
};

export const money = (value: number) =>
  `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

export const number = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
