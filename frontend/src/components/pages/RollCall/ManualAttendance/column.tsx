import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useEmployees } from "@/hook/useEmployees";
import { useUpdateRows } from "@/hook/useUpdateRows";
import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { z } from "zod";
import { validation } from "./validation";

export interface ManualAttendance extends Record<string, unknown> {
  id: number;
  employee_id: string;
  date: Date;
  entryTime: string;
  exitTime: string;
  totalTime: string;
}


const schema = z.object({
  employee_id: z.string().min(1, "لطفا یک کارمند انتخاب کنید"),
  date: z.any(),
  check_in: z.string().min(1, "لطفا زمان ورود را وارد کنید"),
  check_out: z.string().min(1, "لطفا زمان خروج را وارد کنید"),
});

export const columns: ColumnDef<ManualAttendance>[] = [
  {
    accessorKey: "employee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          کارمند
        </Button>
      );
    },
    cell: ({ row }) => {
      const employee = row.getValue("employee") as string;
      return employee.firstName ? employee.firstName + employee.lastName : "—";
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تاریخ
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fa-IR");
    },
  },
  {
    accessorKey: "check_in",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان ورود
      </Button>
    ),
    cell: ({ row }) => {
      const checkIn = row.getValue("check_in");
      return checkIn ? checkIn : "—";
    },
  },
  {
    accessorKey: "check_out",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان خروج
      </Button>
    ),
    cell: ({ row }) => {
      const checkOut = row.getValue("check_out");
      return checkOut ? checkOut : "—";
    },
  },
  {
    accessorKey: "total_work",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان کل
      </Button>
    ),
    cell: ({ row }) => {
      const check_out = row.getValue("check_out");
      const check_in = row.getValue("check_in");
      return check_out ? parseInt(check_out) - parseInt(check_in) + " ساعت  ": "—";
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "عملیات",
    cell: ({ row }) => {
      const { data: employee } = useEmployees();
      const mapped = employee?.data?.map((item) => ({
        value: String(item.id),
        label: item.fullName,
      }));

      const r = row.original;

      const deleteRow = useDeleteRows({
        url: "attendances",
        queryKey: ["attendances"],
      });
      const { mutation } = useUpdateRows(
        `attendances/${r.id}`,
        ["attendances"],
        validation,
        "ثبت کارکنان دستی",
      );
      return (
        <div className="flex items-center gap-2">
          <EditDialog
            triggerLabel="ویرایش"
            defaultValues={{
              employee_id: r.employee_id,
              date: new Date(r.date),
              check_in: r.entryTime || "",
              check_out: r.exitTime || "",
            }}
            onSave={(data) => {
              mutation.mutate(data);
            }}
            schema={schema}
            fields={
              <>
                <Form.Select
                  name="employee_id"
                  label="کارمند"
                  options={mapped || []}
                  required
                />
                <Form.Date name="date" label="تاریخ" />
                <Form.TimePicker name="check_in" label="زمان ورود" />
                <Form.TimePicker name="check_out" label="زمان خروج" />
              </>
            }
          />
          <DeleteDialog onConfirm={() => deleteRow.mutate(r.id as any)} />
        </div>
      );
    },
  },
];
