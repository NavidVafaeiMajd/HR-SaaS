import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/shared/section/Table";
import { JsonTable } from "@/components/shared/json-table";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { useGetSingleTable } from "@/hook/useGetSingleTable";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { Link } from "react-router-dom";

interface UserAttendanceSummary {
  userId: string;
  name: string;

  totalWorkedMinutes: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
  totalOvertimeMinutes: number;

  presentDays: number;
  absentDays: number;
  leaveDays: number;
}

const MonthlyAttendance = () => {
  const { data } = useGetSingleTable("user-attendance");

  const columns: ColumnDef<UserAttendanceSummary>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            کارمند
          </Button>
        ),
      },

      {
        accessorKey: "totalWorkedMinutes",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            مجموع کارکرد
          </Button>
        ),
        cell: ({ row }) => {
          const minutes = row.original.totalWorkedMinutes;

          if (!minutes) return "-";

          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          return `${hours} ساعت و ${remainingMinutes} دقیقه`;
        },
      },

      {
        accessorKey: "presentDays",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            روز های حضور
          </Button>
        ),
        cell: ({ row }) => `${row.original.presentDays} روز`,
      },

      {
        accessorKey: "absentDays",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            روز های غیبت
          </Button>
        ),
        cell: ({ row }) => `${row.original.absentDays} روز`,
      },

      {
        accessorKey: "leaveDays",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            روز های مرخصی
          </Button>
        ),
        cell: ({ row }) => `${row.original.leaveDays} روز`,
      },

      {
        accessorKey: "totalLateMinutes",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            مجموع تاخیر
          </Button>
        ),
        cell: ({ row }) => {
          const minutes = row.original.totalLateMinutes;

          if (!minutes) return "-";

          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          return `${hours} ساعت و ${remainingMinutes} دقیقه`;
        },
      },

      {
        accessorKey: "totalEarlyLeaveMinutes",
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
          const minutes = row.original.totalEarlyLeaveMinutes;

          if (!minutes) return "-";

          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          return `${hours} ساعت و ${remainingMinutes} دقیقه`;
        },
      },

      {
        accessorKey: "totalOvertimeMinutes",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <LuArrowUpDown className="ml-2 h-4 w-4" />
            مجموع اضافه کاری
          </Button>
        ),
        cell: ({ row }) => {
          const minutes = row.original.totalOvertimeMinutes;

          if (!minutes) return "-";

          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          return `${hours} ساعت و ${remainingMinutes} دقیقه`;
        },
      },

      {
        id: "actions",
        header: "عملیات",

        cell: ({ row }) => (
          <>
            <Link to={`/user-attendance/${row.original.userId}`}>
              <Button>جزئیات </Button>
            </Link>
          </>
        ),
      },
    ],
    [],
  );

  console.log("data", data);
  return (
    <Table
      table={<JsonTable columns={columns} data={data || []} />}
      Title="لیست گزارش حضور و غیاب کاربران"
    />
  );
};

export default MonthlyAttendance;
