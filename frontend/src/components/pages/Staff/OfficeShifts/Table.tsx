import { DataTable } from "@/components/shared/data-table";
import { userColumns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";

export interface Shift {
  id: number;
  name: string;
  shiftTimes: ShiftTime[];

  createdAt: string;
  updatedAt: string | null;
}

export interface ShiftTime {
  id: number;

  dayOfWeek: WeekDay;

  startTime: string;
  endTime: string;

  shiftId: number;

  createdAt: string;
  updatedAt: string | null;
}

export type WeekDay =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

const Table: React.FC = () => {

   const fetchData = useGetRowsToTable("shifts");
   return (
      <DataTable<Shift, unknown>
         columns={userColumns}
         queryKey={["shifts"]}
         queryFn={() => fetchData}
         searchableKeys={["shift"]}
      />
   );
};

export default Table;
