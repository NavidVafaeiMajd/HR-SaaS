import type { ColumnDef } from "@tanstack/react-table";
import type { Company } from "./Table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { validation } from "./validation";
import React from "react";
import ActionsCell from "@/components/shared/ActionsCell";

// Create a component for the actions cell to avoid hook issues
const ActionsCells = React.memo(({ row }: { row: any }) => {
  const deleteRow = useDeleteRows({
    url: "companies",
    queryKey: ["companies"],
  });

  const { mutation } = useUpdateRows(
    `companies/${row.original.id}`,
    ["companies"],
    validation,
    "شرکت"
  );

  const company = row.original;

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="ویرایش شرکت"
        triggerLabel="ویرایش"
        fields={
          <>
            <div className="flex flex-col md:flex-row gap-5">
              <Form.Input
                name="full_name"
                label=" مدیر بازرگانی"
                required
                placeholder="مدیر بازرگانی"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <Form.Input
                name="company_name"
                label="نام شرکت"
                required
                placeholder="نام شرکت"
              />
              <Form.Input
                name="business_manager"
                label="مدیر کسب و کار"
                placeholder="مدیر کسب و کار (اختیاری)"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <Form.Input
                name="company_address"
                label="آدرس شرکت"
                placeholder="آدرس شرکت (اختیاری)"
              />
              <Form.Input
                name="company_email"
                label="ایمیل شرکت"
                placeholder="ایمیل شرکت (اختیاری)"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <Form.Input
                name="personal_phone"
                label="تلفن شخصی"
                placeholder="تلفن شخصی (اختیاری)"
              />
              <Form.Input
                name="company_phone"
                label="تلفن شرکت"
                placeholder="تلفن شرکت (اختیاری)"
              />
            </div>
          </>
        }
        defaultValues={{
          full_name: String(company.full_name || ""),
          company_name: String(company.company_name || ""),
          business_manager: String(company.business_manager || ""),
          company_address: String(company.company_address || ""),
          company_email: String(company.company_email || ""),
          personal_phone: String(company.personal_phone || ""),
          company_phone: String(company.company_phone || ""),
        }}
        onSave={(data) => {
          mutation.mutate(data);
        }}
        schema={validation}
      />
      <ActionsCell
        actions={[
          { label: "نمایش جزییات", path: `/crm/companies/${company.id}` },
        ]}
      />
      <DeleteDialog
        title="حذف شرکت"
        description={`آیا از حذف شرکت "${company.company_name}" اطمینان دارید؟`}
        onConfirm={() => {
          deleteRow.mutate(company.id);
        }}
      />
    </div>
  );
});

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          نام شرکت
        </Button>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          مدیربازرگانی
        </Button>
      );
    },
  },
  {
    accessorKey: "business_manager",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          مدیر عامل
        </Button>
      );
    },
    cell(props) {
      const business_manager = props.getValue() as string;
      return (
        <span className="max-w-xs truncate">
          {business_manager || "ثبت نشده"}
        </span>
      );
    },
  },
  {
    accessorKey: "company_address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          آدرس شرکت
        </Button>
      );
    },
    cell(props) {
      const address = props.getValue() as string;
      return <span className="max-w-xs truncate">{address || "ثبت نشده"}</span>;
    },
  },
  {
    accessorKey: "personal_phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تلفن مدیر بازرگانی
        </Button>
      );
    },
    cell(props) {
      const phone = props.getValue() as string;
      return <span className="max-w-xs truncate">{phone || "ثبت نشده"}</span>;
    },
  },
  {
    accessorKey: "company_phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <LuArrowUpDown className="ml-2 h-4 w-4" />
          تلفن شرکت
        </Button>
      );
    },
    cell(props) {
      const phone = props.getValue() as string;
      return <span className="max-w-xs truncate">{phone || "ثبت نشده"}</span>;
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    cell: ({ row }) => <ActionsCells row={row} />,
    header: () => {
      return <span className="font-normal">عملیات</span>;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
