import type { ColumnDef } from "@tanstack/react-table";
import type { Roles } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";

export const userColumns: ColumnDef<Roles>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نام
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name");
      return name ? name : "—";
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          توضیحات
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description ? description : "—";
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => {
      const deleteRow = useDeleteRows({
        url: "employees",
        queryKey: ["employees"],
      });
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <ActionsCell
            actions={[{ label: "نمایش جزییات", path: `/users/${user.id}` }]}
          />
          <DeleteDialog
            onConfirm={() => {
              deleteRow.mutate(user.id);
            }}
          />
        </div>
      );
    },
    header: () => {
      return <span className="font-normal">عملیات</span>;
    },
  },
];
