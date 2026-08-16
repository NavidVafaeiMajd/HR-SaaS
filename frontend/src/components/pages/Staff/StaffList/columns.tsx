import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import ActionsCell from "@/components/shared/ActionsCell";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نام کاربری
        </Button>
      );
    },
    cell: ({ row }) => {
      const userName = row.getValue("userName");
      return userName ? userName : "—";
    },
  },
  {
    accessorKey: "firstName",
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
      const firstName = row.getValue("firstName");
      const lastName = row.original.lastName
      return firstName ? firstName + " " + lastName : "—";
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          سمت سازمانی
        </Button>
      );
    },
    cell: ({ row }) => {
      const position = row.getValue("position");
      return position ? position.name : "—";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          شماره تماس
        </Button>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          جنسیت
        </Button>
      );
    },
    cell(props) {
      return <span>{props.getValue() === "man" ? "مذکر" : "مونث"}</span>;
    },
  },
  {
    accessorKey: "isActive",
    cell(props) {
      const status = props.getValue() as boolean;
      return (
        <span
          className={cn(
            "p-1 rounded-md",
            status == true
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500",
          )}
        >
          {status === true ? "فعال" : "غیر فعال"}
        </span>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          وضعیت
        </Button>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => {
      const deleteRow = useDeleteRows({
        url: "users",
        queryKey: ["users"],
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
