import type { ColumnDef } from "@tanstack/react-table";

export interface SalaryHistoryRow extends Record<string, unknown> {
  id: string;
  baseSalary: number;
  housingAllowance: number;
  foodAllowance: number;
  transportationAllowance: number;
  childAllowance: number;
  seniorityAllowance: number;
  latePerHour: number;
  leavePerDay: number;
  absentPerDay: number;
  overtimePerHour: number;
  tax: number;
  insurance: number;
  effectiveYear: number;
  effectiveMonth: number;
  changeReason: string | null;
  createdAt: string;
  recordType: "Current" | "History";
}

const monthLabels: Record<number, string> = {
  1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور",
  7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند",
};

const money = (value: number) => `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

export const salaryHistoryColumns: ColumnDef<SalaryHistoryRow>[] = [
  {
    accessorKey: "recordType",
    header: "نوع حکم",
    cell: ({ row }) => row.original.recordType === "Current" ? "آخرین حکم ثبت‌شده" : "تاریخچه تغییر",
  },
  { id: "effectiveDate", header: "تاریخ اثر", cell: ({ row }) => `${monthLabels[row.original.effectiveMonth]} ${row.original.effectiveYear}` },
  { accessorKey: "baseSalary", header: "حقوق پایه", cell: ({ row }) => money(row.original.baseSalary) },
  { accessorKey: "housingAllowance", header: "مسکن", cell: ({ row }) => money(row.original.housingAllowance) },
  { accessorKey: "foodAllowance", header: "غذا", cell: ({ row }) => money(row.original.foodAllowance) },
  { accessorKey: "transportationAllowance", header: "ایاب‌وذهاب", cell: ({ row }) => money(row.original.transportationAllowance) },
  { accessorKey: "childAllowance", header: "حق اولاد", cell: ({ row }) => money(row.original.childAllowance) },
  { accessorKey: "seniorityAllowance", header: "سنوات", cell: ({ row }) => money(row.original.seniorityAllowance) },
  { accessorKey: "overtimePerHour", header: "اضافه‌کاری ساعتی", cell: ({ row }) => money(row.original.overtimePerHour) },
  { accessorKey: "latePerHour", header: "کسری تأخیر ساعتی", cell: ({ row }) => money(row.original.latePerHour) },
  { accessorKey: "leavePerDay", header: "کسری مرخصی روزانه", cell: ({ row }) => money(row.original.leavePerDay) },
  { accessorKey: "absentPerDay", header: "کسری غیبت روزانه", cell: ({ row }) => money(row.original.absentPerDay) },
  { accessorKey: "tax", header: "مالیات", cell: ({ row }) => money(row.original.tax) },
  { accessorKey: "insurance", header: "بیمه", cell: ({ row }) => money(row.original.insurance) },
  { accessorKey: "changeReason", header: "علت تغییر", cell: ({ row }) => row.original.changeReason || "—" },
  { accessorKey: "createdAt", header: "تاریخ ثبت", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("fa-IR") },
];
