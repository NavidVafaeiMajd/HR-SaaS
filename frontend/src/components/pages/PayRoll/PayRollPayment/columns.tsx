import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { Form } from "@/components/shared/Form";
import { EditDialog } from "@/components/shared/EditDialog";
import { z } from "zod";
import { useUpdateRows } from "@/hook/useUpdateRows";

export interface PayRollPaymentListColumnProps extends Record<string, unknown> {
  userId: string;

  firstName: string;
  lastName: string;

  attendanceId: number | null;

  date: string;

  status:
    | "Present"
    | "Absent"
    | "Leave"
    | "Mission"
    | "Remote"
    | "SickLeave"
    | null;

  checkIn: string | null;
  checkOut: string | null;

  workedMinutes: number | null;
  lateMinutes: number | null;
  earlyLeaveMinutes: number | null;
  overtimeMinutes: number | null;

  description: string | null;
}

export const statusLabels: Record<
  NonNullable<PayRollPaymentListColumnProps["status"]>,
  string
> = {
  Present: "حاضر",
  Absent: "غایب",
  Leave: "مرخصی",
  Mission: "ماموریت",
  Remote: "دورکاری",
  SickLeave: "مرخصی استعلاجی",
};

export const formatMinutes = (minutes: number | null) => {
  if (minutes === null || minutes === undefined) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} دقیقه`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ساعت`;
  }

  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};

const normalizeTime = (time: string | null | undefined) => {
  if (!time) return null;

  return time.slice(0, 5);
};

const PayRollPaymentActions = ({ row }: { row: any }) => {
  const { mutation: UpdatePresent } = useUpdateRows(
    `attendance/${row.userId}/present`,
    ["attendances"],
    {},
    "حاضر",
  );

  const { mutation: UpdateAbsent } = useUpdateRows(
    `attendance/${row.userId}/absent`,
    ["attendances"],
    {},
    "غیبت",
  );
  const { mutation: UpdateStatus } = useUpdateRows(
    `attendance/${row.userId}/status`,
    ["attendances"],
    {},
    "وضعیت حال حاضر",
  );

  switch (row.status) {
    case "OutOfShift":
      return <> </>;
      break;
    case "Leave":
      return <> </>;
      break;
    case "Present":
      return (
        <div className="flex gap-3">
          <EditDialog
            btnTitle="تغییر ساعت ورود و خروج"
            title="فرم تغییر ساعت ورود و خروج"
            triggerLabel="تغییر ساعت ورود و خروج"
            variant="outline"
            fields={
              <>
                <Form.TimePicker
                  label=" ساعت ورود "
                  name="checkIn"
                  placeholder=" ساعت ورود "
                />
                <Form.TimePicker
                  label=" ساعت خروج "
                  name="checkOut"
                  placeholder=" ساعت خروج "
                />
              </>
            }
            defaultValues={{
              checkIn: normalizeTime(row.checkIn),
              checkOut: normalizeTime(row.checkOut),
            }}
            onSave={(data) => {
              const payload = {
                checkIn: normalizeTime(data.checkIn),
                checkOut: normalizeTime(data.checkOut),
              };
              UpdatePresent.mutate(payload);
            }}
            schema={z.object({
              checkIn: z.string().optional(),
              checkOut: z.string().optional(),
            })}
          />
          <EditDialog
            btnTitle="تغییر وضعیت فعلی "
            title="فرم تغییر وضعیت فعلی"
            triggerLabel="تغییر وضعیت فعلی   "
            variant="outline"
            fields={
              <>
                <Form.Select
                  label=" وضعیت فعلی را تغییر دهید "
                  options={[
                    { label: "حاضر", value: "Present" },
                    { label: "عایب", value: "Absent" },
                  ]}
                  name="status"
                  placeholder=" انتخاب وضعیت بعدی "
                />
                <Form.Textarea
                  label=" توضیحات  "
                  name="description"
                  placeholder=" دلیل غیبت ....  "
                />
              </>
            }
            defaultValues={{
              status: row.status,
              description: row.description,
            }}
            onSave={(data) => {
              UpdateStatus.mutate(data);
            }}
            schema={z.object({
              status: z.string().optional(),
              description: z.string().optional(),
            })}
          />
        </div>
      );
      break;
    case "Absent":
      return (
        <EditDialog
          btnTitle="تغییر وضعیت فعلی "
          title="فرم تغییر وضعیت فعلی"
          triggerLabel="تغییر وضعیت فعلی   "
          variant="outline"
          fields={
            <>
              <Form.Select
                label=" وضعیت فعلی را تغییر دهید "
                options={[
                  { label: "حاضر", value: "Present" },
                  { label: "عایب", value: "Absent" },
                ]}
                name="status"
                placeholder=" انتخاب وضعیت بعدی "
              />
              <Form.Textarea
                label=" توضیحات  "
                name="description"
                placeholder=" دلیل غیبت ....  "
              />
            </>
          }
          defaultValues={{
            status: row.status,
            description: row.description,
          }}
          onSave={(data) => {
            UpdateStatus.mutate(data);
          }}
          schema={z.object({
            status: z.string().optional(),
            description: z.string().optional(),
          })}
        />
      );
      break;
    default:
      console.log(`Sorry, we are out .`);
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2">
        <EditDialog
          btnTitle="ثبت غایب"
          title="غایب"
          triggerLabel="غایب"
          variant="outline"
          fields={
            <>
              <Form.Textarea
                label=" توضیحات  "
                name="description"
                placeholder=" دلیل غیبت ....  "
              />
            </>
          }
          defaultValues={{
            description: "",
          }}
          onSave={(data) => {
            UpdateAbsent.mutate(data);
          }}
          schema={z.object({
            description: z.string().min(1, "نوشتن توضیحات لازم است."),
          })}
        />
        <EditDialog
          btnTitle="تغییر ساعت ورود و خروج"
          title="حاضر"
          triggerLabel="حاضر"
          variant="outline"
          fields={
            <>
              <Form.TimePicker
                label=" ساعت ورود "
                name="checkIn"
                placeholder=" ساعت ورود "
              />
              <Form.TimePicker
                label=" ساعت خروج "
                name="checkOut"
                placeholder=" ساعت خروج "
              />
            </>
          }
          defaultValues={{
            checkIn: row.checkIn,
            checkOut: row.checkOut,
          }}
          onSave={(data) => {
            const payload = {
              checkIn: normalizeTime(data.checkIn),
              checkOut: normalizeTime(data.checkOut),
            };
            UpdatePresent.mutate(payload);
          }}
          schema={z.object({
            checkIn: z.string().optional(),
            checkOut: z.string().optional(),
          })}
        />
      </div>
    </div>
  );
};

