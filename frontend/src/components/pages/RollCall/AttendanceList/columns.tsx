import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";

export interface AttendanceListColumnProps extends Record<string, unknown> {
   id: number;
   employee: string;
   date: Date;
   status: string;
   entryTime: string;
   exitTime: string;
   tardiness: string;
   earlyLeave: string;
   totalHours: string;
}

export const columns: ColumnDef<AttendanceListColumnProps>[] = [
  {
    accessorKey: "employee",
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
      const employee = row.getValue("employee");
      return employee.firstName ? employee.firstName + employee.lastName : "—";
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        تاریخ
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fa-IR");
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        وضعیت
      </Button>
    ),
  },
  {
    accessorKey: "check_in",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان ورود
      </Button>
    ),
    cell: ({ row }) => {
      const shiftStart = row.getValue("check_in");
      return shiftStart ? shiftStart : "—";
    },
  },
  {
    accessorKey: "check_out",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان خروج
      </Button>
    ),
    cell: ({ row }) => {
      const checkOut = row.getValue("check_out");
      return checkOut ? checkOut : "—";
    },
  },
  {
    accessorKey: "late",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        تاخیر
      </Button>
    ),
    cell: ({ row }) => {
      const late = row.getValue("late");
      return late ? late : "—";
    },
  },
  {
    accessorKey: "early_leave",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        ترک زودهنگام
      </Button>
    ),
    cell: ({ row }) => {
      const earlyLeave = row.getValue("early_leave");
      return earlyLeave ? earlyLeave : "—";
    },
  },
  {
    accessorKey: "total_work",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        مجموع کار
      </Button>
    ),
    cell: ({ row }) => {
      const check_out = row.getValue("check_out");
      const check_in = row.getValue("check_in");
      return check_out
        ? parseInt(check_out) - parseInt(check_in) + " ساعت  "
        : "—";
    },
  },
];
