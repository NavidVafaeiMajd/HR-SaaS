import { DataTable } from "@/components/shared/data-table";
import { companyColumns } from "./columns";
import { useGetRowsToTable } from "@/hook/useGetRows";

export interface Company {
   id: number;
   first_name: string;
   last_name: string;
   company_name: string;
   business_manager?: string;
   company_address?: string;
   company_email?: string;
   personal_phone?: string;
   company_phone?: string;

   [key: string]: string | number | boolean | null | undefined;
}

const Table: React.FC = () => {

   const fetchCompanies = () => useGetRowsToTable("companies");
    
   return (
      <DataTable
         columns={companyColumns}
         queryKey={["companies"]}
         queryFn={fetchCompanies}
         searchableKeys={["first_name", "last_name", "company_name", "company_email", "personal_phone", "company_phone"]}
      />
   );
};

export default Table;
