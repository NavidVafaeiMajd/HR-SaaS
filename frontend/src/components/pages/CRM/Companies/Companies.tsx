import { useEffect } from "react";
import Table from "./Table";
import { Form } from "@/components/shared/Form";
import z from "zod";
import { validation } from "./validation";
import { usePostRows } from "@/hook/usePostRows";
import SectionAcc from "@/components/shared/section/SectionAcc";
import PostLoad from "@/components/ui/postLoad";

const Companies: React.FC = () => {
  const title = "شرکت‌ها";
  useEffect(() => {
    document.title = title;
  }, []);

  const defaultValues = {
    full_name: "",
    company_name: "",
    business_manager: "",
    company_address: "",
    company_email: "",
    personal_phone: "",
    company_phone: "",
  };

  const { mutation, form } = usePostRows(
    "companies",
    ["companies"],
    defaultValues,
    validation,
    "شرکت",
    true
  );

  const formFields = (
    <div className="relative">
      {mutation.isPending && <PostLoad/>}
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input name="full_name" label="نام" required placeholder="نام" />
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
    </div>
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <>
      <SectionAcc
        form={form}
        formFields={formFields}
        onSubmit={onSubmit}
        table={<Table />}
        FirstTitle="ثبت جدید شرکت"
        SecoundTitle="لیست همه شرکت‌ها"
        schema={validation}
        defaultValues={defaultValues}
      />
    </>
  );
};

export default Companies;