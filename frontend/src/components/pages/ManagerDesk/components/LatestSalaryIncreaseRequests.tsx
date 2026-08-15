import type { ColumnDef } from "@tanstack/react-table";

import { JsonTable } from "@/components/shared/json-table";
import Table from "@/components/shared/section/Table";

type SalaryIncreaseRequest = {
  id: string;
  employeeName: string;
  increaseAmount: {
    source: string;
    parsedValue: number;
  };
  status: string;
  createdAt: string;
};

type LatestSalaryIncreaseRequestsProps = {
  requests: SalaryIncreaseRequest[];
};

const salaryIncreaseColumns: ColumnDef<SalaryIncreaseRequest>[] = [
  {
    accessorKey: "employeeName",
    header: "کارمند",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.employeeName}</span>
    ),
  },

  {
    accessorKey: "increaseAmount",
    header: "مبلغ افزایش",
    cell: ({ row }) => {
      const amount = row.original.increaseAmount;

      const value = typeof amount === "object" ? amount?.parsedValue : amount;

      return (
        <span>
          {typeof value === "number" ? value.toLocaleString("fa-IR") : "-"}{" "}
          تومان
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span className="text-muted-foreground">
          {status === "Pending"
            ? "در انتظار بررسی"
            : status === "Approved"
              ? "تأیید شده"
              : status === "Rejected"
                ? "رد شده"
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

const LatestSalaryIncreaseRequests = ({
  requests,
}: LatestSalaryIncreaseRequestsProps) => {
  return (
    <div>
      <Table
        Title="آخرین درخواست‌های افزایش حقوق"
        table={<JsonTable columns={salaryIncreaseColumns} data={requests} />}
      />
    </div>
  );
};

export default LatestSalaryIncreaseRequests;
