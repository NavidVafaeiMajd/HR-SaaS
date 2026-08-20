import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";

export interface NotificationColumnProps {
  id: string;
  title: string;
  message: string;
  type: string;
  url: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

const notificationTypeMap: Record<string, string> = {
  Info: "اطلاعات",
  Success: "موفقیت",
  Warning: "هشدار",
  Error: "خطا",
};

export const columns: ColumnDef<NotificationColumnProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        عنوان
      </Button>
    ),
  },
  {
    accessorKey: "message",
    header: "پیام",
  },
  {
    accessorKey: "type",
    header: "نوع",
    cell: ({ row }) => {
      const type = row.original.type;

      return notificationTypeMap[type] ?? type;
    },
  },
  {
    accessorKey: "isRead",
    header: "وضعیت",
    cell: ({ row }) => {
      return row.original.isRead ? "خوانده شده" : "خوانده نشده";
    },
  },
  {
    accessorKey: "createdAt",
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
      const rawDate = row.original.createdAt;

      if (!rawDate) return "-";

      return new Date(rawDate).toLocaleDateString("fa-IR");
    },
  },
];
