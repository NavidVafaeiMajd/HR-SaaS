import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { z } from "zod";

export interface SalaryIncreaseRequestColumnProps extends Record<string, unknown> {
  id: string;
  firstName: string;
  lastName: string;
  personnelCode: string | null;
  currentBaseSalary: number;
  requestedBaseSalary: number;
  increaseAmount: number;
  increasePercentage: number;
  effectiveYear: number;
  effectiveMonth: number;
  reason: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Canceled";
  rejectionReason: string | null;
  createdAt: string;
}

const monthLabels: Record<number, string> = { 1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور", 7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند" };
const money = (value: number) => `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

const statusLabels: Record<SalaryIncreaseRequestColumnProps["status"], string> = {
  Pending: "در انتظار بررسی", Approved: "تأیید شده", Rejected: "رد شده", Canceled: "لغو شده",
};

const approveSchema = z.object({ status: z.literal("Approved"), rejectionReason: z.string().optional() });
const rejectSchema = z.object({ status: z.literal("Rejected"), rejectionReason: z.string().min(1, "دلیل رد درخواست الزامی است") });
const cancelSchema = z.object({ status: z.literal("Canceled"), rejectionReason: z.string().optional() });

const RequestActions = ({ request }: { request: SalaryIncreaseRequestColumnProps }) => {
  const { mutation } = useUpdateRows(`salary-increase-request/${request.id}/status`, ["salary-increase-request"], "وضعیت درخواست");

  if (request.status !== "Pending") return <span className="text-sm text-muted-foreground">نهایی شده</span>;

  return (
    <div className="flex flex-wrap gap-2">
      <EditDialog title="تأیید درخواست" triggerLabel="تأیید" btnTitle="تأیید درخواست" schema={approveSchema} defaultValues={{ status: "Approved", rejectionReason: "" }} fields={<p className="text-sm">آیا از تأیید این درخواست مطمئن هستید؟</p>} onSave={(data) => mutation.mutate(data)} />
      <EditDialog title="رد درخواست" triggerLabel="رد" btnTitle="ثبت رد درخواست" schema={rejectSchema} defaultValues={{ status: "Rejected", rejectionReason: "" }} fields={<Form.Textarea name="rejectionReason" label="دلیل رد درخواست" required />} onSave={(data) => mutation.mutate(data)} />
      <EditDialog title="لغو درخواست" triggerLabel="لغو" btnTitle="لغو درخواست" variant="outline" schema={cancelSchema} defaultValues={{ status: "Canceled", rejectionReason: "" }} fields={<p className="text-sm">آیا از لغو این درخواست مطمئن هستید؟</p>} onSave={(data) => mutation.mutate(data)} />
    </div>
  );
};

export const columns: ColumnDef<SalaryIncreaseRequestColumnProps>[] = [
  { id: "employee", header: "کارمند", cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}` },
  { accessorKey: "personnelCode", header: "کد پرسنلی", cell: ({ row }) => row.original.personnelCode || "—" },
  { accessorKey: "currentBaseSalary", header: "حقوق فعلی", cell: ({ row }) => money(row.original.currentBaseSalary) },
  { accessorKey: "requestedBaseSalary", header: "حقوق درخواستی", cell: ({ row }) => money(row.original.requestedBaseSalary) },
  { accessorKey: "increaseAmount", header: "میزان افزایش", cell: ({ row }) => money(row.original.increaseAmount) },
  { accessorKey: "increasePercentage", header: "درصد افزایش", cell: ({ row }) => `${new Intl.NumberFormat("fa-IR").format(row.original.increasePercentage)}٪` },
  { id: "effectiveDate", header: "تاریخ اثر", cell: ({ row }) => `${monthLabels[row.original.effectiveMonth]} ${row.original.effectiveYear}` },
  { accessorKey: "reason", header: "دلیل درخواست", cell: ({ row }) => row.original.reason || "—" },
  { accessorKey: "rejectionReason", header: "دلیل رد", cell: ({ row }) => row.original.rejectionReason || "—" },
  { accessorKey: "status", header: "وضعیت", cell: ({ row }) => statusLabels[row.original.status] },
  { id: "actions", header: "عملیات", cell: ({ row }) => <RequestActions request={row.original} /> },
];
