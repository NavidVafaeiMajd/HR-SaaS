import { DataTable } from "@/components/shared/data-table";
import { userColumns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";

interface DaySchedule {
   entry?: string;
   exit?: string;
}

export interface User {
   id: number;
   shift: string;
   saturday: DaySchedule;
   sunday: DaySchedule;
   monday: DaySchedule;
   tuesday: DaySchedule;
   wednesday: DaySchedule;
   thursday: DaySchedule;
   friday: DaySchedule;
   [key: string]: unknown;
}

const Table: React.FC = () => {

   const fetchData = useGetRowsToTable("shifts");
   return (
      <DataTable<User, unknown>
         columns={userColumns}
         queryKey={["shifts"]}
         queryFn={() => fetchData}
         searchableKeys={["shift"]}
      />
   );
};

export default Table;
