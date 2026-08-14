import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface SalaryPaymentRow {
  id: string;
  year: number;
  month: number;
  netSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  paidAt: string | null;
}

const monthLabels: Record<number, string> = {
  1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور",
  7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند",
};

const money = (value: number) => `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

export const salaryPaymentColumns: ColumnDef<SalaryPaymentRow>[] = [
  { id: "period", header: "دوره پرداخت", cell: ({ row }) => `${monthLabels[row.original.month]} ${row.original.year}` },
  { accessorKey: "netSalary", header: "خالص پرداختی", cell: ({ row }) => money(row.original.netSalary) },
  { accessorKey: "totalAllowances", header: "مزایا", cell: ({ row }) => money(row.original.totalAllowances) },
  { accessorKey: "totalDeductions", header: "کسورات", cell: ({ row }) => money(row.original.totalDeductions) },
  { accessorKey: "paidAt", header: "تاریخ پرداخت", cell: ({ row }) => row.original.paidAt ? new Date(row.original.paidAt).toLocaleDateString("fa-IR") : "—" },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => <Link to={`/payslip/${row.original.id}`}><Button variant="outline" size="sm">مشاهده فیش</Button></Link>,
  },
];
