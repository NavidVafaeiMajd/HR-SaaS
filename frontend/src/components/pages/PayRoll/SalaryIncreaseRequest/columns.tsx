import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { z } from "zod";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDepartments } from "@/hook/useDepartments";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
export interface SalaryIncreaseRequestColumnProps extends Record<string, unknown> {
  departmentId: string;
  name: string;
  description?: string | undefined;
}


const validation = z.object({
  departmentId: z.string().min(1, "واحد سازمانی الزامی است"),
  name: z.string().min(1, "نام سمت سازمانی الزامی است"),
  description: z.string().optional(),
});

export const columns: ColumnDef<SalaryIncreaseRequestColumnProps>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        نام سمت سازمانی
      </Button>
    ),
  },
  {
    accessorKey: "departmentId",
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
      const { data: departments } = useDepartments();
      const rowData = row.original;
      const department = departments?.data?.find(
        (item) => item?.id === rowData.departmentId
      );

      return department ? department.name : "-";
    },
  },

  {
    accessorKey: "id",
    id: "actions",
    header: "عملیات",

     cell: ({ row }) => {

      const { data: departments } = useDepartments();
      const rowInf = row.original;
      const deleteRow = useDeleteRows({
        url: "designations",
        queryKey: ["designations"],
      });
      const { mutation } = useUpdateRows(
         `designations/${rowInf.id}`,
         ["designations"],
         validation,
         "واحد سازمانی"
       );
       const departmentsMapped = departments?.data?.map((item) => ({
         value: String(item.id),
         label: item.name,
       }));
      return (
        <div className="flex items-center gap-2">
            <EditDialog
            
            title="ویرایش  "
            triggerLabel="ویرایش"
            fields={
              <>
                <Form.Select name="departmentId" label="واحد سازمانی" options={departmentsMapped ||[]} required/>
                <Form.Input
                  name="name"
                  label="نام سمت سازمانی"
                  required
                />
                <Form.Textarea name="description" label="شرح" />
              </>
            }
            defaultValues={{
              departmentId: rowInf.departmentId,
              name: rowInf.name,
              description: rowInf.description,
            }}
            onSave={(data) => {
              mutation.mutate(data)
            }}
            schema={validation}
          />
          <DeleteDialog
            onConfirm={() => {
              deleteRow.mutate(rowInf.id as number);
            }}
          />
        </div>
      );
    },
  },
];
