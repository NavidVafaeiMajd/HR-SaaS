import type { ColumnDef } from "@tanstack/react-table";
import type { Shift } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { Form } from "@/components/shared/Form";
import { validation } from "./validation";
import { DAYS } from "./Form";

export const userColumns: ColumnDef<Shift>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          شیفت
        </Button>
      );
    },
  },
  {
    accessorKey: "saturday",
    cell({ row }) {
      const status = row.original.shiftTimes[0];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          شنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "sunday",
    cell({ row }) {
      const status = row.original.shiftTimes[1];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          یکشنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "monday",
    cell({ row }) {
      const status = row.original.shiftTimes[2];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          دوشنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "tuesday",
    cell({ row }) {
      const status = row.original.shiftTimes[3];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          سه‌شنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "wednesday",
    cell({ row }) {
      const status = row.original.shiftTimes[4];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          چهارشنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "thursday",
    cell({ row }) {
      const status = row.original.shiftTimes[5];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          پنجشنبه
        </Button>
      );
    },
  },
  {
    accessorKey: "friday",
    cell({ row }) {
      const status = row.original.shiftTimes[6];
      return (
        <span
          className={cn(
            status.startTime === "" || status.endTime === ""
              ? "bg-green-100 text-green-500"
              : "",
            "p-2 rounded-sm",
          )}
        >
          {status.startTime == "" && status.endTime == ""
            ? "تعطیلات"
            : `${status.startTime} - ${status.endTime}`}
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
          جمعه
        </Button>
      );
    },
  },

  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => {
      const shift = row.original;

      const deleteRow = useDeleteRows({
        url: "shifts",
        queryKey: ["shifts"],
      });
      const updateRow = useUpdateRows(
        `shifts/${shift.id}`,
        ["shifts"],
        "شیفت",
      );

      return (
        <div className="flex items-center gap-2">
          <EditDialog
            title="ویرایش شیفت"
            defaultValues={{
              name: shift.name,
              shiftTimes: [
                {
                  dayOfWeek: 0,
                  startTime: shift.shiftTimes[0].startTime,
                  endTime: shift.shiftTimes[0].endTime,
                },
                {
                  dayOfWeek: 1,
                  startTime: shift.shiftTimes[1].startTime,
                  endTime: shift.shiftTimes[1].endTime,
                },
                {
                  dayOfWeek: 2,
                  startTime: shift.shiftTimes[2].startTime,
                  endTime: shift.shiftTimes[2].endTime,
                },
                {
                  dayOfWeek: 3,
                  startTime: shift.shiftTimes[3].startTime,
                  endTime: shift.shiftTimes[3].endTime,
                },
                {
                  dayOfWeek: 4,
                  startTime: shift.shiftTimes[4].startTime,
                  endTime: shift.shiftTimes[4].endTime,
                },
                {
                  dayOfWeek: 5,
                  startTime: shift.shiftTimes[5].startTime,
                  endTime: shift.shiftTimes[5].endTime,
                },
                {
                  dayOfWeek: 6,
                  startTime: shift.shiftTimes[6].startTime,
                  endTime: shift.shiftTimes[6].endTime,
                },
              ],
            }}
            onSave={(data) => {
              updateRow.mutation.mutate(data);
            }}
            schema={validation}
            fields={
              <>
                <div className="flex flex-col md:flex-row gap-5">
                  <Form.Input
                    name="name"
                    label="نام شیفت"
                    required
                    placeholder="نام شیفت"
                  />
                </div>

                {DAYS.map((day, index) => (
                  <div
                    key={day.key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-bold mb-4 text-lg">{day.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.TimePicker
                        name={`shiftTimes.${index}.startTime`}
                        label="ساعت شروع"
                        placeholder="انتخاب ساعت شروع"
                      />
                      <Form.TimePicker
                        name={`shiftTimes.${index}.endTime`}
                        label="ساعت پایان"
                        placeholder="انتخاب ساعت پایان"
                      />
                    </div>
                  </div>
                ))}
              </>
            }
          />

          <DeleteDialog
            title="حذف شیفت"
            description="آیا از حذف این شیفت اطمینان دارید؟"
            onConfirm={() => {
              deleteRow.mutate(shift.id);
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
