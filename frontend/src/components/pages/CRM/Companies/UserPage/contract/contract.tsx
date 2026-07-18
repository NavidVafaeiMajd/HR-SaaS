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
import type { ContractProps } from "../types";

const Contract = ({ queryData }: ContractProps) => {
  const {id} = useParams()

console.log(queryData);
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      contract_date: Array.isArray(queryData) && queryData.length > 0 ? new Date(queryData[0].contract_date) : new Date(),
      amount: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].amount?.toString() || "0" : "0",
      delivery_date: Array.isArray(queryData) && queryData.length > 0 ? new Date(queryData[0].delivery_date) : new Date(),
    },
  });

  console.log(queryData)
  const { mutation } = usePostRows(
    `companies/${id}/contract`,
    ["company-details", id as string],
    {},
    validation,
    "قرارداد",
    true
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      ...data,
      contract_date: new Date(data.contract_date).toISOString().slice(0, 19),
      delivery_date: new Date(data.delivery_date).toISOString().slice(0, 19),
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
          <span> ثبت قرارداد</span>
        </div>
        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Date
                label="تاریخ قرارداد"
                name="contract_date"
              />
              <Form.PriceInput
                label="مبلغ"
                name="amount"
                required
                placeholder="مبلغ قرارداد"
              />
            </div>
            <div className="flex gap-5">
              <Form.Date
                label="تاریخ عقد پروزه"
                name="delivery_date"
              />
            </div>
            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال ثبت..."
                  : "ثبت قرارداد"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contract;
