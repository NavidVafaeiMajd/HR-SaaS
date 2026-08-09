import { EditDialog } from "@/components/shared/EditDialog";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { Form } from "@/components/shared/Form";
import { z } from "zod";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import React from "react";

export interface leaveTypeColumnProps extends Record<string, unknown> {
  id: string;
  leave_types: string;
  days_per_year: number;
  requires_approval: string;
}

// Create a component for the actions cell to avoid hook issues
const ActionsCell = React.memo(({ row }: { row: any }) => {
  const deleteRow = useDeleteRows({
    url: "leave-types",
    queryKey: ["leave-types"],
  });
  
const { mutation } = useUpdateRows(
  `leave-types/${row.original.id}`,
  ["leave-types"],
  z.object({
    Name: z.string().min(1, "نوع مرخصی الزامی است"),
    AnnualLimit: z.coerce.number().min(1, "روزها در سال الزامی است"),
    IsActive: z.boolean(),
    Description: z.string().optional(),
  }),
  "نوع مرخصی",
);

const leaveType = row.original;

return (
  <div className="flex gap-2">
    <EditDialog
      onSave={(data) => {
        mutation.mutate(data);
      }}
      fields={
        <>
          <Form.Input
            label="نوع مرخصی"
            name="Name"
            placeholder="نوع مرخصی"
            required
          />

          <Form.Input
            label="روزها در سال"
            name="AnnualLimit"
            placeholder="روزها در سال"
            required
          />

          <Form.Select
            label="وضعیت"
            name="IsActive"
            placeholder="انتخاب وضعیت"
            options={[
              { label: "فعال", value: true },
              { label: "غیرفعال", value: false },
            ]}
            required
          />

          <Form.Textarea
            label="توضیحات"
            name="Description"
            placeholder="توضیحات"
          />
        </>
      }
      defaultValues={{
        Name: leaveType.name || "",
        AnnualLimit: leaveType.annualLimit ?? 0,
        IsActive: leaveType.isActive ?? true,
        Description: leaveType.description || "",
      }}
      schema={z.object({
        Name: z.string().min(1, "نوع مرخصی الزامی است"),

        AnnualLimit: z.coerce.number().min(1, "روزها در سال الزامی است"),

        IsActive: z.boolean(),

        Description: z.string().optional(),
      })}
    />

    <DeleteDialog
      onConfirm={() => {
        deleteRow.mutate(leaveType.id);
      }}
    />
  </div>
);
});

export const columns: ColumnDef<leaveTypeColumnProps>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        نوع مرخصی
      </Button>
    ),
  },
  {
    accessorKey: "annualLimit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        روزها در سال
      </Button>
    ),
  },
  {
    accessorKey: "isActive",
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
      const isActive = row.getValue("isActive");
      return isActive ? "فعال" : "غیرفعال";
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        وضعبت حقوق
      </Button>
    ),
    cell: ({ row }) => {
      const isPaid = row.getValue("isPaid");
      return isPaid ? "با حقوق" : "بدون حقوق";
    },
  },
  {
    accessorKey: "id",
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
