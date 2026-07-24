import { DataTable } from "@/components/shared/data-table";
import { userColumns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";

export interface Roles {
   id: number;
   name: string;
   description: string;
   [key: string]: string | number | boolean | null;
}

const Table: React.FC = () => {

   const fetchRoles = () => useGetRowsToTable("roles");
    
   return (
      <DataTable
         columns={userColumns}
         queryKey={["roles"]}
         queryFn={fetchRoles}
         searchableKeys={["name", "description"]}
      />
   );
};

export default Table;
