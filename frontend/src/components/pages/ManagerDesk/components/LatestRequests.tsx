import type { ColumnDef } from "@tanstack/react-table";

import { JsonTable } from "@/components/shared/json-table";
import Table from "@/components/shared/section/Table";

type LatestRequest = {
  id: string;
  type: "SalaryIncrease" | "Leave";
  employeeName: string;
  createdAt: string;
};

type LatestRequestsProps = {
  requests: LatestRequest[];
};

const requestColumns: ColumnDef<LatestRequest>[] = [
  {
    accessorKey: "employeeName",
    header: "کارمند",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.employeeName}</span>
    ),
  },

  {
    accessorKey: "type",
    header: "نوع درخواست",
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <span className="text-muted-foreground">
          {type === "Leave"
            ? "درخواست مرخصی"
            : type === "SalaryIncrease"
              ? "درخواست افزایش حقوق"
              : "نامشخص"}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "تاریخ درخواست",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return (
        <span className="text-muted-foreground">
          {date.toLocaleDateString("fa-IR")}
        </span>
      );
    },
  },
];

const LatestRequests = ({ requests }: LatestRequestsProps) => {
  return (
    <div>
      <Table
        Title="آخرین درخواست‌ها"
        table={<JsonTable columns={requestColumns} data={requests} />}
      />
    </div>
  );
};

export default LatestRequests;
