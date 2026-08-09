import { useEffect } from "react";
import { validation } from "./validation";
import type z from "zod";
import { Form } from "@/components/shared/Form";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./columns";
import SectionCol from "@/components/shared/section/SectionCol";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { usePostRows } from "@/hook/usePostRows";

const LeaveType = () => {
  useEffect(() => {
    document.title = "نوع مرخصی";
  }, []);

const defaultValues = {
  Name: "",
  AnnualLimit: 0,
  IsActive: true,
  IsPaid: true,
  Description: "",
};

  const { mutation, form } = usePostRows(
    "leave-types",
    ["leave-types"],
    defaultValues,
    validation,
    "مرخصی",
    true,
  );

  const fetchLeavesType = () => useGetRowsToTable("leave-types");
  const onSubmit = (data: z.infer<typeof validation>) => {
    mutation.mutate(data);
  };
  return (
    <div>
      <SectionCol
        form={form}
        defaultValues={defaultValues}
        table={
          <DataTable
            columns={columns}
            queryKey={["leave-types"]}
            queryFn={fetchLeavesType}
            searchableKeys={["type_name"]}
          />
        }
        onSubmit={onSubmit}
        FirstTitle=" ثبت جدید نوع مرخصی "
        SecoundTitle="  لیست همه انواع مرخصی ها "
        schema={validation}
        formFields={
          <>
            <Form.Input
              label="نوع مرخصی"
              name="Name"
              placeholder="نوع مرخصی"
              required
            />

            <Form.Input
              label="روزها در سال"
              name="AnnualLimit"
              placeholder="روزها در سال"
              required
            />
            <Form.Select
              label="وضعیت"
              name="IsActive"
              placeholder="انتخاب وضعیت"
              options={[
                { label: "فعال", value: true },
                { label: "غیرفعال", value: false },
              ]}
              required
            />
            <Form.Select
              label=" وضعیت حقوق"
              name="IsPaid"
              placeholder="انتخاب وضعیت"
              options={[
                { label: "با حقوق", value: true },
                { label: "بدون حقوق", value: false },
              ]}
              required
            />
            <Form.Textarea
              label=" توضیحات "
              name="Description"
              placeholder="توضیحات "
              required
            />
          </>
        }
      />
    </div>
  );
};

export default LeaveType;
