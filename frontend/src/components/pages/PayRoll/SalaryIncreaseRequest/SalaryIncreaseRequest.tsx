import { useEffect } from "react";
import type z from "zod";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { DataTable } from "@/components/shared/data-table";
import { Form } from "@/components/shared/Form";
import { useGetRowsToTable } from "@/hook/useGetRows";
import { usePostRows } from "@/hook/usePostRows";
import { columns } from "./columns";
import { validation } from "./validation";

const defaultValues = {
  requestedBaseSalary: 0,
  effectiveFrom: null,
  reason: "",
};

const SalaryIncreaseRequest = () => {
  useEffect(() => {
    document.title = "درخواست‌های افزایش حقوق";
  }, []);

  const { mutation, form } = usePostRows(
    "salary-increase-request",
    ["salary-increase-request"],
    defaultValues,
    validation,
    "درخواست افزایش حقوق",
    true,
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const date = new DateObject(data.effectiveFrom).convert(persian);

    mutation.mutate({
      requestedBaseSalary: data.requestedBaseSalary,
      effectiveYear: date.year,
      effectiveMonth: date.month.number,
      reason: data.reason || null,
    });
  };

  const formFields = (
    <div className="relative grid gap-5 md:grid-cols-2">
      {mutation.isPending && <div className="absolute inset-0 z-10 flex items-center justify-center bg-bgBack/90"><span>در حال بارگذاری...</span></div>}
      <Form.PriceInput name="requestedBaseSalary" label="حقوق پایهٔ درخواستی" placeholder="مبلغ حقوق پایه" required />
      <Form.Date name="effectiveFrom" label="تاریخ اثر افزایش" onlyMonthPicker />
      <Form.Textarea name="reason" label="دلیل درخواست" placeholder="دلیل افزایش حقوق" />
    </div>
  );

  return (
    <SectionAcc
      form={form}
      defaultValues={defaultValues}
      schema={validation}
      formFields={formFields}
      onSubmit={onSubmit}
      table={<DataTable columns={columns} queryKey={["salary-increase-request"]} queryFn={() => useGetRowsToTable("salary-increase-request")} searchableKeys={["firstName", "lastName", "personnelCode", "status"]} />}
      FirstTitle="ثبت درخواست جدید افزایش حقوق"
      SecoundTitle="لیست درخواست‌های افزایش حقوق"
    />
  );
};

export default SalaryIncreaseRequest;
