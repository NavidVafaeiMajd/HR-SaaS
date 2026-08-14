import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { Form } from "@/components/shared/Form";
import { EditDialog } from "@/components/shared/EditDialog";
import { z } from "zod";
import { usePostRows } from "@/hook/usePostRows";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface PayRollPeriodListColumnProps extends Record<string, unknown> {
  userId: string;

  firstName: string;
  lastName: string;

  personnelCode: string | null;

  year: number;
  month: number;

  baseSalary: number;

  housingAllowance: number;
  foodAllowance: number;
  transportationAllowance: number;
  childAllowance: number;
  seniorityAllowance: number;

  totalAllowances: number;

  overtimeAmount: number;

  lateDeduction: number;
  leaveDeduction: number;
  absentDeduction: number;

  tax: number;
  insurance: number;

  totalDeductions: number;

  netSalary: number;

  salaryEffectiveYear: number;
  salaryEffectiveMonth: number;

  status: "Unknown";
}

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

export const formatMinutes = (minutes: number | null) => {
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

/* =========================================================
   ACTIONS
========================================================= */

const PayRollPeriodActions = ({
  row,
}: {
  row: PayRollPeriodListColumnProps;
}) => {
  const { mutation } = usePostRows(
    "payroll-payment",
    ["payroll-period", "payroll-payment"],
    {},
    z.object({}),
    "پرداخت حقوق",
    true,
  );
  const schema = z.object({
    absentDeduction: z.coerce.number().min(0, "مبلغ نمی‌تواند منفی باشد"),

    lateDeduction: z.coerce.number().min(0, "مبلغ نمی‌تواند منفی باشد"),
  });

  type PaymentForm = z.infer<typeof schema>;

  const form = useForm<PaymentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      absentDeduction: row.absentDeduction,
      lateDeduction: row.lateDeduction,
    },
  });

  const lateDeduction = Number(form.watch("lateDeduction") || 0);

  const absentDeduction = Number(form.watch("absentDeduction") || 0);

  const lateDifference = lateDeduction - Number(row.lateDeduction || 0);

  const absentDifference = absentDeduction - Number(row.absentDeduction || 0);

  const totalDeductions =
    row.totalDeductions + lateDifference + absentDifference;

  const netSalary = row.netSalary - lateDifference - absentDifference;

  const handlePayment = (data: PaymentForm) => {
    mutation.mutate({
      userId: row.userId,
      year: row.year,
      month: row.month,

      baseSalary: row.baseSalary,

      housingAllowance: row.housingAllowance,
      foodAllowance: row.foodAllowance,
      transportationAllowance: row.transportationAllowance,
      childAllowance: row.childAllowance,
      seniorityAllowance: row.seniorityAllowance,

      totalAllowances: row.totalAllowances,

      overtimeAmount: row.overtimeAmount,

      lateDeduction: Number(data.lateDeduction),
      absentDeduction: Number(data.absentDeduction),

      leaveDeduction: row.leaveDeduction,
      tax: row.tax,
      insurance: row.insurance,

      totalDeductions,

      grossSalary: row.baseSalary + row.totalAllowances + row.overtimeAmount,

      netSalary,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        btnTitle="پرداخت حقوق"
        title="تأیید پرداخت حقوق"
        form={form}
        triggerLabel="پرداخت حقوق"
        variant="outline"
        fields={
          <div className="space-y-5">
            {/* اطلاعات کارمند */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">کارمند</span>

                <p className="font-medium">
                  {row.firstName} {row.lastName}
                </p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">کد پرسنلی</span>

                <p className="font-medium">{row.personnelCode ?? "—"}</p>
              </div>
            </div>

            {/* حقوق */}

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span>حقوق پایه</span>

                <span>{formatPrice(row.baseSalary)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span>مجموع مزایا</span>

                <span>{formatPrice(row.totalAllowances)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span>اضافه‌کاری</span>

                <span>{formatPrice(row.overtimeAmount)} تومان</span>
              </div>
            </div>

            {/* کسورات قابل اصلاح */}

            <div>
              <h3 className="font-semibold mb-4">کسورات قابل اصلاح</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.PriceInput
                  name="absentDeduction"
                  label="کسری کل غیبت"
                  placeholder="مبلغ کسری غیبت"
                />

                <Form.PriceInput
                  name="lateDeduction"
                  label="کسری کل تأخیر"
                  placeholder="مبلغ کسری تأخیر"
                />
              </div>
            </div>

            {/* سایر کسورات */}

            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">سایر کسورات</h3>

              <div className="flex justify-between">
                <span>کسری مرخصی</span>

                <span>{formatPrice(row.leaveDeduction)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span>مالیات</span>

                <span>{formatPrice(row.tax)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span>بیمه</span>

                <span>{formatPrice(row.insurance)} تومان</span>
              </div>
            </div>

            {/* خالص */}

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">خالص پرداختی</span>

                <span className="text-xl font-bold">
                  {formatPrice(netSalary)} تومان
                </span>
              </div>
            </div>
          </div>
        }
        defaultValues={{
          absentDeduction: row.absentDeduction,
          lateDeduction: row.lateDeduction,
        }}
        onSave={(data) => {
          handlePayment({
            absentDeduction: Number(data.absentDeduction),
            lateDeduction: Number(data.lateDeduction),
          });
        }}
        schema={z.object({
          absentDeduction: z.coerce.number().min(0, "مبلغ نمی‌تواند منفی باشد"),

          lateDeduction: z.coerce.number().min(0, "مبلغ نمی‌تواند منفی باشد"),
        })}
      />
    </div>
  );
};

/* =========================================================
   COLUMNS
========================================================= */

export const columns: ColumnDef<PayRollPeriodListColumnProps>[] = [
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

  {
    accessorKey: "personnelCode",

    header: "کد پرسنلی",

    cell: ({ row }) => {
      return row.original.personnelCode ?? "—";
    },
  },

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

  {
    accessorKey: "lateDeduction",

    header: "کسری تأخیر",

    cell: ({ row }) => {
      return `${formatPrice(row.original.lateDeduction)} تومان`;
    },
  },

  {
    accessorKey: "leaveDeduction",

    header: "کسری مرخصی",

    cell: ({ row }) => {
      return `${formatPrice(row.original.leaveDeduction)} تومان`;
    },
  },

  {
    accessorKey: "absentDeduction",

    header: "کسری غیبت",

    cell: ({ row }) => {
      return `${formatPrice(row.original.absentDeduction)} تومان`;
    },
  },

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

  {
    accessorKey: "salaryEffectiveMonth",

    header: "حقوق از",

    cell: ({ row }) => {
      const { salaryEffectiveYear, salaryEffectiveMonth } = row.original;

      return `${monthLabels[salaryEffectiveMonth]} ${salaryEffectiveYear}`;
    },
  },

  {
    accessorKey: "status",

    header: "وضعیت",

    cell: ({ row }) => {
      const status = row.original.status;

      return status === "Unknown" ? "نامشخص" : status;
    },
  },

  {
    id: "actions",

    header: "عملیات",

    cell: ({ row }) => {
      return <PayRollPeriodActions row={row.original} />;
    },
  },
];
