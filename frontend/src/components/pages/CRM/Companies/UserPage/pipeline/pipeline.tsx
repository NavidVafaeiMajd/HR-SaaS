import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import PostLoad from "@/components/ui/postLoad";
import { usePostRows } from "@/hook/usePostRows";
import Table from "@/components/shared/section/Table";
import { JsonTable } from "@/components/shared/json-table";
import { stageChangeColumns } from "./stageChangeColumns";
import type { PipelineProps } from "../types";
import { useParams } from "react-router-dom";

const Pipeline = ({ queryData }: PipelineProps) => {

  const {id} = useParams()

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      stage: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].stage || "ارتباط" : "ارتباط",
      new_stage: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].new_stage || "ارتباط" : "ارتباط",
      changed_at: Array.isArray(queryData) && queryData.length > 0 ? new Date(queryData[0].changed_at || new Date()) : new Date(),
      note: Array.isArray(queryData) && queryData.length > 0 ? queryData[0].note || "" : "",
    },
  });

  const { mutation } = usePostRows(
    `pipeline-stage-changes`,
    [`companies/${id}`],
    {},
    validation,
    "کاریز",
    true
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      previous_stage: data.stage,
      new_stage: data.new_stage,
      changed_at: new Date(data.changed_at).toISOString().slice(0, 19),
      note: data.note,
      pipeline_id : String(queryData[0].id),
    }
    console.log(payload);
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
          <span> ثبت کاریز</span>
        </div>
        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Select
                label="کاریز فعلی"
                name="stage"
                required
                placeholder="انتخاب کاریز"
                options={[
                  { value: "ارتباط", label: "ارتباط" },
                  { value: "مذاکره", label: "مذاکره" },
                  { value: "ارسال پیشنهاد", label: "ارسال پیشنهاد" },
                  { value: "عقد قرارداد", label: "عقد قرارداد" },
                ]}
                disabled
              />
              <Form.Select
                label="کاریز جدید"
                name="new_stage"
                required
                placeholder="انتخاب کاریز"
                options={[
                  { value: "ارتباط", label: "ارتباط" },
                  { value: "مذاکره", label: "مذاکره" },
                  { value: "ارسال پیشنهاد", label: "ارسال پیشنهاد" },
                  { value: "عقد قرارداد", label: "عقد قرارداد" },
                  { value: "لغو شده", label: "لغو شده" },
                ]}
              />
            </div>
            <div className="flex gap-5">
              <Form.Date
                label="تاریخ تغییر"
                name="changed_at"
              />
              <Form.Input
                label="یادداشت"
                name="note"
                placeholder="یادداشت (اختیاری)"
              />
            </div>
            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال ثبت..."
                  : "ثبت کاریز"}
              </Button>
            </div>
          </Form>
        </div>
        <div className="mt-5">
           <Table
           Title="لیست همه کاریز ها"
           table={
             <JsonTable
               columns={stageChangeColumns as any}
               data={queryData[0]?.stage_changes as any}
               searchableKeys={["previous_stage", "new_stage", "changed_at", "note"]}
             />
           }
           />
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