export const columns: ColumnDef<PayRollPaymentListColumnProps>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        کارمند
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return `${firstName} ${lastName}`;
    },
  },

  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        تاریخ
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);

      return date.toLocaleDateString("fa-IR");
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        وضعیت
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      return status ? statusLabels[status] : "ثبت نشده";
    },
  },

  {
    accessorKey: "checkIn",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان ورود
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.checkIn ?? "—";
    },
  },

  {
    accessorKey: "checkOut",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        زمان خروج
      </Button>
    ),
    cell: ({ row }) => {
      return row.original.checkOut ?? "—";
    },
  },

  {
    accessorKey: "lateMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        تاخیر
      </Button>
    ),
    cell: ({ row }) => {
      return formatMinutes(row.original.lateMinutes);
    },
  },

  {
    accessorKey: "earlyLeaveMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        ترک زودهنگام
      </Button>
    ),
    cell: ({ row }) => {
      return formatMinutes(row.original.earlyLeaveMinutes);
    },
  },

  {
    accessorKey: "workedMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        مجموع کار
      </Button>
    ),
    cell: ({ row }) => {
      return formatMinutes(row.original.workedMinutes);
    },
  },

  {
    accessorKey: "overtimeMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <LuArrowUpDown className="ml-2 h-4 w-4" />
        اضافه کاری
      </Button>
    ),
    cell: ({ row }) => {
      return formatMinutes(row.original.overtimeMinutes);
    },
  },
  {
    id: "actions",

    header: "عملیات",

    cell: ({ row }) => {
      return <PayRollPaymentActions row={row.original} />;
    },
  },
];
