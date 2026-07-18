import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EditDialog } from "@/components/shared/EditDialog";
import { Form } from "@/components/shared/Form";
import { useDeleteRows } from "@/hook/useDeleteRows";
import { useUpdateRows } from "@/hook/useUpdateRows";
import { validation } from "./validation";
import type { TecherInfoType } from "./column";
import React from "react";

interface ActionsCellProps {
  row: TecherInfoType;
}

export const ActionsCell = React.memo(({ row }: ActionsCellProps) => {
  const deleteRow = useDeleteRows({
    url: "teachers",
    queryKey: ["teachers"],
  });
  
  const { mutation } = useUpdateRows(
    `teachers/${row.id}`,
    ["teachers"],
    validation,
    "مدرس"
  );

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="ویرایش مدرس"
        triggerLabel="ویرایش"
        fields={
          <>
            <Form.Input name="first_name" label="نام" required />
            <Form.Input name="last_name" label="نام خانوادگی" required />
            <Form.Input name="phone" label="شماره تماس" required />
            <Form.Input name="email" label="ایمیل" required />
            <Form.Textarea name="specialty" label="تخصص" required />
            <Form.Textarea name="address" label="نشانی" />
          </>
        }
        defaultValues={{
          first_name: String(row.first_name || ""),
          last_name: String(row.last_name || ""),
          phone: String(row.phone || ""),
          email: String(row.email || ""),
          specialty: String(row.specialty || ""),
          address: String(row.address || ""),
        }}
        onSave={(data) => {
          mutation.mutate(data);
        }}
        schema={validation}
      />
      <DeleteDialog
        onConfirm={() => {
          deleteRow.mutate(Number(row.id));
        }}
      />
    </div>
  );
});
