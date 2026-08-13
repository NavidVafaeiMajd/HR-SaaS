import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { z } from "zod";
import { EmployeeSalaryAction } from "./EmployeeSalaryActions";

export interface EmployeeSalaryColumnProps extends Record<string, unknown> {
  id: string;

  userId: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
  };

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

  isInsured: boolean;
  isTaxable: boolean;

  effectiveFrom: string | Date;

  createdAt: string;
  updatedAt: string | null;
}

export const columns: ColumnDef<EmployeeSalaryColumnProps>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          کارمند
        </Button>
      );
    },

    cell: ({ row }) => {
      const user = row.original.user;

      if (!user) return "-";

      return `${user.firstName} ${user.lastName}`;
    },
  },

  {
    accessorKey: "baseSalary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          حقوق پایه
        </Button>
      );
    },

    cell: ({ row }) => {
      const value = row.original.baseSalary;

      return `${value && value?.toLocaleString("fa-IR")} تومان`;
    },
  },

  {
    accessorKey: "housingAllowance",
    header: "حق مسکن",

    cell: ({ row }) => {
      const value = row.original.housingAllowance;

      return `${value?.toLocaleString("fa-IR")} تومان`;
    },
  },

  {
    accessorKey: "foodAllowance",
    header: "حق غذا",

    cell: ({ row }) => {
      const value = row.original.foodAllowance;

      return `${value?.toLocaleString("fa-IR")} تومان`;
    },
  },

  {
    accessorKey: "seniorityAllowance",
    header: "سنوات",

    cell: ({ row }) => {
      const value = row.original.seniorityAllowance;

      return `${value?.toLocaleString("fa-IR")} تومان`;
    },
  },

  {
    accessorKey: "overtimePerHour",
    header: "اضافه‌کاری ساعتی",

    cell: ({ row }) => {
      const value = row.original.overtimePerHour;

      return `${value?.toLocaleString("fa-IR")} تومان`;
    },
  },

  {
    accessorKey: "effectiveFrom",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تاریخ شروع
        </Button>
      );
    },

    cell: ({ row }) => {
      const rawDate = row.original.effectiveFrom;

      if (!rawDate) return "-";

      const date =
        rawDate instanceof Date
          ? rawDate
          : new Date(String(rawDate).replace(" ", "T"));

      return date.toLocaleDateString("fa-IR");
    },
  },

  {
    id: "status",

    header: "وضعیت",

    cell: ({ row }) => {
      const salary = row.original;

      return (
        <div className="flex gap-2">
          {salary.isInsured && <span className="text-sm">بیمه</span>}

          {salary.isTaxable && <span className="text-sm">مالیات</span>}
        </div>
      );
    },
  },

  {
    id: "actions",

    header: "عملیات",

    cell: ({ row }) => {
      const salary = row.original;

      return <EmployeeSalaryAction news={salary} />;
    },
  },
];
