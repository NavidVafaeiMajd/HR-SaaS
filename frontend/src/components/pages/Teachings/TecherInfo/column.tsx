import type { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./ActionsCell";

export interface TecherInfoType {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  specialty: string;
  address: string;
  [key: string]: string | number;
}

export const TecherInfoColumns: ColumnDef<TecherInfoType>[] = [
  {
    accessorKey: "first_name",
    header: "نام ",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "نام خانوادگی",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "شماره تماس",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "ایمیل",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "specialty",
    header: "تخصص",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("specialty")}</div>
    ),
  },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
];
