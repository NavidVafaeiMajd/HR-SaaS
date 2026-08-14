import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import ActionsCell from "@/components/shared/ActionsCell";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { z } from "zod";

export interface PayRollPaymentListColumnProps extends Record<string, unknown> {
  id: string;

  userId: string;

  firstName: string;
  lastName: string;

  personnelCode: string | null;

  year: number;
  month: number;

  baseSalary: number;

  totalAllowances: number;

  overtimeAmount: number;

  lateDeduction: number;
  leaveDeduction: number;
  absentDeduction: number;

  tax: number;
  insurance: number;

  totalDeductions: number;

  netSalary: number;

  status: "Pending" | "Paid" | "Canceled";
}

export const paymentStatusLabels: Record<
  PayRollPaymentListColumnProps["status"],
  string
> = {
  Pending: "در انتظار پرداخت",
  Paid: "پرداخت شده",
  Canceled: "لغو شده",
};

/* =========================================================
   HELPERS
========================================================= */

export const monthLabels: Record<number, string> = {
  1: "فروردین",
  2: "اردیبهشت",
  3: "خرداد",
  4: "تیر",
  5: "مرداد",
  6: "شهریور",
  7: "مهر",
  8: "آبان",
  9: "آذر",
  10: "دی",
  11: "بهمن",
  12: "اسفند",
};

export const formatMinutes = (minutes: number | null | undefined) => {
  if (minutes === null || minutes === undefined) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} دقیقه`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};

export const formatPrice = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("fa-IR").format(value);
};

export const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("fa-IR");
};

/* =========================================================
   ACTIONS
========================================================= */

const PayRollPaymentActions = ({
  row,
}: {
  row: PayRollPaymentListColumnProps;
}) => {
  const { mutation } = useUpdateRows(
    `payroll-payment/${row.id}/status`,
    ["payroll-payment"],
    z.object({
      status: z.enum(["Pending", "Paid", "Canceled"]),
    }),
    "وضعیت پرداخت",
  );

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        btnTitle="تغییر وضعیت"
        title="تغییر وضعیت پرداخت"
        triggerLabel="تغییر وضعیت"
        variant="outline"
        fields={
          <Form.Select
            name="status"
            label="وضعیت پرداخت"
            required
            options={[
              {
                value: "Pending",
                label: "در انتظار پرداخت",
              },
              {
                value: "Paid",
                label: "پرداخت شده",
              },
              {
                value: "Canceled",
                label: "لغو شده",
              },
            ]}
            placeholder="انتخاب وضعیت"
          />
        }
        defaultValues={{
          status: row.status,
        }}
        onSave={(data) => {
          mutation.mutate(data);
        }}
        schema={z.object({
          status: z.enum(["Pending", "Paid", "Canceled"]),
        })}
      />
    </div>
  );
};

/* =========================================================
   COLUMNS
========================================================= */

export const columns: ColumnDef<PayRollPaymentListColumnProps>[] = [
  /* -------------------------------------------------------
     Employee
  ------------------------------------------------------- */

  {
    accessorKey: "firstName",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        کارمند
      </Button>
    ),

    cell: ({ row }) => {
      const { firstName, lastName } = row.original;

      return `${firstName} ${lastName}`;
    },
  },

  /* -------------------------------------------------------
     Personnel Code
  ------------------------------------------------------- */

  {
    accessorKey: "personnelCode",

    header: "کد پرسنلی",

    cell: ({ row }) => {
      return row.original.personnelCode ?? "—";
    },
  },

  /* -------------------------------------------------------
     Salary Month
  ------------------------------------------------------- */

  {
    accessorKey: "month",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        ماه حقوق
      </Button>
    ),

    cell: ({ row }) => {
      const { year, month } = row.original;

      return `${monthLabels[month]} ${year}`;
    },
  },

  /* -------------------------------------------------------
     Base Salary
  ------------------------------------------------------- */

  {
    accessorKey: "baseSalary",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        حقوق پایه
      </Button>
    ),

    cell: ({ row }) => {
      return `${formatPrice(row.original.baseSalary)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Allowances
  ------------------------------------------------------- */

  {
    accessorKey: "totalAllowances",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        مجموع مزایا
      </Button>
    ),

    cell: ({ row }) => {
      return `${formatPrice(row.original.totalAllowances)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Overtime
  ------------------------------------------------------- */

  {
    accessorKey: "overtimeAmount",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        اضافه‌کاری
      </Button>
    ),

    cell: ({ row }) => {
      return `${formatPrice(row.original.overtimeAmount)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Late Deduction
  ------------------------------------------------------- */

  {
    accessorKey: "lateDeduction",

    header: "کسری تأخیر",

    cell: ({ row }) => {
      return `${formatPrice(row.original.lateDeduction)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Leave Deduction
  ------------------------------------------------------- */

  {
    accessorKey: "leaveDeduction",

    header: "کسری مرخصی",

    cell: ({ row }) => {
      return `${formatPrice(row.original.leaveDeduction)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Absent Deduction
  ------------------------------------------------------- */

  {
    accessorKey: "absentDeduction",

    header: "کسری غیبت",

    cell: ({ row }) => {
      return `${formatPrice(row.original.absentDeduction)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Tax
  ------------------------------------------------------- */

  {
    accessorKey: "tax",

    header: "مالیات",

    cell: ({ row }) => {
      return `${formatPrice(row.original.tax)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Insurance
  ------------------------------------------------------- */

  {
    accessorKey: "insurance",

    header: "بیمه",

    cell: ({ row }) => {
      return `${formatPrice(row.original.insurance)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Total Deductions
  ------------------------------------------------------- */

  {
    accessorKey: "totalDeductions",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        مجموع کسورات
      </Button>
    ),

    cell: ({ row }) => {
      return `${formatPrice(row.original.totalDeductions)} تومان`;
    },
  },

  /* -------------------------------------------------------
     Gross Salary
  ------------------------------------------------------- */

  {
    accessorKey: "status",

    header: "وضعیت پرداخت ",

    cell: ({ row }) => {
      return `${paymentStatusLabels[row.original.status]}`;
    },
  },

  /* -------------------------------------------------------
     Net Salary
  ------------------------------------------------------- */

  {
    accessorKey: "netSalary",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        خالص پرداختی
      </Button>
    ),

    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {formatPrice(row.original.netSalary)} تومان
        </span>
      );
    },
  },

  /* -------------------------------------------------------
     Paid At
  ------------------------------------------------------- */

  {
    accessorKey: "paidAt",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        تاریخ پرداخت
      </Button>
    ),

    cell: ({ row }) => {
      return formatDate(row.original.paidAt);
    },
  },

  /* -------------------------------------------------------
     Actions
  ------------------------------------------------------- */

  {
    id: "actions",

    header: "عملیات",

    cell: ({ row }) => {
      return <PayRollPaymentActions row={row.original} />;
    },
  },
];
