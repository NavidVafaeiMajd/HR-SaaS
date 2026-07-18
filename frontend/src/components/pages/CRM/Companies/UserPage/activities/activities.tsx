import { Form } from "@/components/shared/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import PostLoad from "@/components/ui/postLoad";
import { useGetData } from "@/hook/useGetData";
import { usePostRows } from "@/hook/usePostRows";
import SkeletonLoading from "@/components/ui/skeleton";
import SectionAcc from "@/components/shared/section/SectionAcc";
import Table from "./Table";
import { useParams } from "react-router-dom";

const Activities = () => {
  const { id } = useParams();
  // Fetch data for dropdowns
  const { data: marketingStaff, isPending: marketingStaffLoading } = useGetData("marketing-staff");

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      name: "",
      marketing_staff_id: "",
      activity_date: new Date(),
      type: "حضوری",
      note: "",
    },
  });

  const { mutation } = usePostRows(
    `companies/${id}/activities`,
    ["activities"],
    {},
    validation,
    "فعالیت",
    true
  );

  const formFields = (
    <div className="relative">
      {mutation.isPending && <PostLoad />}
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input name="name" label="نام فعالیت" required placeholder="نام فعالیت" />
        <Form.Select
          name="marketing_staff_id"
          label="پرسنل بازاریابی"
          required
          placeholder="انتخاب پرسنل بازاریابی"
          options={Array.isArray(marketingStaff) ? marketingStaff.map((staff: any) => ({
            value: staff.id.toString(),
            label: `${staff.first_name} ${staff.last_name}`
          })) : []}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">

        <Form.Select
          name="type"
          label="نوع فعالیت"
          required
          placeholder="انتخاب نوع فعالیت"
          options={[
            { value: "حضوری", label: "حضوری" },
            { value: "تلفنی", label: "تلفنی" }
          ]}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Date name="activity_date" label="تاریخ فعالیت" />
        <Form.Input name="note" label="یادداشت" placeholder="یادداشت (اختیاری)" />
      </div>
    </div>
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      ...data,
      activity_date: new Date(data.activity_date).toISOString().slice(0, 19),
      }
    console.log(payload);
    mutation.mutate(payload);
  };

  if (marketingStaffLoading  ) return <SkeletonLoading />;

  return (
    <>
      <SectionAcc
        form={form}
        formFields={formFields}
        onSubmit={onSubmit}
        table={<Table />}
        FirstTitle="ثبت جدید فعالیت"
        SecoundTitle="لیست همه فعالیت‌ها"
        schema={validation}
        defaultValues={{
          name: "",
          marketing_staff_id: "",
          activity_date: new Date(),
          type: "حضوری",
          note: "",
        }}
      />
    </>
  );
};

export default Activities;