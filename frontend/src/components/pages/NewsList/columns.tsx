import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useDepartments } from "@/hook/useDepartments";
import { useUpdateRows } from "@/hook/useUpdateRows";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { z } from "zod";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useEmployees } from "@/hook/useEmployees";
import { AnnouncementActions } from "./news-actions";

export interface PolicyColumnProps extends Record<string, unknown> {
  id: string;

  title: string;
  content: string;

  publish_date: string | Date;
  end_date: string | Date;

  departments: {
    value: string;
    label: string;
  }[];

  positions: {
    value: string;
    label: string;
  }[];

  users: {
    value: string;
    label: string;
  }[];

  createdAt: string;
  createdBy: string | null;
}

const validation = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  publish_date: z.date(),
  end_date: z.date(),
  department: z.string(),
  summary: z.string(),
  content: z.string(),
});

export const columns: ColumnDef<PolicyColumnProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          عنوان
        </Button>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        واحد سازمانی
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original.createdBy;

      return user ? `${user?.firstName} ${user?.lastName}` : "-";
    },
  },
  {
    accessorKey: "startDate",
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
      const rawDate = row.getValue("startDate") as string | null;

      if (!rawDate) return "-";

      const date = new Date(rawDate.replace(" ", "T"));
      return date.toLocaleDateString("fa-IR");
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تاریخ پایان
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("endDate") as string | null;

      if (!rawDate) return "-";

      const date = new Date(rawDate.replace(" ", "T"));
      return date.toLocaleDateString("fa-IR");
    },
  },

  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => {
      const news = row.original;

      return <AnnouncementActions news={news} />;
    },
  },
];
