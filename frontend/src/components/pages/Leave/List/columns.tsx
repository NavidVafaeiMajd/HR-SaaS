import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EditDialog } from "@/components/shared/EditDialog";
import { z } from "zod";
import { Form } from "@/components/shared/Form";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { useEmployees } from "@/hook/useEmployees";
import { useGetData } from "@/hook/useGetData";

type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Canceled";

export interface LeaveRequest {
  id: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
  };

  leaveType: {
    id: string;
    name: string;
  };

  startDate: string;
  endDate: string;

  totalDays: number;

  reason?: string | null;

  status: LeaveStatus;

  approvedBy?: {
    id: string;
    userName?: string;
  } | null;

  approvalComment?: string | null;

  approvedAt?: string | null;

  createdAt: string;
  updatedAt?: string | null;
}

const validation = z.object({
  leaveTypeId: z.string().min(1, "انتخاب نوع مرخصی الزامی است"),
  startDate: z.date({
    message: "تاریخ شروع الزامی است",
  }),

  endDate: z.date({
    message: "تاریخ پایان الزامی است",
  }),

  reason: z.string().optional(),
});

const statusMap: Record<
  LeaveStatus,
  {
    label: string;
    className: string;
  }
> = {
  Pending: {
    label: "در حال بررسی",
    className: "bg-yellow-100 text-yellow-800",
  },

  Approved: {
    label: "تایید شده",
    className: "bg-green-100 text-green-800",
  },

  Rejected: {
    label: "رد شده",
    className: "bg-red-100 text-red-800",
  },

  Canceled: {
    label: "لغو شده",
    className: "bg-gray-100 text-gray-800",
  },
};

const LeaveActions = ({ row }: { row: LeaveRequest }) => {
  const { mutation } = useUpdateRows(
    `leave-list/${row.id}`,
    ["leaves"],
    validation,
    "مرخصی",
  );
  const { mutation: UpdateApprove } = useUpdateRows(
    `leave-list/${row.id}/approve`,
    ["leaves"],
    {},
    "تایید",
  );
  const { mutation: UpdateCancel } = useUpdateRows(
    `leave-list/${row.id}/cancel`,
    ["leaves"],
    {},
    "لغو",
  );
  const { mutation: UpdateReject } = useUpdateRows(
    `leave-list/${row.id}/reject`,
    ["leaves"],
    {},
    "عدم تایید",
  );

  const deleteRow = useDeleteRows({
    url: "leave-list",
    queryKey: ["leaves"],
  });

  const { data: leaveTypes } = useGetData("leave-types");

  const leaveTypeOptions = Array.isArray(leaveTypes)
    ? leaveTypes.map((item: any) => ({
        value: String(item.id),
        label: item.name,
      }))
    : [];

  return (
    <div className="flex items-center gap-2">
      <Link to={`/leave/details/${row.id}`}>
        <Button size="sm">نمایش جزئیات</Button>
      </Link>
      <Button
        onClick={() => {
          UpdateApprove.mutate({});
        }}
      >
        تایید
      </Button>
      <EditDialog
        btnTitle="عدم تایید"
        title="فرم عدم تایید"
      triggerLabel="عدم تایید"
        fields={
          <>
            <Form.Textarea
              label="دلیل عدم تایید"
              name="comment"
              placeholder="دلیل عدم تایید"
            />
          </>
        }
        defaultValues={{
          comment: "",
        }}
        onSave={(data) => {
          const formattedData = {
            comment: data.comment || null,
          };

          UpdateReject.mutate(formattedData);
        }}
        schema={z.object({
          comment: z.string().optional(),
        })}
      />
      <Button
        onClick={() => {
          UpdateCancel.mutate({});
        }}
      >
        لغو کردن
      </Button>

      <EditDialog
        fields={
          <>
            <Form.Select
              label="نوع مرخصی"
              name="leaveTypeId"
              placeholder="انتخاب نوع مرخصی"
              options={leaveTypeOptions}
              required
            />

            <div className="flex gap-5">
              <Form.Date label="تاریخ شروع" name="startDate" />

              <Form.Date label="تاریخ پایان" name="endDate" />
            </div>

            <Form.Textarea
              label="دلیل مرخصی"
              name="reason"
              placeholder="دلیل مرخصی"
            />
          </>
        }
        defaultValues={{
          leaveTypeId: String(row.leaveType.id),

          startDate: new Date(row.startDate),

          endDate: new Date(row.endDate),

          reason: row.reason || "",
        }}
        onSave={(data) => {
          const formattedData = {
            LeaveTypeId: data.leaveTypeId,
            UserId: data.userId,
            StartDate: data.startDate.toISOString().slice(0, 10),

            EndDate: data.endDate.toISOString().slice(0, 10),

            Reason: data.reason || null,
          };

          mutation.mutate(formattedData);
        }}
        schema={validation}
      />

      <DeleteDialog
        onConfirm={() => {
          deleteRow.mutate(row.id);
        }}
      />
    </div>
  );
};

export const leaveColumns: ColumnDef<LeaveRequest>[] = [
  {
    accessorKey: "user",

    header: "کارمند",

    cell: ({ row }) => {
      const user = row.original.user;

      return (
        <span>
          {user?.firstName} {user?.lastName}
        </span>
      );
    },
  },

  {
    accessorKey: "leaveType",

    header: "نوع مرخصی",

    cell: ({ row }) => {
      return <span>{row.original.leaveType?.name || "—"}</span>;
    },
  },

  {
    id: "duration",

    header: "مدت زمان مرخصی",

    cell: ({ row }) => {
      const start = new Date(row.original.startDate).toLocaleDateString(
        "fa-IR",
      );

      const end = new Date(row.original.endDate).toLocaleDateString("fa-IR");

      return (
        <span>
          از {start} تا {end}
        </span>
      );
    },
  },

  {
    accessorKey: "totalDays",

    header: "روزها",

    cell: ({ row }) => {
      return <span>{row.original.totalDays} روز</span>;
    },
  },

  {
    accessorKey: "status",

    header: "وضعیت",

    cell: ({ row }) => {
      const status = row.original.status;

      const statusInfo = statusMap[status] || {
        label: "نامشخص",
        className: "bg-gray-100 text-gray-800",
      };

      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",

    header: "تاریخ درخواست",

    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return <span>{date.toLocaleDateString("fa-IR")}</span>;
    },
  },

  {
    id: "actions",

    header: "عملیات",

    cell: ({ row }) => {
      return <LeaveActions row={row.original} />;
    },
  },
];
