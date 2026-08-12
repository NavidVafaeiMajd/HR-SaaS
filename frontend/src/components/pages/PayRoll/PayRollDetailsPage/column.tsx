import type { ColumnDef } from "@tanstack/react-table";
import type {
  MonthlyAttendance,
  AttendanceStatus,
} from "./PayRollInterface";

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
    default:
      return {
        label: "نامشخص",
        className: "bg-gray-100 text-gray-800",
      };
  }
};

const formatMinutes = (minutes: number) => {
  if (!minutes) return "—";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes} دقیقه`;
  }

  if (!remainingMinutes) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};

export const monthlyColumns: ColumnDef<MonthlyAttendance>[] = [
  {
    accessorKey: "date",
    header: "تاریخ",

    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString("fa-IR");
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
    accessorKey: "checkIn",
    header: "ساعت ورود",

    cell: ({ row }) => {
      return row.original.checkIn || "—";
    },
  },

  {
    accessorKey: "checkOut",
    header: "ساعت خروج",

    cell: ({ row }) => {
      return row.original.checkOut || "—";
    },
  },

  {
    accessorKey: "workedMinutes",
    header: "مدت کارکرد",

    cell: ({ row }) => {
      return formatMinutes(row.original.workedMinutes);
    },
  },

  {
    accessorKey: "lateMinutes",
    header: "تأخیر",

    cell: ({ row }) => {
      return formatMinutes(row.original.lateMinutes);
    },
  },

  {
    accessorKey: "earlyLeaveMinutes",
    header: "ترک زودهنگام",

    cell: ({ row }) => {
      return formatMinutes(row.original.earlyLeaveMinutes);
    },
  },

  {
    accessorKey: "overtimeMinutes",
    header: "اضافه‌کاری",

    cell: ({ row }) => {
      return formatMinutes(row.original.overtimeMinutes);
    },
  },

  {
    accessorKey: "description",
    header: "توضیحات",

    cell: ({ row }) => {
      return row.original.description || "—";
    },
  },
];
