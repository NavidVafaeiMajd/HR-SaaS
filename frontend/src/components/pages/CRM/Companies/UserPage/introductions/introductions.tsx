import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import PostLoad from "@/components/ui/postLoad";
import { useGetData } from "@/hook/useGetData";
import { usePostRows } from "@/hook/usePostRows";
import SkeletonLoading from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import type { IntroductionProps } from "../types";

const introductions = ({ queryData }: IntroductionProps) => {
  const {id} = useParams()


  const { data: marketingStaff, isPending: marketingStaffLoading } = useGetData("marketing-staff");

console.log(queryData);
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      marketing_staff_id: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].marketing_staff_id?.toString() || "" : "",
      introduction_date: Array.isArray(queryData) && queryData.length > 0 ? new Date(queryData[0].introduction_date) : new Date(),
      method: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].method || "حضوری" : "حضوری",
      location: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].location || "" : "",
      status: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].status || "در حال پیگیری" : "در حال پیگیری",
    },
  });

  const { mutation } = usePostRows(
    `companies/${id}/introduction`,
    [`companies/${id}`],
    {},
    validation,
    "آشنایی",
    true
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      ...data,
      introduction_date: new Date(data.introduction_date).toISOString().slice(0, 19),
    }
    mutation.mutate(payload);
  };

  if (marketingStaffLoading  ) return <SkeletonLoading />;

  return (
    <div className="relative">
      {mutation.isPending && (<PostLoad />)}
      <div>
        <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
          <span>
            <IoDocumentTextOutline className="w-7 h-7" />
          </span>
          <span> ثبت آشنایی</span>
        </div>
        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Select
                label="پرسنل بازاریابی"
                name="marketing_staff_id"
                required
                placeholder="انتخاب پرسنل بازاریابی"
                options={Array.isArray(marketingStaff) ? marketingStaff.map((staff: any) => ({
                  value: staff.id.toString(),
                  label: `${staff.first_name} ${staff.last_name}`
                })) : []}
              />
              <Form.Date
                label="تاریخ آشنایی"
                name="introduction_date"
              />
            </div>
            <div className="flex gap-5">
              <Form.Select
                label="روش آشنایی"
                name="method"
                required
                placeholder="انتخاب روش آشنایی"
                options={[
                  { value: "حضوری", label: "حضوری" },
                  { value: "تلفنی", label: "تلفنی" },
                  { value: "اینترنتی", label: "اینترنتی" },
                  { value: "تبلیغات", label: "تبلیغات" },
                  { value: "آشنایان", label: "آشنایان" }
                ]}
              />
              <Form.Select
                label="وضعیت"
                name="status"
                placeholder="انتخاب وضعیت"
                options={[
                  { value: "در حال پیگیری", label: "در حال پیگیری" },
                  { value: "کنسل شده", label: "کنسل شده" },
                  { value: "جذب شده", label: "جذب شده" }
                ]}
              />
            </div>
            <div className="flex gap-5">
              <Form.Input
                label="مکان"
                name="location"
                placeholder="مکان (اختیاری)"
              />
            </div>

            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال ثبت..."
                  : "ثبت آشنایی"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default introductions;
