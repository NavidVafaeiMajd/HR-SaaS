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
      type_name: z.string().min(1, "نوع مرخصی الزامی است"),
      days_per_year: z.string().min(1, "روزها در سال الزامی است"),
      requires_approval: z.string().min(1, "وضعیت الزامی است"),
    }),
    "نوع مرخصی"
  );

  const leaveType = row.original;
  
  return (
    <div className="flex items-center gap-2">
      <EditDialog
        onSave={(data) => {
          console.log(data)
          mutation.mutate(data);
        }}
        fields={
          <>
              <Form.Input
                label="نوع مرخصی"
                name="type_name"
                placeholder="نوع مرخصی"
                required
                />
              <Form.Input
                label="روزها در سال"
                name="days_per_year"
                placeholder="روزها در سال"
                required
              />
              <Form.Select
                label="وضعیت"
                name="requires_approval"
                placeholder="انتخاب وضعیت"
                options={[{label : "اضافه بر سازمان" , value : "اضافه بر سازمان"} , {label : "مرخصی سازمانی" , value : "سازمانی"}]}
                required
              />
          </>
        }
        defaultValues={{
          type_name: leaveType.type_name || "",
          days_per_year: String(leaveType.days_per_year || ""),
          requires_approval: leaveType.requires_approval || "",
        }}
        schema={z.object({
          type_name: z.string().min(1, "نوع مرخصی الزامی است"),
          days_per_year: z.string().min(1, "روزها در سال الزامی است"),
          requires_approval: z.string().min(1, "وضعیت الزامی است"),
        })}
      />
      <DeleteDialog
        onConfirm={() => {
          deleteRow.mutate(Number(leaveType.id));
        }}
      />
    </div>
  );
});

export const columns: ColumnDef<leaveTypeColumnProps>[] = [
  {
    accessorKey: "type_name",
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
    accessorKey: "days_per_year",
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
    accessorKey: "requires_approval",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        وضعیت
      </Button>
    ),
  },
  {
    accessorKey: "id",
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
