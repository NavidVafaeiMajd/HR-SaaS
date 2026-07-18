import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";

export const stageChangeColumns: ColumnDef<Record<string, unknown>>[] = [
   {
      accessorKey: "previous_stage",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               مرحله قبلی
            </Button>
         );
      },
      cell(props) {
         const stage = props.getValue() as string;
         return (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
               {stage}
            </span>
         );
      },
   },
   {
      accessorKey: "new_stage",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               مرحله جدید
            </Button>
         );
      },
      cell(props) {
         const stage = props.getValue() as string;
         return (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
               {stage}
            </span>
         );
      },
   },
   {
      accessorKey: "changed_at",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               تاریخ تغییر
            </Button>
         );
      },
      cell(props) {
         const date = props.getValue() as string;
         return (
            <span className="text-sm">
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
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               <LuArrowUpDown className="ml-2 h-4 w-4" />
               یادداشت
            </Button>
         );
      },
      cell(props) {
         const note = props.getValue() as string;
         return (
            <span className="text-sm text-gray-600">
               {note || "بدون یادداشت"}
            </span>
         );
      },
   },
];
