import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { Form } from "@/components/shared/Form";
import { validation } from "./validation";

export const userColumns: ColumnDef<User>[] = [
   {
      accessorKey: "name",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               شیفت
            </Button>
         );
      },
   },
   {
      accessorKey: "saturday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === "تعطیل"
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "تعطیل" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               شنبه
            </Button>
         );
      },
   },
      {
      accessorKey: "sunday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === "" 
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               یکشنبه
            </Button>
         );
      },
   },
   {
      accessorKey: "monday",
      cell(props) {
         const status = props.getValue();
         return (
           <span
             className={cn(
               status === "" ? "bg-green-100 text-green-500" : "",
               "p-2 rounded-sm",
             )}
           >
             {status === ""? "تعطیلات" : `${status}`}
           </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               دوشنبه
            </Button>
         );
      },
   },
      {
      accessorKey: "tuesday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === ""
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               سه‌شنبه
            </Button>
         );
      },
   },
      {
      accessorKey: "wednesday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === ""
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               چهارشنبه
            </Button>
         );
      },
   },
      {
      accessorKey: "thursday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === ""
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               پنجشنبه
            </Button>
         );
      },
   },
      {
      accessorKey: "friday",
      cell(props) {
         const status = props.getValue();
         return (
            <span
               className={cn(
                  status === ""
                     ? "bg-green-100 text-green-500"
                     : "",
                  "p-2 rounded-sm"
               )}
            >
               {status === "" 
                  ? "تعطیلات"
                  : `${status}` }
            </span>
         );
      },
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
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
         const updateRow = useUpdateRows(`shifts/${shift.id}`, ["shifts"], {}, "شیفت");
         
         return (
            <div className="flex items-center gap-2">
               <EditDialog
                  title="ویرایش شیفت"
                  defaultValues={{
                     name: shift.shift,
                     saturday_start: shift.saturday?.entry || "",
                     saturday_end: shift.saturday?.exit || "",
                     sunday_start: shift.sunday?.entry || "",
                     sunday_end: shift.sunday?.exit || "",
                     monday_start: shift.monday?.entry || "",
                     monday_end: shift.monday?.exit || "",
                     tuesday_start: shift.tuesday?.entry || "",
                     tuesday_end: shift.tuesday?.exit || "",
                     wednesday_start: shift.wednesday?.entry || "",
                     wednesday_end: shift.wednesday?.exit || "",
                     thursday_start: shift.thursday?.entry || "",
                     thursday_end: shift.thursday?.exit || "",
                     friday_start: shift.friday?.entry || "",
                     friday_end: shift.friday?.exit || "",
                  }}
                  onSave={(data) => {
                     updateRow.mutation.mutate(data);
                  }}
                  schema={validation}
                  fields={<>
                     <div className="flex flex-col md:flex-row gap-5">
                        <Form.Input name="name" label="نام شیفت" required placeholder="نام شیفت" />
                     </div>
                     
                     {Object.entries({
                        saturday: "شنبه",
                        sunday: "یکشنبه", 
                        monday: "دوشنبه",
                        tuesday: "سه‌شنبه",
                        wednesday: "چهارشنبه",
                        thursday: "پنجشنبه",
                        friday: "جمعه"
                     }).map(([day, label]) => (
                        <div key={day} className="border border-gray-200 rounded-lg p-4">
                           <h3 className="font-bold mb-4 text-lg">{label}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Form.TimePicker
                                 name={`${day}_start` as any}
                                 label="ساعت شروع"
                                 placeholder="انتخاب ساعت شروع"
                              />
                              <Form.TimePicker
                                 name={`${day}_end` as any}
                                 label="ساعت پایان"
                                 placeholder="انتخاب ساعت پایان"
                              />
                           </div>
                        </div>
                     ))}
                  </>}
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
