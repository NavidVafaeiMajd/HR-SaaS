import { DataTable } from "@/components/shared/data-table";
import { activityColumns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { useParams } from "react-router-dom";

export interface Activity {
   id: number;
   name: string;
   marketing_staff_id: number;
   pipeline_id: number;
   activity_date: string;
   type: string;
   note?: string;
   marketing_staff?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      created_at: string;
      updated_at: string;
   };
   pipeline?: {
      id: number;
      company_id: number;
      stage: string;
      created_at: string;
      updated_at: string;
   };

   [key: string]: string | number | boolean | null | undefined | any;
}

const Table: React.FC = () => {
   const { id } = useParams()
   const fetchActivities = () => useGetRowsToTable(`companies/${id}/activities`);
    
   return (
      <DataTable
         columns={activityColumns}
         queryKey={["activities", id as string]}
         queryFn={fetchActivities}
         searchableKeys={["name", "type", "note", "marketing_staff.first_name", "marketing_staff.last_name"]}
      />
   );
};

export default Table;
