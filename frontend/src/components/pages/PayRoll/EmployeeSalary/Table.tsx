import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";

export interface User {
   id: number;
   user: object;
   exitType: string;
   exitTime: string;
   meeting: boolean;
   acouuntdis: boolean;
   [key: string]: unknown;
}

const Table: React.FC = () => {

   const fetchNewsList = () => useGetRowsToTable("employee-salary");


   return (
      <DataTable
      columns={columns}
      queryKey={["employee-salary"]}
      queryFn={fetchNewsList}
         searchableKeys={["name", "position", "phone", "accessLevel"]}
      />
   );
};

export default Table;
