import { DataTable } from "@/components/shared/data-table";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { columns } from "./columns";
import Table from "@/components/shared/section/Table";

const Notifications: React.FC = () => {
  const fetchNotifications = () => useGetRowsToTable("notifications");

  return (
    <Table
      Title="لیست همه اعلان ها"
      table={
        <DataTable
          columns={columns}
          queryKey={["notifications"]}
          queryFn={fetchNotifications}
          searchableKeys={["title", "message", "type"]}
        />
      }
    />
  );
};

export default Notifications;
