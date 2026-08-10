import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";

export interface AttendanceListColumnProps extends Record<string, unknown> {
  userId: string;

  firstName: string;
  lastName: string;

  attendanceId: number | null;

  date: string;

  status:
    | "Present"
    | "Absent"
    | "Leave"
    | "Mission"
    | "Remote"
    | "SickLeave"
    | null;

  checkIn: string | null;
  checkOut: string | null;

  workedMinutes: number | null;
  lateMinutes: number | null;
  earlyLeaveMinutes: number | null;
  overtimeMinutes: number | null;

  description: string | null;
}

const statusLabels: Record<
  NonNullable<AttendanceListColumnProps["status"]>,
  string
> = {
  Present: "حاضر",
  Absent: "غایب",
  Leave: "مرخصی",
  Mission: "ماموریت",
  Remote: "دورکاری",
  SickLeave: "مرخصی استعلاجی",
};

const formatMinutes = (minutes: number | null) => {
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

export const columns: ColumnDef<AttendanceListColumnProps>[] = [
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
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return `${firstName} ${lastName}`;
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
      const date = new Date(row.original.date);

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
    cell: ({ row }) => {
      const status = row.original.status;

      return status ? statusLabels[status] : "ثبت نشده";
    },
  },

  {
    accessorKey: "checkIn",
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
      return row.original.checkIn ?? "—";
    },
  },

  {
    accessorKey: "checkOut",
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
      return row.original.checkOut ?? "—";
    },
  },

  {
    accessorKey: "lateMinutes",
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
      return formatMinutes(row.original.lateMinutes);
    },
  },

  {
    accessorKey: "earlyLeaveMinutes",
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
      return formatMinutes(row.original.earlyLeaveMinutes);
    },
  },

  {
    accessorKey: "workedMinutes",
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
      return formatMinutes(row.original.workedMinutes);
    },
  },

  {
    accessorKey: "overtimeMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        اضافه کاری
      </Button>
    ),
    cell: ({ row }) => {
      return formatMinutes(row.original.overtimeMinutes);
    },
  },
];
