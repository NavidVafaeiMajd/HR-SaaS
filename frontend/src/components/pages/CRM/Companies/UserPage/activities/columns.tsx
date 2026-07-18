import type { ColumnDef } from "@tanstack/react-table";
import type { Activity } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { Form } from "@/components/shared/Form";
import { validation } from "./validation";
import { useParams } from "react-router-dom";

export const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نام فعالیت
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نوع فعالیت
        </Button>
      );
    },
  },
  {
    accessorKey: "activity_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تاریخ فعالیت
        </Button>
      );
    },
    cell(props) {
      const date = props.getValue() as string;
      return (
        <span className="max-w-xs truncate">
          {new Date(date).toLocaleDateString('fa-IR')}
        </span>
      );
    },
  },
  {
    accessorKey: "note",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          یادداشت
        </Button>
      );
    },
    cell(props) {
      const note = props.getValue() as string;
      return (
        <span className="max-w-xs truncate">
          {note || "ثبت نشده"}
        </span>
      );
    },
  },
  {
    accessorKey: "marketing_staff",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          پرسنل بازاریابی
        </Button>
      );
    },
    cell(props) {
      const marketingStaff = props.getValue() as any;
      return (
        <div className="max-w-xs">
          <div className="font-medium">
            {marketingStaff?.first_name} {marketingStaff?.last_name}
          </div>
          <div className="text-sm text-gray-500">
            {marketingStaff?.email}
          </div>
          <div className="text-sm text-gray-500">
            {marketingStaff?.phone}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => {
      const activity = row.original;
      const { id } = useParams();

      const deleteRow = useDeleteRows({
        url: `companies/${id}/activities`,
        queryKey: ["activities", id as string],
      });
      const updateRow = useUpdateRows( `companies/${id}/activities/${activity.id}`, ["activities", id as string], {}, "فعالیت");
      
      return (
        <div className="flex items-center gap-2">
          <EditDialog
            title="ویرایش فعالیت"
            defaultValues={{
              name: activity.name,
              marketing_staff_id: activity.marketing_staff_id.toString(),
              activity_date: new Date(activity.activity_date),
              type: activity.type,
              note: activity.note || "",
            }}
             onSave={(data) => {
               const payload = {
                 ...data,
                 activity_date: new Date(data.activity_date).toISOString().slice(0, 19),
               }
               console.log(payload);
               updateRow.mutation.mutate(payload);
             }}
            schema={validation}
            fields={<>
              <div className="flex flex-col md:flex-row gap-5">
                <Form.Input name="name" label="نام فعالیت" required placeholder="نام فعالیت" />
                <Form.Select
                  name="type"
                  label="نوع فعالیت"
                  required
                  placeholder="انتخاب نوع فعالیت"
                  options={[
                    { value: "حضوری", label: "حضوری" },
                    { value: "تلفنی", label: "تلفنی" }
                  ]}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <Form.Date name="activity_date" label="تاریخ فعالیت" />
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <Form.Input name="note" label="یادداشت" placeholder="یادداشت (اختیاری)" />
              </div>
              </>}
          />
          
          <DeleteDialog
            title="حذف فعالیت"
            description="آیا از حذف این فعالیت اطمینان دارید؟"
            onConfirm={() => {
              deleteRow.mutate(activity.id);
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
