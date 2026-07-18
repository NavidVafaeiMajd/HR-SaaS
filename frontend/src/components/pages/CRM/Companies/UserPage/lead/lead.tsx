import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import PostLoad from "@/components/ui/postLoad";
import { usePostRows } from "@/hook/usePostRows";
import { useParams } from "react-router-dom";
import type { LeadProps } from "../types";

const Lead = ({ queryData }: LeadProps) => {
  const {id} = useParams()

console.log(queryData);
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      priority: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].priority || "مهم" : "مهم",
    },
  });

  const { mutation } = usePostRows(
    `companies/${id}/lead`,
    [`companies/${id}`],
    {},
    validation,
    "راهنمایی",
    true
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      ...data,
    }
    mutation.mutate(payload);
  };

  return (
    <div className="relative">
      {mutation.isPending && (<PostLoad />)}
      <div> 
        <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
          <span>
            <IoDocumentTextOutline className="w-7 h-7" />
          </span>
          <span> ثبت سرنخ</span>
        </div>
        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Select
                label="اولویت"
                name="priority"
                required
                placeholder="انتخاب اولویت"
                options={[
                  { value: "کم اهمیت", label: "کم اهمیت" },
                  { value: "مهم", label: "مهم" },
                  { value: "فوری", label: "فوری" },
                ]}
              />
            </div>
            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال ثبت..."
                  : "ثبت سرنخ"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Lead;
