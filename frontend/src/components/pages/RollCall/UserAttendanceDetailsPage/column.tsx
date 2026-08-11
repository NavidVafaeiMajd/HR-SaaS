import type { ColumnDef } from "@tanstack/react-table";
import type { MonthlyLeave } from "./LeaveInterface";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { Link } from "react-router-dom";
export const getAttendanceStatusInfo = (status: AttendanceStatus) => {
  switch (status) {
    case "Present":
      return {
        label: "حاضر",
        className: "bg-green-100 text-green-800",
      };

    case "Absent":
      return {
        label: "غایب",
        className: "bg-red-100 text-red-800",
      };

    case "Leave":
      return {
        label: "مرخصی",
        className: "bg-blue-100 text-blue-800",
      };

    case "Late":
      return {
        label: "با تأخیر",
        className: "bg-yellow-100 text-yellow-800",
      };

    case "EarlyLeave":
      return {
        label: "ترک زودهنگام",
        className: "bg-orange-100 text-orange-800",
      };

    case "OutOfShift":
      return {
        label: "خارج از شیفت",
        className: "bg-purple-100 text-purple-800",
      };

    case "Unknown":
      return {
        label: "نامشخص",
        className: "bg-gray-100 text-gray-800",
      };

    default:
      return {
        label: "نامشخص",
        className: "bg-gray-100 text-gray-800",
      };
  }
};

  export const monthlyColumns: ColumnDef<MonthlyLeave>[] =  [
      {
        accessorKey: "leaveType",
        header: "نوع مرخصی",

        cell: ({ row }) => {
          return <span>{row.original.leaveType?.name || "—"}</span>;
        },
      },

      {
        accessorKey: "startDate",
        header: "تاریخ شروع",

        cell: ({ row }) => {
          return new Date(row.original.startDate).toLocaleDateString("fa-IR");
        },
      },

      {
        accessorKey: "endDate",
        header: "تاریخ پایان",

        cell: ({ row }) => {
          return new Date(row.original.endDate).toLocaleDateString("fa-IR");
        },
      },

      {
        accessorKey: "totalDays",
        header: "تعداد روز",

        cell: ({ row }) => {
          return <span>{row.original.totalDays} روز</span>;
        },
      },

      {
        accessorKey: "status",
        header: "وضعیت",

        cell: ({ row }) => {
          const status = getAttendanceStatusInfo(row.original.status);

          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "تاریخ درخواست",

        cell: ({ row }) => {
          return new Date(row.original.createdAt).toLocaleDateString("fa-IR");
        },
      },

      {
        id: "actions",

        header: "عملیات",

        cell: ({ row }) => {
          const { mutation: UpdateCancel } = useUpdateRows(
            `leave-list/${row.original.id}/cancel`,
            ["leaves"],
            {},
            "لغو",
          );
          return (
            <div className="flex gap-3 items-center">
              <Link to={`/leave/details/${row.original.id}`}>
                <Button size="sm">نمایش جزئیات</Button>
              </Link>
              {row?.original.status === "Pending" && (
                <Button
                  onClick={() => {
                    UpdateCancel.mutate({});
                  }}
                  variant={"destructive"}
                >
                  لغو کردن
                </Button>
              )}
            </div>
          );
        },
      },
    ]
